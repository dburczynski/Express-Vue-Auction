const express = require("express");
const router = new express.Router();
const User = require("../model/index");
const Auction = require("../model/auction")
const passport = require("../passport");

const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

    router.route("/auctions")
    .get((req,res) => {
        Auction.find(
            { "status": "BID" }
        ).limit(10)
        .sort( { "bidders": -1 })
        .exec((err, docs) => {
            res.json(docs)
        })
    })


    router.route("/auction")
        .post((req,res) => {
            Auction.findOne( {_id: req.body["index"]}, (err,docs) => {
                res.json({ "auction": docs })
            })
        })

    router.route("/buy")
        .post((req, res) => {
            Auction.findOne( { _id: req.body["index"]}, (err, doc) => {
                var temp = new Date(doc.end_time).getTime()
                if(temp <= new Date().getTime() && doc.type == "BUY" && doc.status == "BID") {
                    doc.highest_bidder = req.user.username
                    doc.status = "SOLD"
                    doc.save()
                }
                
            })
        })

    router.route("/start")
        .post((req, res) => {
            Auction.findOne( { _id: req.body["index"]}, (err, doc) => {
                if(req.user.username == doc.creator && doc.status == "NEW") {
                    doc.end_time = new Date(new Date().getTime()+(1 * 3 * 60 * 1000)).getTime();
                    doc.status = "BID"
                    doc.save()
                }
                setTimeout(() => {
                    Auction.findOne( { _id : req.body["index"] }, (err,doc) => {
    
                        if(doc.highest_bidder != null) {
                            doc.status = "SOLD"
                        }
                        else {
                            doc.status = "FAILED"
                        }
                        doc.save()
    
                        } 
                    )},(1*1*60*1000))     
            })
            
            res.json({})
        })

    router.route("/edit")
        .post((req, res) => {
            Auction.findOne( { _id: req.body["_id"]}, (err, doc) => {
                doc.name = req.body["name"],
                doc.price = req.body["price"],
                doc.type = req.body["type"]
                doc.save()
            })
        })
    router.route("/create")
    .get((req,res) => {
        if(req.isAuthenticated()) {
            
            Auction.find( {}, (err,docs) => {
                res.json(docs)
            } )
        }
        else {
            res.redirect("/login")
        }

    })
    .post((req,res) => {
        if(req.isAuthenticated()) {
            var newAuction = new Auction({"creator": req.user.username, "name": req.body["name"], "status": "NEW", "type": req.body["type"], "price": req.body["price"]});
            newAuction.save()
            res.json({})
        }
    })
    router.route("/bid")
    //TODO add new as status
    .post((req, res) => {
        Auction.findOne( { _id: req.body["_id"]}, (err, doc) => {
            if(doc.price < req.body["bid"]) {
                doc.highest_bidder = req.user.username
                if(!doc.bidders.includes(req.user.username)) {
                    doc.bidders.push(req.user.username)
                }
                doc.price = req.body["bid"]
                doc.save()
                res.json({"status": true})
            }
            else {
                console.log("not found")
                res.json({"status": false})
            }
        })
    })
    
    router.route("/myauctions")
    .get((req,res) => {
        if(req.isAuthenticated()) {
            Auction.find( { $or: [{creator: req.user.username, status: "NEW"},
                            {creator: req.user.username, status: "BID"},
                            {bidders: req.user.username, status: "BID"}] }, (err,docs) => {
               res.json(docs);
            })
        }
        else {
            res.redirect("/")
        }
    })
    router.route("/myhistory")
    .get((req,res) => {
        if(req.isAuthenticated()) {
            Auction.find( { $or: [{creator: req.user.username, status: "SOLD"},
                            {creator: req.user.username, status: "FAILED"},
                            {bidders: req.user.username, status: "SOLD", highest_bidder: { $in: [req.user.username]}},
                            {bidders: req.user.username, status: "SOLD", highest_bidder: { $nin: [req.user.username]}}  ] }, (err, docs) => {
                res.json(docs)
            })
        }
        else {
            res.redirect("/")
        }
    })

module.exports = router