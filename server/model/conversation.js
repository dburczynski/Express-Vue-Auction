const mongoose = require("../mongoose");
const Message = require("./message")
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    
    users: [{type: String}],
    messages: [{type: Message.schema}]

});


const Conversation = mongoose.model("Conversation", conversationSchema);
Conversation.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Conversation;