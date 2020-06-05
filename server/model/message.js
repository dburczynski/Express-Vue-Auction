const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date_sent: {
        type: Number
    },
    text: {
        type: String
    }


});


const Message = mongoose.model("Message", messageSchema);
Message.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Message;