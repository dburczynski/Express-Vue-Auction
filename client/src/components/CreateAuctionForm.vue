<template>
    <div class="create-auction-div">
      <div class="create-auction-box">
        <span v-if="nameError">
          <p>Name can't be empty</p> 
        </span>
        <input id="auction-name-input" ref="auction-name-input" class="input" type="text" placeholder="auction name" required="">
        <span v-if="infoError">
          <p>Please enter info with less than 51 characters and more than 1/Cannot be empty</p>
        </span>
        <input id="auction-info-input" ref="auction-info-input" class="input" type="text" placeholder="info">
        <span v-if="priceError">
          <p>Price can't be empty/smaller than 0.01</p>
        </span>
        <input id="auction-price-input" ref="auction-price-input" class="input" type="number" min="0.01" step="0.01" placeholder="0.01" required="">
         <span v-if="dateError">
          <p>Pick a later date</p>
        </span>
        <input id="auction-date-input" ref="auction-date-input" class="input" type="date">
        <span v-if="dateError_2">
          <p>Pick a later date</p>
        </span>
        <input id="auction-date-input-2" ref="auction-date-input-2" class="input" type="date">
        
        <div>
            <span v-if="typeError">
              <p>Please select an option.</p>
            </span>
            <select id="auction-type-select" ref="auction-type-select">
              <option value="" disabled selected>Select type</option>
              <option value="BID"> Bid type</option>
              <option value="BUY">Buy now type</option>
            </select>
        </div>
        <button class="create-auction-button" @click="start">Start</button>
        <button class="create-auction-button" @click="startNow">Start Now</button>
      </div>
    </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'CreateAuctionForm',
  data () {
    return {
      isAuthenticated: false,
      nameError: false,
      priceError: false,
      typeError: false,
      infoError: false,
      dateError: false,
      dateError_2: false

    }
  },
  created() {
    this.authenticate()

    if(!this.isAuthenticated) {
      window.location.href = "/"
    }
  },
  methods: {
    authenticate() {
      this.isAuthenticated = this.$store.state.isAuthenticated
    },

    start() {
      if(this.$refs['auction-name-input'].value.length == 0) { this.nameError = true }
      else { this.nameError = false }
       
      if(this.$refs['auction-info-input'].value.length == 0 || this.$refs['auction-info-input'].value.length > 50 || this.$refs['auction-info-input'].value.trim() === "") { this.infoError = true}
      else { this.infoError = false }
      if(this.$refs['auction-price-input'].value.length == 0 || this.$refs['auction-price-input'].value < 0.01 || this.$refs['auction-price-input'].value > 100000.00) { this.priceError = true; }
      else { this.priceError = false }
      if(this.$refs['auction-date-input'].value === "" || new Date(this.$refs['auction-date-input'].value).getTime() <= new Date(Date.now()).getTime()) {
          this.dateError = true
      }
      else {
        this.dateError = false
      }
      if(this.$refs['auction-date-input-2'].value === "" || new Date(this.$refs['auction-date-input-2'].value).getTime() <= new Date(Date.now()).getTime() || new Date(this.$refs['auction-date-input-2'].value).getTime() <= new Date(this.$refs['auction-date-input'].value).getTime()) {
        this.dateError_2 = true
      }
      else {
        this.dateError_2 = false
      }
      if(this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value.length == 0) { this.typeError = true}
      else { this.typeError = false}
      
      if(!this.nameError && !this.priceError  && !this.typeError && !this.infoError && !this.dateError && !this.dateError_2) {
        let reqbody = {
          "name": this.$refs['auction-name-input'].value,
          "info": this.$refs['auction-info-input'].value,
          "price": parseFloat(this.$refs['auction-price-input'].value).toFixed(2),
          "status": "NEW",
          "start_time":new Date(this.$refs['auction-date-input'].value).getTime(),
          "end_time": new Date(this.$refs['auction-date-input-2'].value).getTime(),
          "type": this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value
        }
        axios.post("/api/auction/create", reqbody)
        .then(() => {
            window.location.href = "/myauctions"
        })
      }
      
  
    },
      startNow() {
      if(this.$refs['auction-name-input'].value.length == 0) { this.nameError = true }
      else { this.nameError = false }
       
      if(this.$refs['auction-info-input'].value.length == 0 || this.$refs['auction-info-input'].value.length > 50 || this.$refs['auction-info-input'].value.trim() === "") { this.infoError = true}
      else { this.infoError = false }
      if(this.$refs['auction-price-input'].value.length == 0 || this.$refs['auction-price-input'].value < 0.01 || this.$refs['auction-price-input'].value > 100000.00) { this.priceError = true; }
      else { this.priceError = false }
      if(this.$refs['auction-date-input-2'].value === "" || new Date(this.$refs['auction-date-input-2'].value).getTime() < new Date(Date.now()).getTime()) {
        this.dateError_2 = true
      }
      else {
        this.dateError_2 = false
      }
      if(this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value.length == 0) { this.typeError = true}
      else { this.typeError = false}
      
      

      if(!this.nameError && !this.priceError  && !this.typeError && !this.infoError && !this.dateError_2) {
        let reqbody = {
          "name": this.$refs['auction-name-input'].value,
          "info": this.$refs['auction-info-input'].value,
          "price": parseFloat(this.$refs['auction-price-input'].value).toFixed(2),
          "status": "NEW",
          "start_time": new Date(Date.now()).getTime(),
          "end_time": new Date(this.$refs['auction-date-input-2'].value).getTime(),
          "type": this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value
        }
        axios.post("/api/auction/create", reqbody)
        .then(() => {
            window.location.href = "/myauctions"
        })
      }
      
  
    }
  }
}
</script>

<style lang="scss">

  .create-auction-div {
    position: relative;
    margin-top: 100px;
    height: 100%;
    width: $div_width;
    
  }
  .create-auction-box {
    background: $div_background;
    text-align: center;
    max-width: $div_width;
    padding: 40px;
    position: relative;
    $box_shaddow: 0px 1px 5px black;
  }

  .create-auction-box input  {
    background: $input_background;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: $box_size;
    font-size: 14px;
    
  }

  .create-auction-button {
    background: $button_color;
    height: 40px;
    width: 100px;
    border: 0;
    margin: 15px;
  }
  .create-auction-button:hover {
    background: $button_hover_color;
  }  
</style>