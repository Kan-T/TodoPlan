import * as CONST from '../../modules/Const'

const state = {
  showSide: false,
  namedList: [CONST.DEFAULT],
  planList: CONST.PLAN_TODO_LIST,
  planListArgs: CONST.PLAN_LIST_ARGS_INIT
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  toggleSide () {
    state.showSide = !state.showSide
  },
  closeSide () {
    state.showSide = false
  },
  setNamedList (state, val) {
    state.namedList = val
  },
  setPlanList (state, val) {
    state.planList = val
  },
  setPlanListArgs (state, val) {
    state.planListArgs = val
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
