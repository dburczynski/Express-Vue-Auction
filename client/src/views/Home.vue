<template>
    <div class="home-page">
        <div class="home-container">
            <div class="home-left">
                <left-panel/>
            </div>
            <div class="home-center">
                <auctions/>
            </div>
            <div class="home-right">
                <right-panel/>
            </div>
        </div>
    </div>
   
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import Auctions from '@/components/Auctions.vue'
import RightPanel from '@/components/RightPanel.vue'
export default {
    name: 'Home',
    components: {
        LeftPanel,
        Auctions,
        RightPanel
    }
    
}
</script>

<style lang="scss">
    .home-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;

    }
    .home-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .home-left {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .home-center {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .home-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
</style>