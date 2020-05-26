const express = require("express");
const router = new express.Router();
const User = require("../model/index");
const Auction = require("../model/auction")


// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

// „wyłapywanie”  odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router
    .route("/")
    .get((req, res) => {
        
        if(req.isAuthenticated())
            res.send("Home page");
        else
            res.redirect("/login")
    })
    .all(rejectMethod);

router
    .route("/user-status")
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
    .all(rejectMethod);

router
    .route("/user-auction-data")
    .get((req,res) => {
        if(req.isAuthenticated()) {

            Auction.find( {creator: req.user.username, status: "BID"}).count( (err, count) => {
                res.json({
                    "auctions": count
                })
            })
        }
    })
    .all(rejectMethod);

router
    .route("/user-bid-data")
    .get((req,res) => {
        if(req.isAuthenticated()) {

            Auction.find( {bidders: req.user.username, status: "BID"}).count( (err, count) => {
                res.json({
                    "bids": count
                })
            })
        }
    })
    .all(rejectMethod);

router
    .route("/login")
    .post(passport.authenticate("local"), async (req, res) => {
        await res.redirect("/user-status");
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/user-status");
    })
    .all(rejectMethod);

router
    .route("/register")
    // „dla treningu”, inaczej niż w przykładzie z wykładu
    // (tsw-mongo-crud) użyjemy tutaj async/await
    .post(async (req, res) => {
        try {
            let passwordHash = bcrypt.hash(req.body.password);
            let user = new User({
                username: req.body.username,
                password: passwordHash
            });
            let doc = await user.save();
            res.json(doc);
        } catch (err) {
            if (!req.body.password) {
                // Unprocessable Entity
                res.status(422).json({
                    password: "Error – password must not be empty!"
                });
            } else {
                res.status(422).json(User.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

// przykładowe „API” – oczwiście musi być serwowane przez HTTPS!
router
    .route("/api/users")
    // tutaj uwierzytelniamy się przez HTTP – metodą Basic
    .get(passport.authenticate("basic", {
        session: false
    }), (req, res) => {
        User.find({}, (err, data) => {
            if (err) {
                res.code(500);
            } else {
                res.json(data);
            }
        });
    })
    .all(rejectMethod);


module.exports = router;
