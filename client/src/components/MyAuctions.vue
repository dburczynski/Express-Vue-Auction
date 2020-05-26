<template>
    <div class="postList" v-if="isAuthenticated">
        <div v-for="post in this.posts" :key="post._id">
            <div class="post-break">               
            </div>
            <div class="post" @click="navigateToPost(post)">
                <div class="post-name">
                    <p>{{post.name}}</p>
                </div>
                <div class="post-price">
                    <p>Price: {{post.price}}</p>
                </div>
                <div class="post-status">
                    <p v-if="post.status == 'NEW'" class="redStatus">NOT STARTED</p>
                    <div v-if="post.status == 'BID'">
                        <p v-if="post.type == 'BID'" class="greenStatus">BIDDERS: {{post.bidders.length}}</p>
                        <p v-if="post.type == 'BUY'" class="yellowStatus">NO BUYER</p>
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
    props: {

        isAuthenticated: {
            type: Boolean,
            default: false
        }
    },
    data () {
      return {
        posts: null
    }
    },
    beforeCreate() {
      axios.get('/user-status')
            .then((resp) => {
                this.isAuthenticated = resp.data["isAuthenticated"]             
            });
        axios.get('/auction/myauctions')
        .then((resp) => {
            this.posts = resp.data
        })
    },
    methods: {
        navigateToPost(post) {
            window.location.href = "/auction/id:"+post._id;
        }
    }
  
}
</script>

<style lang="scss">
    .postList{
        position: relative;
        width: 800px;
    }
    .post {
        
        background: #ffffff;
        position: relative;
        width: 600px;
        margin: 0 auto;
        height: 80px;
        box-shadow: 0px 1px 5px black;
        cursor: pointer;
    }
     .post-break {
        height: 40px;
        width: 100%;
    }
    .post-name {
        font-size: 20px;
        left: 0;
        top: 0;
        margin: 10px;
    }
    .post-price p{
        font-size: 15px;
        position: absolute;;
        left: 0;
        bottom: 0;
        margin: auto

    }
    .post-bidders p {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: auto
    }
    .post-status p {
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