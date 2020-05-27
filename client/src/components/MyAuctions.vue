<template>
    <div class="auction-list" v-if="isAuthenticated && !isAuthenticating"> 
        <div v-for="auction in this.auctions" :key="auction._id">
            <div class="auction-break">               
            </div>
            <div class="auction" @click="navigateToAuction(auction)">
                <div class="auction-name">
                    <p>{{auction.name}}</p>
                </div>
                <div class="auction-price">
                    <p>Price: {{auction.price}}</p>
                </div>
                <div class="auction-status">
                    <p v-if="auction.status == 'NEW'" class="redStatus">NOT STARTED</p>
                    <div v-if="auction.status == 'BID'">
                        <p v-if="auction.type == 'BID'" class="greenStatus">BIDDERS: {{auction.bidders.length}}</p>
                        <p v-if="auction.type == 'BUY'" class="yellowStatus">NO BUYER</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'MyAuctions',

    data () {
      return {
        auctions: null,
        isAuthenticated: false,
        isAuthenticating: true
      }
    
    },

    beforeCreate() {
      axios.get('/user-status')
            .then((resp) => {
                this.isAuthenticated = resp.data["isAuthenticated"]    
                if(this.isAuthenticated == false) { window.location.href = "/" }  
                this.isAuthenticating = false 
            });
        axios.get('/auction/myauctions')
        .then((resp) => {
            this.auctions = resp.data
        })
    },

    methods: {
        navigateToAuction(auction) {
            window.location.href = "/auction/id:"+auction._id;
        }
    }
  
}
</script>

<style lang="scss">
    .auction-list{
        position: relative;
        width: 800px;
        height: 95%;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    ::-webkit-scrollbar { 
        display: none;
    }
    .auction {    
        background: #ffffff;
        position: relative;
        width: 600px;
        margin: 0 auto;
        height: 80px;
        box-shadow: 0px 1px 5px black;
        cursor: pointer;
    }
     .auction-break {
        height: 40px;
        width: 100%;
    }
    .auction-name {
        font-size: 20px;
        left: 0;
        top: 0;
        margin: 10px;
    }
    .action-price p{
        font-size: 15px;
        position: absolute;;
        left: 0;
        bottom: 0;
        margin: auto

    }
    .auction-bidders p {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: auto
    }
    .auction-status p {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: auto
    }
    .redStatus{
        color: red;
    }
    .greenStatus {
        color: green;
    }
    .blackStatus {
        color: black
    }
</style>