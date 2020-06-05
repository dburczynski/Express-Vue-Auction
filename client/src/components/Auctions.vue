<template>
        <div class="auctions-list">
            <div v-for="auction in auctions" :key="auction._id">
                <div class="auctions-break">
                </div>
                <div class="auctions" @click="navigateToAuction(auction)">
                    <div class="auctions-name" >
                        <h1>{{auction.name}}</h1>
                    </div>
                    <div class="auctions-price">
                        <p>Price: {{auction.price}}</p>
                    </div>
                    <div class="auctions-bidders">
                        <p>Bidders: {{auction.bidders.length}}</p>
                    </div>
               </div>
               
            </div>
            <div class="auctions-break">
            </div>
            <div class="auctions-load-div">
                <button  v-if="this.auctionsLoaded != 0 && this.auctionsLoaded % 10 === 0" class="auctions-load-button" @click="loadAuctions">Load Auctions</button> 
            </div>

        </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'Auctions',
    data () {
      return {
        auctions: null,
        auctionsLoaded: 0,
      }
    },
    created () {
        axios.get('/api/auction/auctions', { "index": this.auctionsLoaded})
        .then(resp => {
            this.auctions = resp.data
            this.auctionsLoaded = this.auctions.length
        })
        
    },

    methods: {
        navigateToAuction(auction) {
            window.location.href = "/auction/id:"+auction._id;
        },
        loadAuctions() {      
            axios.post('/api/auction/auctions', { "index": this.auctionsLoaded})
            .then((resp) => {
                this.auctions = this.auctions.concat(resp.data)
                this.auctionsLoaded = this.auctions.length
            })
        }
    }
}
</script>

<style lang="scss">
    .auctions-list{
        position: relative;
        height: 100%;
        width: $div_width;
        margin-top: 100px;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .auctions {
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
     .auctions-break {
        height: 30px;
        width: 100%;

    }
    .auctions-price p{
        font-size: $normal_font_size;

    }
    .auctions-bidders p {
        font-size: $normal_font_size;
    }
    .auctions-status p {
        font-size: $normal_font_size;
    }
    .auctions-load-div {
        position: relative;
        width: $div_width;
        margin: $auto_center_margin;
        height: 40px;
    }
     .auctions-load-button {
        background: $button_color;
        height: 40px;
        margin-top: 20px;
        width: $div_width;
        border: $no_border;
        

    }
    .auctions-load-button:hover {
        background: $button_hover_color;
    } 
</style>