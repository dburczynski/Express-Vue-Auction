const express = require("express");
const router = new express.Router();
const Conversation = require("../model/conversation")
const Message = require("../model/message")


router.route("/conversations")
.get((req,res) => {
    if(req.isAuthenticated()) {
        Conversation.find({}).where("users").in([req.user.username]).exec((err, docs) => {
            res.json(docs)
        })
    }
})

router.route("/conversation")
.post((req,res) => {
    if(req.isAuthenticated()) {
        Conversation.findOne( {"users": req.body["users"].sort() }, (err,doc) => {
            res.json(doc)
        })   
    }
})

router.route("/conversation-create")
.post((req,res) =>  {
    if(req.isAuthenticated()) {
        Conversation.find( { "users":  req.body["users"].sort() }, (err, docs) => {
            if(!docs.length) {
                let new_conversation = new Conversation( { "users": req.body["users"], unread: "" } )
                new_conversation.save()
            }
        })
    }    
    res.json({})
})

router.route("/messages")
.post((req,res) => {
    if(req.isAuthenticated()) {
        Message.find( { $or: [{"from": req.body["from"], "to": req.body["to"]}, {"from": req.body["to"], "to": req.body["from"]}] }).sort("send_date").exec( (err,docs) => {
            res.json(docs)
        })
    }
})



router.route("/new-message")
.post((req,res) => {
  let new_message = new Message({ from: req.body["from"], to: req.body["to"], text: req.body["text"], date_sent: new Date().getTime()})
  new_message.save()
  let conversationUser = [ req.body["from"], req.body["to"] ]
  Conversation.findOneAndUpdate( { users: conversationUser } , { unread:req.body["to"] })
  res.json({})
})

router.route("/read-messages")
.post((req,res) => {
    if(req.isAuthenticated()) {
    
        let conversationUser = [ req.body["from"], req.body["to"] ]
        Conversation.findOne( { users: conversationUser.sort() }, (err, doc) => {
            doc.unread = req.body["to"]
            doc.save()
        })
        res.json({ "isRead": true })
    }
})

router.route("/unread-messages")
.get((req,res) =>  {
    if(req.isAuthenticated()) {
       Conversation.count( {users: { $in: [req.user.username] }, unread: req.user.username}, (err, count) => {
            if(count > 0) {
                res.json( { newMessages: true })
            }
            else {
                res.json( { newMessages: false})
            }
            console.log
        })
    }
})



module.exports = router