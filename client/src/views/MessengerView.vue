<template>
    <div class="messenger-page">
        <div class="messenger-container">
            <div class="messenger-left">
                <left-panel/>
            </div>
            <div class="messenger-center">
                <messenger/>
            </div>
            <div class="messenger-right">
                <right-panel/>
            </div>
        </div>
    </div>
   
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import Messenger from '@/components/Messenger.vue'
import RightPanel from '@/components/RightPanel.vue'
export default {
    name: 'MessengerView',
    components: {
        LeftPanel,
        Messenger,
        RightPanel
    }
}
</script>

<style lang="scss">
    .messenger-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;
    }
    .messenger-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .messenger-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .messenger-left {
         height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
</style>
