<template>
<div class="auction-div"> 
  <div class="auction-box" v-if="isLoaded && auction != null">
    <h1>Auction</h1>
      <p v-text="'Name: '+auction.name">
      <p v-text="'Price: '+auction.price"/>
      <p v-text="'Type: '+auction.type"/>
      <p v-text="'Creator: '+auction.creator"/>
      <p v-if="auction.end_time != null && new Date(this.auction.end_time).getTime() >= new Date().getTime()" v-text="'Time left: '+this.time_left"/>
      <div v-if="isAuthenticated && auction.creator == username && auction.status == 'NEW'">
        <button class="button" @click="edit">Edit</button>
        <button class="button" @click="start">Start</button>
      </div>
      <div v-if="isAuthenticated && !isAuthenticating && isLoaded  && auction.creator != username">
        <div v-if="auction.type == 'BID' && auction.status == 'BID'">
          <input id="auction-bid-input" ref="auction-bid-input" class="input" type="number" :min="auction.price+0.01" step="0.01" :placeholder="auction.price" required="">
          <button class="button" @click="bid">Bid</button>
        </div>
        <div v-if="auction.type == 'BUY' && auction.status == 'BID'">
          <button class="button" @click="buy">Buy now</button>
        </div
        >
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
      isAuthenticating: true,
      isLoaded: false,
      username: {
          type: String,
          default: ""
      },
      time_left: null,
      timer: null,
      auction: null,
      socket: io(),
    }
  },
  beforeCreate() {
    axios.get('/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
        this.username = resp.data["username"]
        this.isAuthenticating = false
        var json = {
        "index": window.location.href.split('id:').slice(-1)[0].toString()
        }
        axios.post('/auction/auction', json)
        .then(resp => {
          this.auction = resp.data["auction"]
          this.isLoaded = true
          
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
          }
        })
        
      })
      
  },
  created() {

    window.onbeforeunload = () => {
      if(this.isAuthenticated) { 
        this.socket.emit('leave-auction', { "_id": this.auction._id }) 
      }
    }
    
    this.socket.on("new-bid", () => {
       axios.post('/auction/auction', { "index": this.auction._id})
      .then(resp => {
        this.auction = resp.data["auction"]
      })
    })
  },

  methods: {
    buy() {
      var reqjson =  {
        "index": this.auction._id
      }
      axios.post("/auction/buy", reqjson)
      .then(() => {})
      window.location.href = "/myauctions"
    },

    start() {
      var reqjson = {
        "index": this.auction._id
      }
      axios.post("/auction/start", reqjson)
        .then((resp) => {
          console.log(""+resp)
          console.log(this.auction._id)
          this.socket.emit("auction-start", { _id: this.auction._id })
        })
        window.location.href = "/myauctions"
    },

    edit() {
      var path = "/edit-auction/id:"+this.post._id
      window.location.href = path
    },
    bid() {

      axios.post("/auction/bid", { "_id": this.auction._id, "bid": this.$refs["auction-bid-input"].value})
      .then((resp) => {
        if(resp["status"] == true)
          console.log(true)
          this.socket.emit("auction-bid", { "_id": this.auction._id, "new_bid": this.$refs["auction-bid-input"].value })   
      })
    }
  }

}
</script>

<style lang="scss">

  .auction-div {
    padding: 8% 0 0;
    position: relative;
    margin: auto; 
    width: 300px;
    min-width: 50px;
  }
  .auction-box {
    background: #ffffff;
    text-align: center;
    max-width: 300px;
    padding: 40px;
    position: relative;
    box-shadow: 0px 1px 5px black;
  }
  .auction-box input  {
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
    
  }
  .button {
    background: #22bd7e;
    height: 40px;
    width: 100px;
    border: 0;
    margin: 15px;
  }
  .button:hover {
    background: #1da16b;
  } 

</style>