import Local from '../../modules/Local'
import * as CONST from '../../modules/Const'

const fontAdjustLocal = new Local(CONST.FONT_ADJUST)
const fontAdjustString = fontAdjustLocal.get()
const volumeLocal = new Local(CONST.TAP_VOLUME)
const volume = volumeLocal.get()

const state = {
  fontAdjust: parseInt(fontAdjustString) || 5,
  volume: parseFloat(volume) || 0.4
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  setFontAdjust (state, val) {
    state.fontAdjust = val
    fontAdjustLocal.set(val)
  },
  setVolume (state, val) {
    state.volume = val
    volumeLocal.set(val)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
