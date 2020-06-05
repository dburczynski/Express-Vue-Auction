<template>
    <div class="register-div" v-if="!isAuthenticated && !isAuthenticating">
      <div class="register-box">
        <h1>Register</h1>
        <span v-if="loginError">
          <p>Username exists!</p>
        </span>
        <span v-if="usernameError">
          <p>Please enter username.</p>
        </span>
        <input id="username-input" ref="username-input" class="input" type="text" placeholder="username" required="">
        <span v-if="passwordError">
          <p>Please enter password.</p>
        </span>
        <input id="password-input" ref="password-input" class="input" type="password" placeholder="password" required="">
        <button class="register-button" @click="register">Register</button>
         <div>
        <a>Have an account?</a>
        <a href='/'>Login</a>
        </div>
      </div>
    </div>
</template>
<script>
import axios from '@/../node_modules/axios/dist/axios.min.js'

export default {
    name: 'Login',
  data() {
    return {
      isAuthenticated: false,
      isAuthenticating: true,
      usernameError: false,
      passwordError: false,
      loginError: false,
    }
  },
  beforeCreate() {
    axios.get("/api/user-status")
    .then((resp) => {
      this.isAuthenticated = resp["isAuthenticated"]
      this.isAuthenticating = false
    })
  },
  methods: {
    register() {
      var json = {
        "username": this.$refs["username-input"].value,
        "password": this.$refs["password-input"].value
      }
      if(this.$refs["username-input"].value.length == 0) { this.usernameError = true}
      else { this.usernameError = false}
      if(this.$refs["password-input"].value.length == 0) { this.passwordError = true}
      else { this.passwordError = false}
      if(!this.loginError && !this.usernameError && !this.passwordError) {
        axios.post("/api/user-exists", {"username": json["username"]})
        .then((resp) => {
          this.loginError = resp.data["loginError"]
          if(!this.loginError) {
            axios.post("/api/register", json)
            .then((resp) => {
              this.passwordError = resp.data["passwordError"]
              this.usernameError = resp.data["usernameError"]
              if(!this.loginError && !this.loginError && !this.passwordError) { window.location.href = "/" }
            })
          }
        })
      }
    }
  },
}
</script>

<style lang="scss">
  .register-div {
    height: 100%;
    width: 100%;
    margin-top: 150px;
  }
  .register-box {
    background: $div_background;
    text-align: center;
    max-width: $div_width;
    margin: auto;
    padding: 40px;
    position: relative;
    box-shadow: $box_shaddow;
  }

  .register-box input  {
    background: $input_background;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: $box_size;
    font-size: $normal_font_size;
    
  }

  .register-button {
    background: $button_color;
    height: 40px;
    width: 100px;
    border: 0;
    margin: 5px 10px 15px;
  }
  .register-button:hover {
    background: $button_hover_color;
  } 
</style>