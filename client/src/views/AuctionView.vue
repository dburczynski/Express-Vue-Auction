<template>
     <div class="auction-page">
        <div class="auction-container">
            <div class="auction-left">
                <left-panel/>
            </div>
            <div class="auction-center">
                <auction/>
            </div>
            <div class="auction-right">
                <right-panel/>
            </div>
        </div>
    </div>
   
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import Auction from '@/components/Auction.vue'
import RightPanel from '@/components/RightPanel.vue'
export default {
    name: 'AuctionView',
    components: {
        LeftPanel,
        Auction,
        RightPanel
    }
    
}
</script>

<style lang="scss">
    .auction-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;

    }
    .auction-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .auction-left {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .auction-center {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .auction-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
</style>
