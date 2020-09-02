<template>
<div class="edit-auction-div">
      <div class="edit-auction-box" v-if="auction != null && !isLoading && auction.status =='NEW' && auction.creator == username">
        <h1>Auction</h1>
        <input id="auction-name-input" ref="auction-name-input" class="input" type="text" :placeholder="auction.name">
        <span v-if="infoError">
          <p>Please enter info with less than 51 characters / Cannot be empty</p>
        </span>
        <input id="auction-info-input" ref="auction-info-input" class="input" type="text" placeholder="info">
        <span v-if="priceError">
            <p>Please enter price bigger than 0.00</p>
        </span>
        <input id="auction-price-input" ref="auction-price-input" class="input" type="number" min="0.01" step="0.01" :placeholder="auction.price">
        <p v-text="'Type: '+auction.type"/>
        <div class="select-type">
            <select id="auction-type-select" ref="auction-type-select">
              <option value="" disabled selected>Select type</option>
              <option value="BID"> Bid type</option> 
              <option value="BUY">Buy now type</option>
              
            </select>
        </div>
        <p v-text="'Creator: '+auction.creator"/>
        <div>
          <button class="edit-auction-button" @click="cancel">Cancel</button>
          <button class="edit-auction-button" @click="apply">Apply Changes</button>
        </div>
      </div>
</div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'EditAuctionForm.vue',

  data () {
    return {
      isAuthenticated: false,
      username: null,
      isLoading: true,
      priceError: false,  
      infoError: false,  
      auction: null,
    
    }

    
  },
  created() {
   
      this.authenticate()
      this.getInitialData()
  },
  
  methods: {
    authenticate() {
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
    },

    getInitialData() {
      if(!this.isAuthenticated) {
        window.location.href = "/"
      }
      let json = {
        "index": window.location.href.split('id:').slice(-1)[0].toString()
      }
      axios.post('/api/auction/auction', json)
      .then(resp => {
        this.auction = resp.data["auction"]
        this.isLoading = false
      })
    },

    cancel() {
      var path = "/auction/id:"+this.auction._id
      window.location.href = path
    },

    apply() {
        if(this.$refs['auction-name-input'].value.length != 0) { this.auction.name = this.$refs['auction-name-input'].value }
        
        if(this.$refs['auction-info-input'].value.length > 50 || this.$refs['auction-info-input'].value.trim() === "") { this.infoError = true }
        else {
          this.infoError = false 
          if(this.$refs['auction-info-input'].value.length > 0) { this.auction.info = this.$refs['auction-info-input'].value }
        }

        if((this.$refs['auction-price-input'].value < 0.01 || this.$refs['auction-price-input'].value > 100000.00)  && this.$refs['auction-price-input'].value.length > 0 ) { this.priceError = true }
        else {
            this.priceError = false
            if(this.$refs['auction-price-input'].value.length != 0) { this.auction.price = this.$refs['auction-price-input'].value }
        }

        if(this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value.length != 0) { 
            this.auction.type = this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value
         }
        
        if(!this.priceError && !this.infoError) {
            var reqbody = {
                "_id": this.auction._id,
                "name": this.auction.name,
                "info": this.auction.info,
                "price": parseFloat(this.auction.price).toFixed(2),
                "type": this.auction.type
            }
            
          axios.post("/api/auction/edit", reqbody)
          .then(() => {})
          
          var path = "/auction/id:"+this.auction._id
          window.location.href = path
        }

        

    }

  }
}
</script>

<style lang="scss">

  .edit-auction-div {
    position: relative;
    margin-top: 100px;
    height: 100%;
    width: $div_width;
    
  }
  .edit-auction-box {
    background: $div_background;
    text-align: center;
    max-width: $div_width;
    padding: 40px;
    position: relative;
    box-shadow: $box_shaddow;
  }

  .edit-auction-box input  {
    background: $input_background;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: $box_size;
    font-size: $normal_font_size;
    
  }

  .edit-auction-button {
    background: $button_color;
    height: 40px;
    width: 100px;
    border: $no_border;
    margin: 10px;
  }
  .edit-auction-button:hover {
    background: $button_hover_color;
  } 
</style>