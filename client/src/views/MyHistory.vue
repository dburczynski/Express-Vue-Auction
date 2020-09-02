<template>
    <div class="my-history-page">
        <div class="my-history-container">
            <div class="my-history-left">
                <left-panel/>
            </div>
            <div class="my-history-center">
                <my-history/>
            </div>
            <div class="my-history-right">
                <right-panel/>
            </div>
        </div>
    </div>
</template>
<script>
import LeftPanel from '@/components/LeftPanel.vue'
import MyHistory from '@/components/MyHistory.vue'
import RightPanel from '@/components/RightPanel.vue'

export default {
    name: 'MyHistoryView',
    components: {
        LeftPanel,
        MyHistory,
        RightPanel
    }
}
</script>

<style lang="scss">
    .my-history-page {
        height: 100%;
        width: 100%;
        display: inline-flex;
        flex-direction: column;
        position: relative;

    }
    .my-history-container {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        overflow: auto;
        justify-content: center;
    }
    .my-history-left {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .my-history-center {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
    .my-history-right {
        height: 80%;
        max-width: 400px;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
    }
</style>
