// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

// jako „bazy” używamy Express.js
const express = require("express");
const app = express();
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
var history = require('connect-history-api-fallback');
const Auction = require("./model/auction")
const Message = require("./model/message")
const cors = require("cors")


app.use(cors())
// eslint-disable-next-line no-undef
app.use("/public",express.static(__dirname + "/public"));
// eslint-disable-next-line no-undef
app.use("/js", express.static(__dirname + "/public/js"))
// eslint-disable-next-line no-undef
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
    // eslint-disable-next-line no-undef
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// do obsługi autoryzacji używamy Passport.js
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

const server = require("./https")(app);
const io = socketio(server) 
module.exports = io

// routing aplikacji
const routes = require("./routes");
app.use("/api/",routes);
const auction_routes = require("./routes/auction")
app.use("/api/auction", auction_routes)
//const auction_api_routes = require("./routes/auction-api")
//app.use("/test/auction", passport.authenticate('jwt', {session: false}), auction_api_routes)
const messenger_routes = require("./routes/conversations");
const Conversation = require("./model/conversation");
app.use("/api/conversations",messenger_routes)
// wyłapujemy odwołania do nieobsługiwanych adresów




// eslint-disable-next-line no-undef
 app.get('/*', (req,res) => res.sendFile(__dirname+"/public/index.html"));

app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
// eslint-disable-next-line no-undef
const port = process.env.PORT;



io.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: "$sekretny $sekret",
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
    }))



io.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);
    socket.join(socket.request.user.username)
    
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
            var conversationUser = [ data.from, data.to ]

            Conversation.findOne( { users: conversationUser.sort() }, (err, doc) => {
                doc.unread = data.to
                doc.save()
            })

            console.log(socket.id+" is sending a message to "+data._id)
            io.sockets.in("chat:"+data._id).emit("receive-message", newMessage)
            io.sockets.in(data.to).emit("new-message")
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
    
    socket.on("leave-auction", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
            console.log("Socket: "+socket.id+" is leaving auction:"+data._id)
            socket.leave("auction:"+data._id)
        }
    })
    socket.on("auction-bid", (data) => {
        if(socket.request.user && socket.request.user.logged_in) {
            Auction.findOne({ _id: data._id}, (err, doc) => {
                if(doc.end_time > new Date(Date.now()).getTime()) {
                    if(doc.price < data.new_bid && doc.status == 'BID' && doc.type == 'BID') {
                        doc.highest_bidder = socket.request.user.username
                        if(!doc.bidders.includes(socket.request.user.username)) {
                            doc.bidders.push(socket.request.user.username)
                        }
                        doc.price = data.new_bid
                        doc.save()
                        for(let i = 0; i < doc.bidders.length; i++) {
                            io.sockets.in(doc.bidders[i]).emit("overbid", doc)
                        }
                        io.sockets.in(doc.creator).emit("overbid", doc)
                        io.sockets.in("auction:"+data._id).emit("new-bid")
                    }
                }
                else {
                    if(doc.highest_bidder) {
                        doc.status = "SOLD"
                        io.sockets.in(doc.highest_bidder).emit("buy");
                    }
                    else 
                        doc.status = "FAILED"
                    doc.save()
                    io.sockets.in("auction:"+doc._id).emit("leave");
                }
            })    
        }
    })
    socket.on("bought", (data) => {
        Auction.findOne({ _id: data._id}, (err, doc) => {
            if(doc.end_time > new Date(Date.now())) {
                doc.highest_bidder = socket.request.user.username 
                doc.bidders = [socket.request.user.username]
                doc.status = "SOLD"
                doc.save()
                io.sockets.in(doc.highest_bidder).emit("buy");
                io.sockets.in("auction:"+doc._id).emit("leave");
                
            }
            else {
                doc.status = "FAILED"
                doc.save()
                io.sockets.in("auction:"+doc._id).emit("leave");
            }
        })
    })
})


server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
})

