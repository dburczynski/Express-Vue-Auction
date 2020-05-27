<template>
<div class="auction-div"> 
  <div class="auction-box" v-if="isLoaded && post != null">
    <h1>Auction</h1>
      <p v-text="'Name: '+post.name">
      <p v-text="'Price: '+post.price"/>
      <p v-text="'Type: '+post.type"/>
      <p v-text="'Creator: '+post.creator"/>
      <div v-if="isAuthenticated && post.creator == username && post.status == 'NEW'">
        <button class="button" @click="edit">Edit</button>
        <button class="button" @click="start">Start</button>
      </div>
      <div v-if="isAuthenticated && post.creator == username && post.status == 'BID'">
        <button class="button" @click="edit">End Auction</button>
      </div>
      
      <div v-if="isAuthenticated && !isAuthenticating && isLoaded  && post.creator != username">
        <div v-if="post.type == 'BID'">
          <input id="auction-bid-input" ref="auction-bid-input" class="input" type="number" :min="post.price+0.01" step="0.01" :placeholder="post.price" required="">
          <button class="button">Bid</button>
        </div>
        <div v-if="post.type == 'BUY'">
          <button class="button" @click="buy">Buy now</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

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
      post: null,
    }
  },
  beforeCreate() {
    axios.get('/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
        this.username = resp.data["username"]
        this.isAuthenticating = false
      })
      var json = {
        "index": window.location.href.split('id:').slice(-1)[0].toString()
      }
      axios.post('/auction/auction', json)
      .then(resp => {
        this.post = resp.data["auction"]
        this.isLoaded = true
      })
  },
  
  methods: {
    buy() {
      var reqjson =  {
        "index": this.post._id
      }
      axios.post("/auction/buy", reqjson)
      .then(() => {})
      window.location.href = "/myauctions"
    },

    start() {
      var reqjson = {
        "index": this.post._id
      }
      axios.post("/auction/start", reqjson)
        .then(() => {})
        window.location.href = "/myauctions"
    },

    edit() {
      var path = "/edit-auction/id:"+this.post._id
      window.location.href = path
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