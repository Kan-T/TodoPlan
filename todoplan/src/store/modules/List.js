const state = {
  editList: false
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  shutEditList: (state) => { state.editList = false },
  toggleEditList: (state) => { state.editList = !state.editList }
}

export default {
  state,
  getters,
  actions,
  mutations
}
