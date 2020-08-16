<template>
<div>
  <nav class="navbar navbar-default d-flex align-items-center justify-content-between flex-nowrap p-0 mb-2" >
      <span class="d-flex align-items-center text-white h-100 px-2" @click.stop="toggleLeft">
        <i class="fa fa-bars fa-fw font-25"></i>
      </span>
      
      <span class="text-cut px-2">{{listName}}</span>

      <span class="d-flex align-items-center text-nowrap h-100 px-2" 
          v-if="listName !== CONST.SETTING && 
                listName !== CONST.DONE"
          @click="edit">
          <span :class="[editList?'text-primary':'']">{{ editList ? CONST.COMPLETE : CONST.DELETE }}</span>
      </span>
      <span class="px-4"
            v-if="listName === CONST.SETTING || 
                  listName === CONST.DONE">
      </span>
  </nav>  
</div>
</template>

<script>
import * as CONST from '../modules/Const'

export default {
  name: 'ListNav',
  components: { },
  data () {
    return {
      CONST: CONST
    }
  },
  props: ['isLoading', 'listName'],
  computed: {
    editList () {
      return this.$store.state.List.editList
    }
  },
  methods: {
    edit () {
      this.$store.commit('toggleEditList')
      if (this.editList) {
        this.$emit('editListEvent')
      }
    },
    toggleLeft () {
      this.$store.commit('toggleSide')
    }
  }    // End of methods
}
</script>

<style lang="scss">
@import "../assets/scss/const.scss";

.navbar-default {
  background: $nav-bg;
  color: $nav-color;
  height: 5rem;
  font-size: 1.6rem;
  font-weight: 700;
}
</style>
