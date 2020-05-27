<template>
  <div class="left-panel">
    <div class="user-menu" v-if="isAuthenticated && !isAuthenticating">
       <button class="menu-button" @click="navigateToAllAuctions">All auctions</button>
      <button class="menu-button" @click="navigateToMyAuction">My auctions</button>
      <button class="menu-button" @click="navigateToMyHistory">My History</button>
      <button class="menu-button" @click="navigateToCreateAuction">Create Auction</button>
    </div>
  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
  name: 'LeftPanel',

  data () {
    return {
      isAuthenticated: false,
      isAuthenticating: true,
      usernameError: false,
      passwordError: false,
      loginError: false
    }
  },

  beforeCreate() {
    axios.get('/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
        this.isAuthenticating = false;
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
        this.loginError = true
      }
      
    },
    logout () {
      axios.get("/logout")
          .then(() => {
              window.location.href = "/"
          })
    },
    navigateToAllAuctions() {
      window.location.href = "/"
    },
    navigateToMyAuction() {
        window.location.href = "/myauctions"
    },
    navigateToMyHistory() {
      window.location.href = "/myhistory"
    },
    navigateToCreateAuction() {
      window.location.href = "/create-auction"
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