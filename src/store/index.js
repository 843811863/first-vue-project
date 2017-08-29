import Vue from 'vue'
import Vuex from 'vuex'
import counter from './modules/counter'

Vue.use(Vuex) // 确保在new Vuex.Store()之前

export default new Vuex.Store({
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    counter
  }
})
