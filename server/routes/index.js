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
        await res.redirect("/api/user-status");
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/api/user-status");
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
    .all(rejectMethod);
router
    .route("/user-exists")
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
