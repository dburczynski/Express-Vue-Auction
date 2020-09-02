<template>
  <div class="right-panel">
    <div class="right-panel-div" v-if="this.isAuthenticated">
      <div class="right-panel-box">
        <p v-text="'Welcome: '+this.username"></p>
        <p v-text="'Auctions: '+this.auctionCount"></p>
        <p v-text="'Bids: '+this.bidCount"></p>
        <button class="right-panel-button" @click="logout">Logout</button>
        <div v-if="this.newMessages">
          <button class="right-panel-button-new" @click="messenger">Messenger</button>
        </div>
        <div v-if="!this.newMessages">
          <button class="right-panel-button" @click="messenger">Messenger</button>
        </div>
      </div>
    </div>
    <div class="right-panel-div" v-if="!this.isAuthenticated">
      <div class="right-panel-box">
        <span v-if="loginError">
          <p>Incorrect username or password</p>
        </span>
        <span v-if="usernameError">
          <p>Please enter username.</p>
        </span>
        <input id="username-input" ref="username-input" class="input" type="text" placeholder="username" required="">
        <span v-if="passwordError">
          <p>Please enter password.</p>
        </span>
        <input id="password-input" ref="password-input" class="input" type="password" placeholder="password" required="">
        <button class="right-panel-button" @click="login">Login</button>
         <div>
        <a>Not a user? </a>
        <a href='/register'>Register</a>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'
import store from '../store'
import bus from '../bus'
import io from '@/../node_modules/socket.io-client'

export default {
    name: 'RightPanel',
  data () {
    return {
      isAuthenticated: false,
      username: null,
      usernameError: false,
      passwordError: false,
      loginError: false,
      auctionCount: 0,
      bidCount: 0,
      newMessages: false,
      socket: null,
    }
  },
  created() {
    this.authenticate()
    this.setupEventBus()
    this.getInitialData()
    this.socketSetup();
  },

  methods: {
    authenticate() {
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
    },
    setupEventBus() {
      bus.$on('authenticateChange', () => {
        this.isAuthenticated = this.$store.state.isAuthenticated
        this.username = this.$store.state.username
      })
      bus.$on('read-message', () => {
        axios.get('/api/conversations/unread-messages')
        .then((resp) => {
          if(resp.data["newMessages"] == true) {
            this.newMessages = true
          }
          else {
            this.newMessages = false
          }
        })
      })
    },

    getInitialData() {
      if(this.isAuthenticated) {
        axios.get('/api/user-auction-data')
        .then((resp) => {
          console.log(resp.data["auctions"])
          this.auctionCount = resp.data["auctions"]
        })
        axios.get('/api/user-bid-data')
        .then((resp) => {
          this.bidCount = resp.data["bids"]    
        })
        axios.get('/api/conversations/unread-messages')
        .then((resp) => {
          if(resp.data["newMessages"] == true) {
            this.newMessages = true
            bus.$emit("read-message")
          }
          else {
            this.newMessages = false
          }
        })
       }
    },

    socketSetup() {
      if(this.isAuthenticated) {
        this.socket = io()
        this.socket.on("new-message", () => {
          axios.get('/api/conversations/unread-messages')
          .then((resp) => {
            if(resp.data["newMessages"] == true) {
              this.newMessages = true
              bus.$emit("read-message")
            }
            else {
              this.newMessages = false
            }
          })
        })
      }
    },
    
    login () {
      if(this.$refs["username-input"].value.length == 0) { this.usernameError = true }
      else { this.usernameError = false }

      if(this.$refs["username-input"].value.length == 0) { this.passwordError = true }
      else { this. passwordError = false }

      if(!this.usernameError || ! this.passwordError) {
        var userCredentials = {
        "username": this.$refs["username-input"].value,
        "password": this.$refs["password-input"].value
        }
        
        axios.post('/api/login', userCredentials)
        .then((resp) => {
          store.dispatch('authenticate')
          store.dispatch('setUsername',  resp.data.username)
          bus.$emit('authenticateChange', true)
            
          axios.get('/api/user-auction-data')
          .then((resp) => {
            this.auctionCount = resp.data["auctions"]
          })
          axios.get('/api/user-bid-data')
          .then((resp) => {
            this.bidCount = resp.data["bids"]    
          })
          axios.get('/api/conversations/unread-messages')
          .then((resp) => {
            if(resp.data["newMessages"] == true) {
              this.newMessages = true
            }
          })
        })
        .catch(() => {
          this.loginError = true
        })
      }
    },

    logout () {
      axios.get("/api/logout")
        .then(() => {
          store.dispatch({type: 'unauthenticate'})
          store.dispatch({type: 'removeUsername'})
          bus.$emit('authenticateChange', false)
          window.location.href = "/"
        })
    },

    messenger() {
      window.location.href = "/messenger"
    }
  }
}
</script>

<style lang="scss">
  .right-panel {
    height: 100%;
    width: 100%;
    margin-top: 150px;
  }
  .right-panel-div {
    padding: 8% 0 0;
    position: relative;
    margin: auto; 
    width: $div_width;
    margin: 40px;
    
  }
  .right-panel-box {
    background: $div_background;
    text-align: center;
    max-width: $div_width;
    padding: 40px;
    position: relative;
    box-shadow: $box_shaddow;
  }

  .right-panel-box input  {
    background: $input_background;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: $box_size;
    font-size: $normal_font_size;
    
  }

  .right-panel-button {
    background: $button_color;
    height: 40px;
    width: 100px;
    border: 0;
    margin: 5px 10px 15px;
  }
    .right-panel-button-new {
    background: red;
    height: 40px;
    width: 100px;
    border: 0;
    margin: 5px 10px 15px;
  }
  .right-panel-button:hover {
    background: $button_hover_color;
  } 
</style>
