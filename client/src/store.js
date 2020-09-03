import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isAuthenticated: false,
        username: null,
        wins: false
    },
    mutations: {
        authenticate (state) {
            localStorage.setItem('isAuthenticated', true)
            return state.isAuthenticated = true
        },
        unauthenticate (state) {
            localStorage.removeItem("isAuthenticated")
            return state.isAuthenticated = false
        },
        setUsername(state, payload) {
            localStorage.setItem('username', payload)
            return state.username = payload
        },
        removeUsername(state) {
            localStorage.removeItem("username")
            console.log("removed username ")
            return state.username = false
        },
        initializeStore(state) {
            if(localStorage.getItem('isAuthenticated')) {
                return state.isAuthenticated = true
            }
        },
        initializeUsernameStore(state) {
            if(localStorage.getItem('username')) {
                return state.username = localStorage.getItem('username')
            }
        },   
        deInitializeStore(state) {
            if(localStorage.removeItem('isAuthenticated')) {
                return state.isAuthenticated = false
            }
        },
        deInitializeUsernameStore(state) {
            if(localStorage.removeItem('username')) {
                return state.username = null
            }
        },
        setWins(state) {
            localStorage.setItem('wins', true)
            return state.wins = true
        },
        initializeWinsStore(state) {
            if(localStorage.getItem('wins')) {
                console.log(localStorage.getItem('wins'))
                return state.wins = localStorage.getItem('wins')
            }
        },
        removeWins(state) {
            localStorage.removeItem('wins')
            return state.wins = false
        },

    },
    actions: {
        authenticate (context) {
            context.commit('authenticate')
        },
        unauthenticate (context) {
            context.commit('unauthenticate')
        },
        setUsername(context, payload) {
            context.commit('setUsername', payload)
        },
        removeUsername(context) {
            console.log("removing username ")
            context.commit("removeUsername")
        },
        setWins(context) {
            context.commit("setWins")
        },
        removeWins(context) {
            context.commit("removeWins")
        }

    }
})
export default store;