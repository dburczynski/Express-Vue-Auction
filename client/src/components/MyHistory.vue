<template>
    <div class="postList" v-if="isAuthenticated">
        <div v-for="post in posts" :key="post._id">
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
                    <p v-if="post.highest_bidder == username" class="greenStatus">WON</p>
                    <p v-if="post.highest_bidder != username && username != post.creator" class="redStatus">LOST</p>
                    <p v-if="post.creator == username" class="greenStatus">SOLD</p>
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
        content: {
            type: String,
            default: "all"
        },
        isAuthenticated: {
            type: Boolean,
            default: false
        },
        username: {
            type: String,
            default: ""
        },
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
                this.username = resp.data["username"]           
            });
        axios.get('/auction/myhistory')
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