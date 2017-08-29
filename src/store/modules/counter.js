import * as types from 'store/types'
// state
const state = {
  count: 0
}
// getters
const getters = {
  getCount: state => state.count
}
// actions
const actions = {
  increase({ commit }) {
    commit(types.INCREASE)  // 调用type为INCREASE的mutation
  },
  reset({ commit }) {
    commit(types.RESET)     // 调用type为RESET的mutation
  }
}
// mutations
const mutations = {
  [types.INCREASE](state) {
    state.count++
  },
  [types.RESET](state) {
    state.count = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
