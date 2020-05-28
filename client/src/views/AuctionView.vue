<template>
    <div id="homeContainer">
        <div id="leftContainer">
            <left-panel/>
        </div>
        <div id="centerContainer">
            <auction :isLoading="true"/>
        </div>
        <div id="rightContainer">
            <right-panel/>
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
