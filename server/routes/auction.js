const express = require("express");
const router = new express.Router();
const Auction = require("../model/auction")
const io = require("../app")

router.route("/auctions")
.post((req,res) => {
    Auction.find(
        { "status": "BID", "end_time": { $gt: new Date(Date.now()).getTime() }}
    ).skip(req.body["index"])
    .limit(10)
    .sort( { "end_time": -1 })
    .exec((err, docs) => {
        res.json(docs)
    })
})


router.route("/auction")
.post((req,res) => {
    Auction.findOne( {_id: req.body["index"]}, (err,doc) => {
        if(doc) {
            if(doc.end_time < new Date(Date.now()).getTime()) {
                if(doc.highest_bidder) {
                    if(doc.status == "BID") {
                        io.sockets.in(doc.highest_bidder).emit("buy")
                        io.sockets.in("auction:"+doc._id).emit("leave")
                    }
                    doc.status = "SOLD"

                    
                    
                }
                else {
                    doc.status = "FAILED"
                    io.sockets.in("auction:"+doc._id).emit("leave")
                }
                doc.save() 
                res.json({ "auction" : false})
            }
            else {
                if(!doc.highest_bidder && doc.status != "SOLD" && doc.status != "FAILED" && doc.start_time < new Date(Date.now()).getTime())
                    doc.status = "BID"
                    doc.save()
                    res.json({ "auction": doc })
             }
        }
    })
    console.log("failed request")
})

router.route("/auction-price")
.post((req,res) => {
    Auction.findOne( {_id: req.body["_id"]}, (err,doc) => {
        res.json({ "price": doc.price })
    })
}) 

router.route("/buy")
.post((req, res) => {
    if(req.isAuthenticated()) { 
        Auction.findOne( { _id: req.body["_id"], "end_time": { $gt: new Date(Date.now()).getTime() }}, (err, doc) => {
            if(doc.type == "BUY" && doc.status == "BID") {
                doc.bidders.push(req.user.username)
                doc.highest_bidder = req.user.username
                doc.status = "SOLD"
                doc.save()
            }
        })
    }
    res.json({})
})

router.route("/edit")
.post((req, res) => {
    if(req.isAuthenticated()) {
        Auction.findOne( { _id: req.body["_id"], "start_time": { $lt: new Date(Date.now()).getTime() }}, (err, doc) => {
            doc.name = req.body["name"],
            doc.info = req.body["info"],
            doc.price = req.body["price"],
            doc.type = req.body["type"]
            doc.save()
        })
    }
    res.json({})
})

router.route("/create")
.post((req,res) => {
    if(req.isAuthenticated()) {
        let newAuction = new Auction({"creator": req.user.username, "name": req.body["name"], "info": req.body["info"], "status": "NEW", "type": req.body["type"], "price": req.body["price"], "end_time": new Date(req.body["end_time"]).getTime(), "start_time": new Date(req.body["start_time"]).getTime()});
        newAuction.save()

        setTimeout(() => {
            if(newAuction.status == "NEW") {
                newAuction.status = "BID"
                newAuction.save()
            }
        },(Math.abs(new Date(req.body["start_time"]).getTime() - new Date(Date.now()).getTime())))

        setTimeout(() => {
            if(newAuction.highest_bidder != null) {
                newAuction.status = "SOLD"
            }
            else {
                newAuction.status = "FAILED"
            }
            newAuction.save()
        },((new Date(req.body["end_time"]).getTime() - new Date(req.body["start_time"]).getTime())+ 3 * 60 * 1000))  
    }  
    res.json({})
})

router.route("/bid")
.post((req, res) => {
    if(req.isAuthenticated()) {
        Auction.findOne( { _id: req.body["_id"], "end_time": { $gt: new Date(Date.now()).getTime() }}, (err, doc) => {
            if(doc.price < req.body["bid"] && req.body["bid"] <= 100000) {
                doc.highest_bidder = req.user.username
                    
                if(!doc.bidders.includes(req.user.username)) {
                    doc.bidders.push(req.user.username)
                }
                doc.price = req.body["bid"]
                doc.save()
                res.json({"status": true})
            }
            else {
                res.json({"status": false})
            } 
        })
    }
})
    
router.route("/cancel")
.post((req,res) => {
    if(req.isAuthenticated()) {
        Auction.findOne( { _id: req.body["_id"] }, (err, doc) => {
            doc.status = "FAILED"
            doc.save()
        })
    }  
    res.json({})
})

router.route("/myauctions")
.post((req,res) => {
    if(req.isAuthenticated()) {
        Auction.find( { $or: [{creator: req.user.username, status: "NEW", "end_time": { $gt: new Date(Date.now()).getTime() }},
                        {creator: req.user.username, status: "BID", "end_time": { $gt: new Date(Date.now()).getTime() }},
                        {bidders: req.user.username, status: "BID", "end_time": { $gt: new Date(Date.now()).getTime() }}] })
            .skip(req.body["index"]).limit(10).exec((err, docs) => {
                res.json(docs)
            })
    }
    else {
        res.json({})
    }
    
})

router.route("/myhistory")
.post((req,res) => {
    if(req.isAuthenticated()) {
        Auction.find( { $or: [{creator: req.user.username, status: "SOLD"},
                        {creator: req.user.username, status: "FAILED"},
                        {bidders: req.user.username , status: "SOLD", highest_bidder: { $in: [req.user.username]}},
                        {bidders: req.user.username , status: "SOLD", highest_bidder: { $nin: [req.user.username]}}  ] })
        .skip(req.body["index"]).limit(10).exec((err, docs) => {
            res.json(docs)
        })
    }
    else {
        res.json({})
    } 
})

module.exports = router