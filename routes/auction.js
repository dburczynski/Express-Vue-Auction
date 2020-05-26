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
    //TODO add new as status
    .post((req,res) =>  {
        if(req.isAuthenticated()) {
            let auctionName = req.body["name"];
            let auctionPrice = req.body["price"];
    
            let auction = new Auction({
                creator: req.user.username,
                status: req.body["status"],
                type: req.body["type"],
                name: auctionName,
                price: auctionPrice,
                bidders: []
            })
            try {
                auction.save();
            }
            catch {
                res.send("error saving")
            }
            res.redirect("/auction/myauctions")
        }
        else {
            res.send("Didnt create")
        }
    });
    
    router.route("/myauctions")
    .get((req,res) => {
        if(req.isAuthenticated()) {
            Auction.find( { $or: [{creator: req.user.username, status: "NEW"},
                            {creator: req.user.username, status: "BID"}] }, (err,docs) => {
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
                            {bidders: req.user.username, status: "SOLD"}] }, (err, docs) => {
                res.json(docs)
            })
        }
        else {
            res.redirect("/")
        }
    })

module.exports = router