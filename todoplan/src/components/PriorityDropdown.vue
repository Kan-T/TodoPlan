<template>
  <div class="relative">
    <button class="btn btn-outline-secondary dropdown-toggle bg-light"  
            @click.stop="show=!show">
      <priority-icon class="pr-2" :value="item.priority">
      </priority-icon>
    </button>

    <div v-if="show">
      <div class="bg-close-opacity" @click.stop="show=false"></div>

      <ul class="my-dropdown-menu">
        <li v-for="i in 3"
            class="d-flex align-items-center flex-nowrap border-bottom p-2"
            @click.stop="changePriority(i)">
          <span class="text-nowrap px-2">{{CONST.PRIORITIES[i-1]}}</span>
          <priority-icon :value="i"></priority-icon>
        </li>

        <li class="d-flex align-items-center flex-nowrap border-bottom p-2"
            @click.stop="changePriority(0)">
          <span class="text-nowrap px-2">{{CONST.CLEAR + CONST.PRIORITY}}</span>  
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as CONST from '../modules/Const'
import PriorityIcon from './common/PriorityIcon'

export default {
  name: 'PriorityDropdown',
  components: { PriorityIcon },
  data () {
    return {
      CONST: CONST,
      show: false
    }
  },
  props: ['item'],
  computed: {
  },
  methods: {
    changePriority (value) {
      this.$emit('changePriority', this.item, value)
      this.show = false
    }
  }
}
</script>


<style>
.my-dropdown-menu {
  position: absolute;
  bottom: auto;
  right: 0;
  z-index: 300;
  padding: 0;
  margin: 0;
  list-style: none;
  font-size: inherit;
  text-align: left;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  -webkit-background-clip: padding-box;
          background-clip: padding-box;
}
.bg-close {
    opacity: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
}
.icon-block {
  font-size: 0.6rem;
  margin-left: -0.5rem;
}
.active {
  background: #F2FAFF;
  border-left: 2px solid #7CC9F7;
}
</style>
