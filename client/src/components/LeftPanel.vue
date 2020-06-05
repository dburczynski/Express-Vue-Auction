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
    axios.get('/api/user-status')
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
        axios.post('/api/login', userCredentials)
        .then(() => {
          location.reload()
        })
        this.loginError = true
      }
      
    },
    logout () {
      axios.get("/api/logout")
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
    position: relative;
    margin-top: 100px;
  }
  .user-menu {
    position: relative;
    margin: auto;
    width: 250px;
    background: $div_background;
    box-shadow: $box_shaddow;
    position: relative;

  }
  .menu-button {
    background: $button_color;
    height: 50px;
    width: 120px;
    border: 0;
    margin-top: 40px;
    margin-bottom: 40px;
    margin-left: 65px;
    margin-right: 65px;
  }
  .menu-button:hover {
    background: $button_hover_color;
  } 
</style>