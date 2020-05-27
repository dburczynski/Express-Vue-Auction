<template>
  <div class="right-panel">
    <div class="login-div" v-if="this.isAuthenticated && !this.isAuthenticating">
      <div class="login-box">
        <p v-text="'Welcome '+this.username"></p>
        <p v-text="'Auctions: '+this.auctions"></p>
        <p v-text="'Bids: '+this.bids"></p>
        <button class="button" @click="logout">Logout</button>
      </div>
    </div>
    <div class="login-div" v-if="!isAuthenticated && !isAuthenticating">
      <div class="login-box">
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
        <button class="button" @click="login">Login</button>
         <div>
        <a>Not a user?</a>
        <a href='/register'>Register</a>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'RightPanel',
  data () {
    return {
      isAuthenticated: false,
      isAuthenticating: true,
      usernameError: false,
      passwordError: false,
      loginError: false,
      username: {
          type: String,
          default: ""
      },
      auctions: {
          type: Number,
          default: 0
      },
      bids: {
          type: Number,
          default: 0
      }
  }
  },
  beforeCreate() {
    axios.get('/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
        this.username = resp.data["username"]
        this.isAuthenticating = false
      })

     axios.get('/user-auction-data')
        .then((resp) => {
            this.auctions = resp.data["auctions"]
            
    })
    axios.get('/user-bid-data')
        .then((resp) => {
            this.bids = resp.data["bids"]
            
    })
    },
    methods: {
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
        
        axios.post('/login', userCredentials)
        .then(() => {
        location.reload() 
        })
        .catch(() => {
          this.loginError = true
        })
      }
    },

    logout () {
      axios.get("/logout")
          .then(() => {
              window.location.href = "/"
          })
    }
  }
}
</script>

<style lang="scss">
  .left-panel {
    height: 100%;
    width: 100%;
  }
  .user-menu {
    position: relative;
    top: 10%;
    left: 20%;
    width: 250px;
    background: #ffffff;
    box-shadow: 0px 1px 5px black;


  }
  .login-div {
    padding: 8% 0 0;
    position: relative;
    margin: auto; 
    width: 300px;
    min-width: 50px;
    
  }
  .login-box {
    background: #ffffff;
    text-align: center;
    max-width: 300px;
    padding: 40px;
    position: relative;
    box-shadow: 0px 1px 5px black;
  }

  .login-box input  {
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
    margin: 0px 0px 15px;
  }
  .button:hover {
    background: #1da16b;
  } 

  .menu-button {
    background: #22bd7e;
    height: 50px;
    width: 130px;
    border: 0;
    margin: 60px;
  }

  .menu-button:hover {
    background: #1da16b;
  } 
</style>