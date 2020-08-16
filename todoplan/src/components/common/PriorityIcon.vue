<template>
  <div class="priority-wrapper">
    <i v-for="i in (value || 1)"
        class="fa fa-exclamation"
        :style="{'color': color}">
    </i>    
  </div>
</template>

<script>
export default {
  name: 'PriorityIcon',
  props: ['value'],
  data () {
    return {
    }
  },
  computed: {
    color () {
      if (this.value > 2) {
        return 'red'
      } else if (this.value === 2) {
        return 'purple'
      } else if (this.value === 1) {
        return 'orange'
      } else if (this.value === 0) {
        return 'black'
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.priority-wrapper{
  display: inline;
  white-space: nowrap;
  font-size: 1rem;
  
  i{
    padding: 0;
    margin: 0;
  }
}
</style>
