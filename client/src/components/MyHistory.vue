<template>
    <div class="my-history-list" id="auction-list" ref="auction-list"  v-if="!isLoading">
        <div v-for="auction in auctions" :key="auction._id">
            <div class="my-history-break">               
            </div>
            <div class="my-history" @click="navigateToAuction(auction)">
                <div class="my-history-name">
                    <h1>{{auction.name}}</h1>
                </div>
                <div class="my-history-price">
                    <p>Price: {{auction.price}}</p>
                </div>
                <div class="my-history-status">
                    <p v-if="auction.highest_bidder == username" class="my-history-greenStatus">WON</p>
                    <p v-if="auction.creator != username && auction.highest_bidder != username" class="my-history-redStatus">LOST</p>
                    <p v-if="auction.creator == username && auction.status == 'SOLD'" class="my-history-greenStatus">SOLD</p>
                    <p v-if="auction.creator == username && auction.status == 'FAILED'" class="my-history-redStatus">FAILED</p>
                </div>
            </div>
            
        </div>
         <div class="my-history-load-div">
                <button  v-if="this.auctionsLoaded != 0 && this.auctionsLoaded % 10 === 0" class="my-history-load-button" @click="loadAuctions">Load Auctions</button> 
        </div>
    </div>
</template>

<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'MyHistory',

    data () {
        return {
            isAuthenticated: false,
            username: null,
            isLoading: true,
            auctions: [],
            auctionsLoaded: 0
        }
    },
    created() {
       this.authenticate()
       this.getInitialDate()
    },  
    methods: {
        authenticate() {
            this.isAuthenticated = this.$store.state.isAuthenticated
            this.username = this.$store.state.username
        },

        getInitialDate() {
            if(!this.isAuthenticated) { 
                window.location.href = "/" 
            }   
            else {
            axios.post('/api/auction/myhistory', { "index": this.auctionsLoaded})
            .then((resp) => {
                this.auctions = resp.data
                this.auctionsLoaded = this.auctions.length
                this.isLoading = false
            })  
            }
        },

        navigateToAuction(auction) {
            window.location.href = "/auction/id:"+auction._id;
        },
        loadAuctions() {      
            axios.post('/api/auction/myhistory', { "index": this.auctionsLoaded})
            .then((resp) => {
                this.auctions = this.auctions.concat(resp.data)
                this.auctionsLoaded = this.auctions.length
            })
        }
    }
}
</script>

<style lang="scss">
    .my-history-list{
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
    .my-history {
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
    .my-history-break {
        height: 30px;
        width: 100%;
    }
    .my-history-price p{
        font-size: $normal_font_size;
    }
    .my-history-bidders p {
        font-size: $normal_font_size;
    }
    .my-history-status p {
        font-size: $normal_font_size;
    }
    .my-history-redStatus{
        color: $red;
    }
    .my-history-greenStatus {
        color: $green;
    }
    .my-history-load-div {
        position: relative;
        width: $div_width;
        margin: 0 auto;
        height: 40px;
    }
    .my-history-load-button {
        background: $button_color;
        height: 40px;
        margin-top: 20px;
        width: $div_width;
        border: 0;
        
    }
    .my-history-button:hover {
        background: $button_hover_color;
    } 
</style>