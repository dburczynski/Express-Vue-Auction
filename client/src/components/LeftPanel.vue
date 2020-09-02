<template>
  <div class="left-panel">
    <div class="user-menu" v-if="isAuthenticated">
      <button class="menu-button" @click="navigateToAllAuctions">All auctions</button>
      <button class="menu-button" @click="navigateToMyAuction">My auctions</button>
      <div v-if="wins">
        <button class="menu-button-red" @click="navigateToMyHistory">My History</button>
      </div>
      <div v-else>
        <button class="menu-button" @click="navigateToMyHistory">My History</button>
      </div>
      <button class="menu-button" @click="navigateToCreateAuction">Create Auction</button>
    </div>
  </div>
</template>
<script>

import bus  from '../bus'
import io from '@/../node_modules/socket.io-client'
import store from '../store'

export default {
  name: 'LeftPanel',

  data () {
    return {
      isAuthenticated: false,
      username: null,
      socket: null,
      newHistory: false,
      wins: false
    }
  },
  created() {
    this.authenticate()
    this.setupEventBus()
    this.socketSetup()
  },

  methods: {
    authenticate() {
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
      this.wins = this.$store.state.wins
    },
    setupEventBus() {
      bus.$on('authenticateChange', () => {
          this.isAuthenticated = this.$store.state.isAuthenticated
      })
      bus.$on("wins", () => {
        this.wins = this.$store.state.wins
      })
    },
    socketSetup() {
      this.socket = io()
      if(this.isAuthenticated) {
        this.socket.on("buy", () => {
          store.dispatch('setWins')
          bus.$emit("wins")
        })
      }
    },
    navigateToAllAuctions() {
      window.location.href = "/"
    },
    navigateToMyAuction() {
      window.location.href = "/myauctions"
        
    },
    navigateToMyHistory() {
      store.dispatch('removeWins')
      bus.$emit("wins")
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
  .menu-button-red {
    background: red;
    height: 50px;
    width: 120px;
    border: 0;
    margin-top: 40px;
    margin-bottom: 40px;
    margin-left: 65px;
    margin-right: 65px;
  }
  .menu-button-red:hover {
    background: pink;
  } 
</style>