<template>
    <div class="auction-edit-page">
        <div class="auction-edit-container">
            <div class="auction-edit-left">
                <left-panel/>
            </div>
            <div class="auction-edit-center">
                <edit-auction-form :isLoading="true"/>
            </div>
            <div class="auction-edit-right">
                <right-panel/>
            </div>
        </div>
    </div>
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import EditAuctionForm from '@/components/EditAuctionForm.vue'
import RightPanel from '@/components/RightPanel.vue'
export default {
    name: 'AuctionEditView',
    components: {
        LeftPanel,
        EditAuctionForm,
        RightPanel
    }
    
}
</script>

<style lang="scss">
    .auction-edit-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;

    }
    .auction-edit-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .auction-edit-left {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .auction-edit-center {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .auction-edit-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
</style>
