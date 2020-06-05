<template>
    <div class="my-auction-list" v-if="isAuthenticated && !isAuthenticating"> 
        <div v-for="auction in this.auctions" :key="auction._id">
            <div class="my-auction-break">               
            </div>
            <div class="my-auction" @click="navigateToAuction(auction)">
                <div class="my-auction-name">
                    <h1>{{auction.name}}</h1>
                </div>
                <div class="my-auction-price">
                    <p>Price: {{auction.price}}</p>
                </div>
                <div class="my-auction-status">
                    <p v-if="auction.status == 'NEW'" class="my-auction-redStatus">NOT STARTED</p>
                    <div v-if="auction.status == 'BID'">
                        <p v-if="auction.type == 'BID'" class="my-auction-greenStatus">BIDDERS: {{auction.bidders.length}}</p>
                        <p v-if="auction.type == 'BUY'" class="my-auction-yellowStatus">NO BUYER</p>
                    </div>
                </div>
            </div>
        </div>
         <div class="my-auctions-load-div">
                <button  v-if="this.auctionsLoaded != 0 && this.auctionsLoaded % 10 === 0" class="my-auctions-load-button" @click="loadAuctions">Load Auctions</button> 
        </div>
    </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'MyAuctions',

    data () {
      return {
        auctions: [],
        auctionsLoaded: 0,
        isAuthenticated: false,
        isAuthenticating: true
      }
    
    },

    beforeCreate() {
      axios.get('/api/user-status')
            .then((resp) => {
                this.isAuthenticated = resp.data["isAuthenticated"]    
                if(this.isAuthenticated == false) { window.location.href = "/" }  
                this.isAuthenticating = false 
                axios.post('/api/auction/myauctions', { "index": this.auctionsLoaded})
                .then((resp) => {
                    this.auctions = this.auctions.concat(resp.data)
                    this.auctionsLoaded = this.auctions.length
                })
            });
        
    },

    methods: {
        navigateToAuction(auction) {
            window.location.href = "/auction/id:"+auction._id;
        },
        loadAuctions() {      
            axios.post('/api/auction/myauctions', { "index": this.auctionsLoaded})
            .then((resp) => {
                this.auctions = this.auctions.concat(resp.data)
                this.auctionsLoaded = this.auctions.length
            })
        }
    }
  
}
</script>

<style lang="scss">
    .my-auction-list{
        position: relative;
        height: 100%;
        width: $div_width;
        margin-top: 100px;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    ::-webkit-scrollbar { 
        display: none;
    }
    .my-auction {    
        background: $div_background;
        position: relative;
        max-width: $div_width;
        height: 160px;
        padding: 40px;
        box-shadow: $box_shaddow;
        position: relative;
        cursor: pointer;
        text-align: center;
    }
    .my-auction-break {
        height: 30px;
        width: 100%;
    }
    .my-action-price p{
        font-size: $normal_font_size;
    }
    .my-auction-bidders p {
        font-size: $normal_font_size;
    }
    .my-auction-status p {
        font-size: $normal_font_size;
    }
    .my-auction-redStatus{
        color: $red;
    }
    .my-auction-greenStatus {
        color: $green;
    }
    .my-auctions-load-div {
        position: relative;
        width: $div_width;
        margin: 0 auto;
        height: 40px;
    }
    .my-auctions-load-button {
        background: $button_color;
        height: 40px;
        margin-top: 20px;
        width: $div_width;
        border: 0;
        

    }
    .my-auctions-load-button:hover {
        background: $button_hover_color;
    } 
</style>