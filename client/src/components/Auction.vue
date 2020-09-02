<template>
<div class="auction-div"> 
  <div class="auction-box" v-if="!isLoading && auction != null">
    <h1>Auction</h1>
      <p v-text="'Name: '+auction.name"/>
      <p v-text="'Info: '+auction.info"/>
      <p v-text="'Price: '+auction.price"/>
      <p v-text="'Type: '+auction.type"/>
      <p v-text="'Creator: '+auction.creator"/>
      <p v-if="auction.status == 'BID' && this.time_left !=null" v-text="'Time left: '+this.time_left"/>
      <p v-else v-text="new Date(this.auction.start_time).toDateString()"/>
      <div v-if="isAuthenticated && auction.creator == username && auction.status == 'NEW'">
        <button class="auction-button" @click="edit">Edit</button>
        <button class="auction-button" @click="cancel">Cancel auction</button>
      </div>
      <div v-if="isAuthenticated && auction.creator == username && auction.status == 'SOLD'">
          <button class="auction-button" @click="newConversation">Contact buyer</button>
      </div> 
      <div v-if="isAuthenticated && !isLoading  && auction.creator != username">
        <div v-if="auction.type == 'BID' && auction.status == 'BID'">
          <input id="auction-bid-input" ref="auction-bid-input" class="input" type="number" :min="auction.price+0.01" step="0.01" :placeholder="auction.price" required="">
          <button class="auction-button" @click="bid">Bid</button>
        </div>
        <div v-if="auction.type == 'BUY' && auction.status == 'BID'">
          <button class="auction-button" @click="buy">Buy now</button>
        </div>
        <div v-if="auction.creator != username">
          <button class="auction-button" @click="newConversation">Contact seller</button>
        </div> 
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'
import io from '@/../node_modules/socket.io-client'

export default {
    name: 'Auction',
   
  data () {
    return {
      isAuthenticated: false,
      isLoading: true,
      username: null,
      time_left: null,
      timer: null,
      auction: null,
      socket: io(),
    }
  },
  created() {
      
    this.isAuthenticated = this.$store.state.isAuthenticated
    this.username = this.$store.state.username
    var json = {
      "index": window.location.href.split('id:').slice(-1)[0].toString()
    }
    
    
    axios.post('/api/auction/auction', json)
    .then(resp => {
      if(!resp.data["auction"]) {
        window.location.href = "/"
      }
      else {
         this.auction = resp.data["auction"]
      }
     
     
      if(this.auction.end_time != null && new Date(this.auction.end_time).getTime() >= new Date().getTime()) {
        this.timer = setInterval(() => {
          
          var now = new Date().getTime();
          var to = new Date(this.auction.end_time)
          var t_left = to - now;                      
          var hours = Math.floor((t_left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          var minutes = Math.floor((t_left % (1000 * 60 * 60)) / (1000 * 60))
          var seconds = Math.floor((t_left % (1000 * 60)) / (1000))
              
          var hoursString = hours.toString();
          var minutesString = minutes.toString();
          var secondsString = seconds.toString();
          
          if(hoursString.length == 1) {
            hoursString = "0"+hoursString
          }
          if(minutesString.length == 1) {
            minutesString = "0"+minutesString
          }
          if(secondsString.length == 1) {
            secondsString = "0"+secondsString;
          }
          
          this.time_left = hoursString+":"+minutesString+":"+secondsString
              
          if(t_left <= 0) {
            clearInterval(this.timer)
            window.location.href = "/"
          }
        }) 
      }
        
      if(this.isAuthenticated && this.auction != null && this.auction.status == "BID") {
        this.socket.emit('join-auction', { "_id": this.auction._id })

        this.socket.on("new-bid", () => {
          axios.post('/api/auction/auction-price', { "_id": this.auction._id})
          .then(resp => {
            this.auction.price = resp.data["price"]
          })
        })
        this.socket.on("leave", () => {
          window.location.href = "/"
        })
      }
      window.onbeforeunload = () => {
        if(this.isAuthenticated) { 
          this.socket.emit('leave-auction', { "_id": this.auction._id }) 
        }
      }
      
      this.isLoading = false
    })
        
  },
  methods: {
    buy() {
      var reqjson =  {
        "_id": this.auction._id
      }
        this.socket.emit("bought", reqjson);
    },
    edit() {
      var path = "/edit-auction/id:"+this.auction._id
      window.location.href = path
    },
    bid() {
        this.socket.emit("auction-bid", { "_id": this.auction._id, "new_bid": this.$refs["auction-bid-input"].value})   
    },
    cancel() {
      var reqjson =  {
        "_id": this.auction._id 
      }
      axios.post("/api/auction/cancel", reqjson)
      .then(() => {})
      window.location.href = "/myauctions"
    },
    newConversation() {
      let req
      if(this.auction.creator != this.username)
          req = {
        "users": [this.auction.creator, this.username]
        }
        else {
           req = {
            "users": [this.auction.creator, this.auction.highest_bidder]
          }
        }
      axios.post("/api/conversations/conversation-create", req)
      .then(() => {
        window.location.href = "/messenger"        
      })
    }
  }

}
</script>

<style lang="scss">

  .auction-div {
    position: relative;
    margin-top: 100px;
    height: 100%;
    width: $div_width;
  }
  .auction-box {
    background: $div_background;
    text-align: center;
    max-width: $div_width;
    padding: 40px;
    position: relative;
    box-shadow: $box_shaddow;
    text-align: center;
  }
  .auction-box input  {
    background: $input_background;
    width: 100%;
    border: $no_border;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: $box_size;
    font-size: 14px;
  }
  .auction-button {
    background: $button_color;
    height: 40px;
    width: 100px;
    border: $no_border;
    margin: 15px;
  }
  .auction-button:hover {
    background: $button_hover_color;
  } 

</style>