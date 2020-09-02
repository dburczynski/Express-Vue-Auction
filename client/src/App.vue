<template>
  <div id="app">
    <div id="nav">
      <router-link class="routerlinks" to="/">Home</router-link>
    </div>
    <div class="content-page">
      <router-view class="content-page"/>
    </div>
  </div>
</template>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  height: 100%
}
#nav {
  background-color: #000000;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin: 0px, 0px, 100px,
  
    
}
.routerlinks {
  color: white;
  position: relative;
  margin: 20px, 30px, 20px, 50px;
  padding: 20px;
  
}
.content-page {
  height: 100%;
  width: 100%;
  position: fixed;
}


</style>
