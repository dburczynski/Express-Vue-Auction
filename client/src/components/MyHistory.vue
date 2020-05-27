<template>
    <div class="auction-list" v-if="isAuthenticated && !isAuthenticating">
        <div v-for="auction in auctions" :key="auction._id">
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
                    <p v-if="auction.highest_bidder == username" class="greenStatus">WON</p>
                    <p v-if="auction.highest_bidder != username && username != auction.creator" class="redStatus">LOST</p>
                    <p v-if="auction.creator == username" class="greenStatus">SOLD</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'MyHistory',
    props: {
        username: {
            type: String,
            default: ""
        },
    },
    data () {
        return {
            isAuthenticated: false,
            isAuthenticating: true,
            auctions: null
        }
    },
    beforeCreate() {
      axios.get('/user-status')
            .then((resp) => {
                this.isAuthenticated = resp.data["isAuthenticated"]    
                this.isAuthenticating = false

                if(this.isAuthenticated == false) { window.location.href = "/" }   
            });
        axios.get('/auction/myhistory')
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
    .auction-price p{
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