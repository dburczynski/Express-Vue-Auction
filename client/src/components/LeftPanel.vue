<template>
  <div class="left-panel">
   
    <div class="login-div" v-if="!isAuthenticated">
      <div class="login-box">
        <input id="email-input" ref="email-input" class="input" type="text" placeholder="email" required="">
        <input id="password-input" ref="password-input" class="input" type="password" placeholder="password" required="">
        <button class="button" @click="login">Login</button>
         <div>
        <a>Not a user?</a>
        <a href='/register'>Register</a>
        </div>
      </div>
    </div>
    <div class="user-menu" v-else>
       <button class="menu-button" @click="navigateToAllAuctions">All auctions</button>
      <button class="menu-button" @click="navigateToMyAuction">My auctions</button>
      <button class="menu-button" @click="navigateToMyHistory">My History</button>
      <button class="menu-button" @click="logout">Logout</button>
     
    </div>

  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'LeftPanel',
    props: {
      isLoading: {
        type: Boolean,
        default: true
      }
    },
  data () {
    return {
      isAuthenticated: {
        type: Boolean,
        default: false
      }
    }
  },
  beforeCreate() {
    axios.get('/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
      })
  },
  
  methods: {
    login () {
      var userCredentials = {
        "username": this.$refs["email-input"].value,
        "password": this.$refs["password-input"].value
      }
      axios.post('/login', userCredentials)
          .then(() => {
              location.reload();
          })
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
      // Simulate a mouse click:
        window.location.href = "/myauctions"
    },
    navigateToMyHistory() {
      window.location.href = "/myhistory"
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