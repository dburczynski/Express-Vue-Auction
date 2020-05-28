<template>
  <div class="auction-page">
   
    <div class="create-auction-div" v-if="isAuthenticated">
      <div class="auction-box">
        <span v-if="nameError">
          <p>Name can't be empty</p> 
        </span>
        <input id="auction-name-input" ref="auction-name-input" class="input" type="text" placeholder="auction name" required="">
        
        <span v-if="priceError">
          <p>Price can't be empty/smaller than 0.01</p>
        </span>
        <input id="auction-price-input" ref="auction-price-input" class="input" type="number" min="0.01" step="0.01" placeholder="0.01" required="">
        <span v-if="typeError">
          <p>Please select an option.</p>
        </span>
        <div>
            <select id="auction-type-select" ref="auction-type-select">
              <option value="" disabled selected>Select type</option>
              <option value="BID"> Bid type</option>
              <option value="BUY">Buy now type</option>
            </select>
        </div>
        <button class="button" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'CreateAuctionForm',
  data () {
    return {
      isAuthenticated: {
        type: Boolean,
        default: false
      },
      nameError: false,
      priceError: false,
      typeError: false

    }
  },
  beforeCreate() {
    axios.get('/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
      })
  },
  
  methods: {

    save() {
      if(this.$refs['auction-name-input'].value.length == 0) { this.nameError = true }
      else { this.nameError = false }
        
      if(this.$refs['auction-price-input'].value.length == 0 || this.$refs['auction-price-input'].value < 0.01) { this.priceError = true; }
      else { this.priceError = false }

      if(this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value.length == 0) { this.typeError = true}
      else { this.typeError = false}
      
      if(!this.nameError && !this.priceError  && !this.typeError) {
        var reqbody = {
          "name": this.$refs['auction-name-input'].value,
          "price": this.$refs['auction-price-input'].value,
          "status": "NEW",
          "type": this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value
        }
        axios.post("/auction/create", reqbody)
        .then(() => {
            window.location.href = "/myauctions"
        })
      }
      
  
    }
  }
}
</script>

<style lang="scss">
  .auction-page {
    height: 100%;
    width: 100%;
  }
  .create-auction-div {
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