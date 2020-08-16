<template>
  <div id="app"
      v-finger:touch-start="touchStart"
      v-finger:swipe="swipeRight">
    <side-bar></side-bar>
    <router-view class="flex-item-grow">
    </router-view>
  </div>
</template>

<script>
import SideBar from './components/SideBar'
import getRem from './modules/rem'
import Util from './modules/Util'
import * as CONST from './modules/Const'
import * as workers from './modules/workers'

export default {
  name: 'app',
  data () {
    return {
      touchStartX: 0
    }
  },
  computed: {
    fontAdjust () {
      return this.$store.state.Settings.fontAdjust
    }
  },
  created () {
    getRem(300, 3, 3, this.fontAdjust)
    workers.cleanDone(this)

    const tapVoice = window.document.getElementById('tapVoice')
    const volume = parseFloat(window.localStorage.getItem(CONST.TAP_VOLUME) || 0.4)
    tapVoice.volume = volume
  },
  watch: {
    fontAdjust: function () {
      getRem(300, 3, 3, this.fontAdjust)
    }
  },
  methods: {
    touchStart (evt) {
      this.touchStartX = evt.touches[0].clientX / window.document.documentElement.clientWidth
    },
    swipeRight (evt) {
      Util.log(this.touchStartX)
      if (evt.direction === 'Right' &&
         this.touchStartX < 0.25) {
        this.$store.commit('toggleSide')
      }
    }
  },
  components: { SideBar }
}

</script>

<style lang="scss">
@import "./assets/scss/const.scss";

html,body,#app {
  background: $body-bg;
  height: 100%;
}
</style>