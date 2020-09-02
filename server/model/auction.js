const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    creator: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['NEW','BID','SOLD','FAILED'],
        default: 'NEW'
    },
    info: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['BID','BUY'],
        default: 'BID'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: [0.01, "Not for free!"]

    },
    start_time: {
        type: Number 
    },
    end_time: {
        type: Number
    },
    bidders: [{type: String}],
    highest_bidder: {
        type: String,
    }

});


const Auction = mongoose.model("Auction", auctionSchema);
Auction.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Auction;