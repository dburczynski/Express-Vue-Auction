<template>
    <div class="my-auctions-page">
        <div class="my-auctions-container">
            <div class="my-auctions-left">
                <left-panel/>
            </div>
            <div class="my-auctions-center">
                <my-auctions/>
            </div>
            <div class="my-auctions-right">
                <right-panel/>
            </div>
        </div>
    </div>
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import MyAuctions from '@/components/MyAuctions.vue'
import RightPanel from '@/components/RightPanel.vue'
export default {
    name: 'MyAuctionsView',
    components: {
        LeftPanel,
        MyAuctions,
        RightPanel
    }
    
}
</script>

<style lang="scss">
    .my-auctions-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;

    }
    .my-auctions-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .my-auctions-left {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .my-auctions-center {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .my-auctions-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }

</style>