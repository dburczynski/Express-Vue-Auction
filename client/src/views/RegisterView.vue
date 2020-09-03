<template>
    <div class="home-page">
        <div class="home-container">
          <register-form/>
        </div>
    </div>
   
</template>
<script>
import RegisterForm from '@/components/RegisterForm.vue'

export default {
    name: 'RegisterView',
    components: {
      RegisterForm
    }
}
</script>

<style lang="scss">
    .register-page {
        height: 100%;
        width: 100%;
        position: relative;

    }
    .register-container {
        width: 100%;
        height: 100%;
        position: relative;
    }
</style>