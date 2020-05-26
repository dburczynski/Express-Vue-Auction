<template>
<div class="login-div">
      <div class="login-box" v-if="post != null && !isLoading && post.creator == username">
        <input id="auction-name-input" ref="auction-name-input" class="input" type="text" placeholder="auction name" required="">
        <input id="auction-price-input" ref="auction-price-input" class="input" type="number" min="0.01" step="0.01" placeholder="0.01" required="">
        <div class="select-type">
            <select id="auction-type-select" ref="auction-type-select">
              <option value="BID"> Bid type</option>
              <option value="BUY">Buy now type</option>
            </select>
        </div>
        <button class="button">Save</button>
        <button class="button">Save and start</button>
        
      </div>
      <div class ="login-box" v-if="post != null && !isLoading  &&  post.creator != username && isAuthenticated">
        I am viewing
      </div>
      <div class="login-box" v-if="post != null  && !isLoading && post.creator != username && !isAuthenticated">
        I am guest
      </div>
</div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'Auction',
    props: {
      isLoading: {
        type: Boolean,
      }
    },
  data () {
    return {
      isAuthenticated: {
        type: Boolean,
        default: false
      },
      isAuthenticating: {
        type: Boolean,
        default: true
      },
      username: {
          type: String,
          default: ""
      },
      post: null,
    
    }
    
  },
  beforeCreate() {
    this.isAuthenticating = true;
    axios.get('/user-status')
      .then((resp) => {
        console.log(this.isLoading)
        this.isAuthenticated = resp.data["isAuthenticated"]
        this.username = resp.data["username"]
        console.log(this.username)
        this.isLoading =false;
                console.log(this.isLoading)

      })
        var json = {
      "index": window.location.href.split('id:').slice(-1)[0].toString()
    }
    
      axios.post('/auction/auction', json)
      .then(resp => {
            this.post = resp.data["auction"]
            console.log(this.post)
      })
  },
  
  methods: {

    // save() {
    //   var reqbody = {
    //       "name": this.$refs['auction-name-input'].value,
    //       "price": this.$refs['auction-price-input'].value,
    //       "status": "NEW",
    //       "type": this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value
    //     }
    //   axios.post("/auction/create", reqbody)
    //     .then(() => {
    //         window.location.href = "/"
    //     })
      
  
    // },
    // saveAndStart() {

    // }
   
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
    margin: 15px;
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