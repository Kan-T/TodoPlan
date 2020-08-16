<template>
  <div>
    <listnav :listName='CONST.SETTING'>
    </listnav>

    <div class="container-fluid">
      <ul class="list-group mb-2">
        <li class="list-group-item mb-2">
          <label>
            {{CONST.FONT_SIZE}}: 
          </label>
          <div class="d-flex align-items-center flex-item-grow">
            <button class="btn btn-outline-primary"
                    @click="changeFont(-1)">
              {{CONST.SMALL}}
            </button>
            <b-progress :value="fontAdjust" :max="12" show-value 
                        class="flex-item-grow mx-3">
            </b-progress>
            <button class="btn btn-outline-primary"
                    @click="changeFont(1)">
              {{CONST.BIG}}
            </button>
          </div>
        </li>

        <li class="list-group-item mb-2">
          <label>
            {{CONST.BUTTON_VOLUME}}: 
          </label>
          <div class="d-flex align-items-center flex-item-grow">
            <button class="btn btn-outline-primary"
                    @click="changeVolume(-0.1)">
              {{CONST.SMALL}}
            </button>
            <b-progress :value="volume" :max="1" :precision="1" show-value 
                        class="flex-item-grow mx-3">
            </b-progress>
            <button class="btn btn-outline-primary"
                    @click="changeVolume(0.1)">
              {{CONST.BIG}}
            </button>
          </div>
        </li>

        <li class="list-group-item mb-2">
          <label for="doneKeepDays">
            {{CONST.DONE_SAVE_DAYS}}: 
          </label>
          <input type="number" id="doneKeepDays" class="rounded flex-item-grow"
                  v-model="doneKeepDays"
                  @change="setDoneSaveDays">
        </li>
      </ul>

      <button class="btn-danger rounded w-100 p-2 mt-5" @click="destroy()">
        {{CONST.DELETE_ALL_LIST_DATA}}
      </button>
    </div>


  </div>
</template>

<script>
import * as CONST from '../modules/Const'
import TodoDB from '../modules/TodoDB'
import UtilDom from '../modules/UtilDom'
import listnav from './ListNav'

export default {
  name: 'Setting',
  components: { listnav },
  data () {
    return {
      CONST: CONST,
      todoDB: new TodoDB('TodoDB'),
      doneKeepDays: 7
    }
  },
  mounted () {
    const days = parseInt(window.localStorage.getItem(CONST.DONE_KEEP_DAYS))
    if (!window.isNaN(days)) {
      this.doneKeepDays = days
    }
  },
  computed: {
    fontAdjust: {
      get () {
        return this.$store.state.Settings.fontAdjust
      },
      set (val) {
        this.$store.commit('setFontAdjust', val)
      }
    },
    volume: {
      get () {
        return this.$store.state.Settings.volume
      },
      set (val) {
        this.$store.commit('setVolume', val)
      }
    }
  },
  methods: {
    changeFont (value) {
      UtilDom.playTap()
      this.fontAdjust = this.fontAdjust + value
      if (this.fontAdjust < 0) {
        this.fontAdjust = 0
      } else if (this.fontAdjust > 12) {
        this.fontAdjust = 12
      }
    },
    changeVolume (value) {
      this.volume = this.volume + value
      if (this.volume < 0) {
        this.volume = 0
      } else if (this.volume > 1) {
        this.volume = 1
      }
      UtilDom.setTapVolume(this.volume)
      console.log(this.volume)
      UtilDom.playTap()
    },
    setDoneSaveDays () {
      if (window.isNaN(this.doneKeepDays)) {
        this.doneKeepDays = 7
      }
      window.localStorage.setItem(CONST.DONE_KEEP_DAYS, this.doneKeepDays)
    },
    destroy () {
      UtilDom.playTap()
      this.todoDB.destroy()
    }
  }
}
</script>

<style>
</style>
