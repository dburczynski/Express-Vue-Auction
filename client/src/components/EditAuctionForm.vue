<template>
<div class="edit-auction-div">
      <div class="edit-auction-box" v-if="auction != null && !isLoading && auction.status =='NEW' && auction.creator == username">
        <h1>Auction</h1>
        <input id="auction-name-input" ref="auction-name-input" class="input" type="text" :placeholder="auction.name">
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
    props: {
      isLoading: {
        type: Boolean,
      }
    },
  data () {
    return {
      isAuthenticated: false,
      isAuthenticating: true,
      priceError: false,    
      username: {
          type: String,
          default: ""
      },
      auction: null,
    
    }

    
  },
  beforeCreate() {
    this.isAuthenticating = true;
    axios.get('/api/user-status')
      .then((resp) => {
        this.isAuthenticated = resp.data["isAuthenticated"]
        this.username = resp.data["username"]
        this.isLoading =false;

      })
      var json = {
      "index": window.location.href.split('id:').slice(-1)[0].toString()
    }
    
      axios.post('/api/auction/auction', json)
      .then(resp => {
            this.auction = resp.data["auction"]
      })
  },
  
  methods: {

    cancel() {
      var path = "/auction/id:"+this.auction._id
      window.location.href = path
    },

    apply() {
        if(this.$refs['auction-name-input'].value.length != 0) { this.auction.name = this.$refs['auction-name-input'].value }
        
        if(this.$refs['auction-price-input'].value < 0.01 && this.$refs['auction-price-input'].value.length > 0) { this.priceError = true }
        else {
            this.priceError = false
            if(this.$refs['auction-price-input'].value.length != 0) { this.auction.price = this.$refs['auction-price-input'].value }
        }

        if(this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value.length != 0) { 
            this.auction.type = this.$refs["auction-type-select"].options[this.$refs["auction-type-select"].selectedIndex].value
         }
        
        if(!this.priceError) {
            var reqbody = {
                "_id": this.auction._id,
                "name": this.auction.name,
                "price": this.auction.price,
                "type": this.auction.type
            }
            
            axios.post("/api/auction/edit", reqbody)
            .then(() => {
            })
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