<template>
    <div id="homeContainer">
        <div id="leftContainer">
            <left-panel/>
        </div>
        <div id="centerContainer">
            <auctions/>
        </div>
        <div id="rightContainer">
            <right-panel/>
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
