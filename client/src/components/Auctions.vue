<template>
        <div class="postList">
            <div v-for="post in posts" :key="post._id">
                <div class="post-break">
                </div>
                <div class="post" @click="navigateToPost(post)">
                    <div class="post-name" >
                        <p>{{post.name}}</p>
                    </div>
                    <div class="post-price">
                        <p>Price: {{post.price}}</p>
                    </div>
                    <div class="post-bidders">
                        <p>Bidders: {{post.bidders.length}}</p>
                    </div>
               </div>
            </div>
        </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'Auctions',
    data () {
      return {
        posts: null
      }
  },
created () {
        axios.get('/auction/auctions')
        .then(resp => {
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
        height: 95%;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
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
</style>