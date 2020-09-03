<template>
  <div class="messenger-page">
   
    <div class="messenger-div" v-if="!isLoading && !show_conversation">
        <p v-if="this.conversations.length == 0" >No conversations.</p>
        <div v-for="conversation in this.conversations" :key="conversation._id">
                <div v-if="conversation.unread == username" @click="chat(conversation)" class="conversation-unread">
                  <p v-text="conversation.users.find((element) => {
                    if(element != username) {
                      return element
                    }})">
                    </p>
                </div>
                <div v-else @click="chat(conversation)" class="conversation">
                  <p v-text="conversation.users.find((element) => {
                    if(element != username) {
                      return element
                    }})">
                  </p>
                </div>
        </div>
    </div>
    <div class="chat-div" v-if="isAuthenticated && show_conversation">
        <div class="chatbox" id="chat-box" ref="chat-box">
          <div class="messages" v-for="message in this.messages" :key="message._id">
              <p v-if="message.from == username" class="user1Message" v-text="message.from+':\n'+message.text"></p>
              <p v-else class="user2Message" v-text="message.from+':\n'+message.text"></p>          
          </div>
        </div>
        <div class="bottom-menu">
            <input class="chat-input" id="chat-input" ref="chat-input" type="text"/>
            <button class="chat-button" @click="send">SEND</button>
            <button class="chat-button" @click="back">BACK</button>
        </div>
    </div> 

  </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'
import io from '@/../node_modules/socket.io-client'
import bus from '../bus'

export default {
    name: 'Messenger',
  data () {
    return {
      isAuthenticated: false,
      username: null,
      userTo: null,
      nameError: false,
      priceError: false,
      typeError: false,
      conversations: [],
      show_conversation: false,
      conversation_id: null,
      messages: null,
      socket: null,

    }
  },
  created() {
     
    this.authenticate()
    this.getInitialData()
    this.socketSetup()
  
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
      axios.get("/api/conversations/conversations")
      .then((resp) => {
        this.conversations = resp.data
        this.isLoading = false
      })
    },

    socketSetup() {
      if(this.isAuthenticated) {
        this.socket = io()
      }
    },

    chat(conversation) {
      this.show_conversation = true
      var to = ""
      if(conversation.users[0] != this.username)
        to = conversation.users[0]
      else 
        to = conversation.users[1]
      
      this.userTo = to

      var req = {
        "from": this.username,
        "to": to
        
      }

      if(conversation.unread == this.username) {
       axios.post("/api/conversations/read-messages", req)
        .then(() =>  {
           bus.$emit('read-message')
        })
      }
      

      this.socket.on("receive-message", (message) => {
        this.messages.push(message)
        document.getElementById("chat-box").scrollTop = 1000
        axios.post("/api/conversations/read-messages", { "from": message.from, "to": message.to } )
        .then(() =>  {
            bus.$emit('read-message')
        })

      })
      axios.post("/api/conversations/messages", req)
      .then((resp) => {
       
        this.messages = resp.data
        document.getElementById("chat-box").scrollTop = 1000
      })


      window.onbeforeunload = () => {

        this.socket.emit("leave-chat", { "_id": this.conversation_id})
        this.socket.disconnect(true)
      

    }
      axios.post("/api/conversations/conversation", { "users": conversation.users})
      .then((resp) => {
        this.socket.emit("join-chat", { "_id": resp.data._id})
        this.conversation_id = resp.data._id
      })

    },
    back() {
      this.socket.emit('leave-chat', { "_id": this.conversation_id }) 
      this.show_conversation = false
      this.messages = null
      this.userTo = null
      this.socket = io()
        axios.get("/api/conversations/conversations")
        .then((resp) => {
          this.conversations = resp.data
        })

    },
    send() {
      if(this.$refs["chat-input"].value.length > 0) {
        var req = {
          "_id": this.conversation_id,
          "from": this.username,
          "to": this.userTo,
          "text": this.$refs["chat-input"].value
        }
        this.$refs["chat-input"].value = ""    
        this.socket.emit("send-message", req)
         document.getElementById("chat-box").scrollTop =  1000
      }
    }
  }
}
</script>

<style lang="scss">
  .messenger-page {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .messenger-div {
    position: relative;
    background: #ffffff;
    margin: 200px; 
    width: 300px;
    height: 440px;
    padding: 0px;
    overflow-y: scroll;
  }

  .conversation {    
        background: #ffffff;
        width: 100%;
        height: 60px;
        //padding: 0px;
        cursor: pointer;
        text-align: center;
        font-size: 20px;
    }
  .conversation:hover {
    background: #22bd7e;
  }
    .conversation-unread {    
        background: red;
        width: 100%;
        height: 60px;
        //padding: 0px;
        cursor: pointer;
        text-align: center;
        font-size: 20px;
    }
  .conversation-unread:hover {
    background: pink;
  }
    .chat-div {
    position: relative;
    background: #ffffff;
    margin: 200px; 
    width: 300px;
    height: 440px;
    padding: 0px;
    }
  .chatbox {
    position: relative;
    width: 100%;
    height: 410px;
    top: 0;
    overflow-y: scroll;
  }

  
  .user1Message {
    position: relative;
    color: $lightblue;
    text-align: right;
    word-break: break-word;
  }
  .user2Message {
    position: relative;
    color: $red;
    text-align: left;
    word-break: break-word;
  }
  .bottom-menu {
      bottom: 0;
      position: absolute;
      width: 100%;
      height: 30px;
  }
  .chat-input {
      float:left;

      background-color: lightgoldenrodyellow;
      height: 28px;
      width: $div_width;
      border: $no_border;
  }
  .chat-button {
      float: left;
      height: 28px;
      width: 150px;
      border: 0;

      background: $button_color;
  }
  .chat-button:hover{
    background: $button_hover_color;
  }
  
</style>