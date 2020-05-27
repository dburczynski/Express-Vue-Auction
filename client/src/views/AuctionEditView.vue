<template>
    <div id="homeContainer">
        <div id="leftContainer">
            <left-panel/>
        </div>
        <div id="centerContainer">
            <edit-auction-form :isLoading="true"/>
        </div>
        <div id="rightContainer">
            <right-panel/>
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
#homeContainer {
    height: 100%;
}
#leftContainer {
        height: 100%;
        width: 25%;
        float: left;
        border-collapse: collapse;
        position: relative;
    }
    #centerContainer {
        height: 100%;
        width: 50%;
   
        float: left;
        border-collapse: collapse;
    }
    #rightContainer {
        height: 100%;
        width: 25%;
        float: left;
        border-collapse: collapse;
    }
</style>
