import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MyAuctionsView from '../views/MyAuctions.vue'
import MyHistoryView from '../views/MyHistory.vue'
import CreateAuctionView from '../views/CreateAuction.vue'
import AuctionView from '../views/AuctionView.vue'
import AuctionEditView from '../views/AuctionEditView.vue'
import MessengerView from '../views/MessengerView.vue'
import RegisterView from '../views/RegisterView.vue'

Vue.use(VueRouter) 

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/myauctions',
        name: 'MyAuctions',
        component: MyAuctionsView,
    },
    {
        path: '/myhistory',
        name: 'MyHistory',
        component: MyHistoryView,
    },
    {
        path: '/create-auction',
        name: 'CreateAuction',
        component: CreateAuctionView

    },
    {
        path: '/auction/id:(\\w+)',
        name: 'AuctionView',
        component: AuctionView
        
    },
    {
        path: '/edit-auction/id:(\\w+)',
        name: 'AuctionEditView',
        component: AuctionEditView
    },
    {
        path: '/messenger',
        name: 'MessengerView',
        component: MessengerView
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router