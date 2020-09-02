const express = require("express");
const router = new express.Router();
const User = require("../model/index");
const Auction = require("../model/auction")

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

router.route("/")
.get((req, res) => {
    
    if(req.isAuthenticated())
        res.send("Home page");
    else
        res.redirect("/login")
    })


router.route("/user-status")
.get((req,res) => {
    if(req.isAuthenticated()) {
        res.json({
            "isAuthenticated": true,
            "username": req.user.username
        })
    }
    else {
        res.json({
            "isAuthenticated": false,
            "username": ""
        })
    }
})
 

router.route("/user-auction-data")
.get((req,res) => {
    if(req.isAuthenticated()) {
        Auction.find( {creator: req.user.username, status: "BID"}).count((err,count) => {
            if(err) 
                console.log(err)
            else
                res.json({
                "auctions": count
                })
        })
    }

})

router.route("/user-bid-data")
.get((req,res) => {
    
    if(req.isAuthenticated()) {
        Auction.find( {bidders: req.user.username, status: "BID"}).count( (err, count) => {
            if(err) 
                console.log(err)
            else
                res.json({
                    "bids": count
                })
        })
    }
})

router.route("/login")
.post(passport.authenticate("local"), async (req, res) => {
    await res.redirect("/api/user-status");
})

router.route("/logout")
.get((req, res) => {
    req.logout();
    res.redirect("/api/user-status");
})


router.route("/register")
.post(async (req, res) => {
    try {
        let passwordHash = bcrypt.hash(req.body.password);
        let user = new User({
            username: req.body.username,
            password: passwordHash
        });
        
        await user.save();
        res.json({
            "usernameError": false,
            "passwordError": false
        });
    } 
    catch (err) {
        if (!req.body.password) {
            res.json({
                "usernameError": false,
                "passwordError": true
            });
        } 
        if( !req.body.username) {
            res.json({
                "usernameError": true,
                "passwordError": false
            });
        }
        if(!req.body.username && !req.body.password) {
            res.json({
                "usernameError": true,
                "passwordError": true
            });
        }
    } 
})

router.route("/user-exists")
.post((req,res) => {
    User.findOne( {"username": req.body["username"]}, (err,docs) => {
        if(!docs) {
            res.json({
                "loginError": false
            })
        }
        else {
            res.json({
                "loginError": true
            })
        }
    })
})

module.exports = router;
