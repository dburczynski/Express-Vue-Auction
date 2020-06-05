// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

// jako „bazy” używamy Express.js
const express = require("express");
const app = express();
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const path = require("path")
var history = require('connect-history-api-fallback');
const Auction = require("./model/auction")
const Message = require("./model/message")
const cors = require("cors")


app.use(cors())
//app.set("view engine", "ejs");
app.use("/public",express.static(__dirname + "/public"));
app.use("/js", express.static(__dirname + "/public/js"))
app.use("/css", express.static(__dirname + "/public/css"))

app.use(history())
// wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json())
// machnaizm sesji – z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const expressSession = require("express-session");


//socket config
const MongoStore = require('connect-mongo')(expressSession);

const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

app.use(expressSession({
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// do obsługi autoryzacji używamy Passport.js
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());
// routing aplikacji
const routes = require("./routes");
app.use("/api/",routes);
const auction_routes = require("./routes/auction")
app.use("/api/auction",auction_routes)
const messenger_routes = require("./routes/conversations")
app.use("/api/conversations",messenger_routes)
// wyłapujemy odwołania do nieobsługiwanych adresów



//HANDLE production

    // app.use(express.static(path.join(__dirname, "public")));

 app.get('/*', (req,res) => res.sendFile(__dirname+"/public/index.html"));

app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.PORT;


const io = socketio(server) 

io.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: "$sekretny $sekret",
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
    }))

io.on("connection", (socket) => {
     console.log(`Made socket connection: ${socket.id}`);

     socket.on("join-chat", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
               console.log("Socket: "+socket.id+" is joining chat:"+data._id)
               socket.join("chat:"+data._id)
           }
    })
    socket.on("send-message", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {

            let newMessage = Message( { "from": data.from, "to":data.to, "text": data.text})
            newMessage.save()
            console.log(socket.id+" is sending a message to "+data._id)
            io.sockets.in("chat:"+data._id).emit("receive-message", newMessage)
        }
     })
     socket.on("leave-chat", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
            console.log("Socket: "+socket.id+" is leaving chat:"+data._id)            
            socket.leave("chat:"+data._id);
        }
     })

     socket.on("join-auction", (data) => {
         if(socket.request.user && socket.request.user.logged_in) {
                console.log("Socket: "+socket.id+" is joining aution:"+data._id)
                socket.join("auction:"+data._id)
            }
     })
     socket.on("auction-start", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
           Auction.findOne( { _id: data._id}, (err, doc) => {
            if(socket.request.user.username == doc.creator && doc.status == "NEW") {
                doc.end_time = new Date(new Date().getTime()+(1 * 3 * 60 * 1000)).getTime();
                doc.status = "BID"
                doc.save()
                setTimeout(() => {
                    Auction.findOne( { _id : data._id}, (err,doc) => {
    
                        if(doc.highest_bidder != null) {
                            doc.status = "SOLD"
                        }
                        else {
                            doc.status = "FAILED"
                        }
                        doc.save()
    
                        } 
                    )},(1 * 3 * 60 * 1000))     
            }  
        })
           console.log("New auction created!");
        }
     })
     socket.on("leave-auction", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
            console.log("Socket: "+socket.id+" is leaving auction:"+data._id)
            socket.leave("auction:"+data._id)
        }
     })
    socket.on("auction-bid", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
            Auction.findOne( { _id: data._id}, (err, doc) => {
                if(doc.price < data.new_bid && doc.status == 'BID' && doc.type == 'BID') {
                    console.log(doc.price+" "+data.new_bid)
                    doc.highest_bidder = socket.request.user.username
                    if(!doc.bidders.includes(socket.request.user.username)) {
                        doc.bidders.push(socket.request.user.username)
                    }
                    doc.price = data.new_bid
                    doc.save()
                }
                io.sockets.in("auction:"+data._id).emit("new-bid")
            })    
        }
    })
})

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
})
