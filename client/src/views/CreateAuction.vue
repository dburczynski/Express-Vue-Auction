<template>
    <div id="homeContainer">
        <div id="leftContainer">
            <left-panel/>
        </div>
        <div id="centerContainer">
            <create-auction-form/>
        </div>
        <div id="rightContainer">
            <right-panel/>
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
#homeContainer {
    height: 100%;
    overflow: scroll;
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
