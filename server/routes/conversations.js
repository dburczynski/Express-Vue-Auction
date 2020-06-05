const express = require("express");
const router = new express.Router();
const User = require("../model/index");
const Conversation = require("../model/conversation")
const Message = require("../model/message")

const passport = require("../passport");

const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router.route("/conversations")
.get((req,res) => {
    Conversation.find({}).where("users").in([req.user.username]).exec((err, docs) => {
        res.json(docs)
    })
})
router.route("/conversation")
.post((req,res) => {
    Conversation.findOne( {"users": req.body["users"] }, (err,doc) => {
        res.json(doc)
    })
})
router.route("/conversation-create")
.post((req,res) =>  {
    Conversation.find( { "users": req.body["users"] }, (err, docs) => {
        if(!docs.length) {
            let new_conversation = new Conversation( { "users": req.body["users"] } )
            new_conversation.save()
        }
        res.json({})
    })
})

router.route("/messages")
.post((req,res) => {
    Message.find( { $or: [{"from": req.body["from"], "to": req.body["to"]}, {"from": req.body["to"], "to": req.body["from"]}] }).sort("send_date").exec( (err,docs) => {
        
        res.json(docs)
    })
})



router.route("/new-message")
.post((req,res) => {
  let new_message = new Message({ from: req.body["from"], to: req.body["to"], text: req.body["text"], date_sent: new Date().getTime()})
  new_message.save()
  res.json({})
})



module.exports = router