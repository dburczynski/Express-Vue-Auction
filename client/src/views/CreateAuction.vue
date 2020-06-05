<template>
    <div class="create-auction-page">
        <div class="create-auction-container">
            <div class="create-auction-left">
                <left-panel/>
            </div>
            <div class="create-auction-center">
                <create-auction-form/>
            </div>
            <div class="create-auction-right">
                <right-panel/>
            </div>
        </div>
    </div>
   
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import RightPanel from '@/components/RightPanel.vue'
import CreateAuctionForm from '@/components/CreateAuctionForm.vue'
export default {
    name: 'CreateAuctionView',
    components: {
        LeftPanel,
        RightPanel,
        CreateAuctionForm
    }
    
}
</script>

<style lang="scss">
    .create-auction-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;

    }
    .create-auction-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .create-auction-left {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .create-auction-center {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .create-auction-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
</style>