<template>
  <div class="h-100 relative d-flex flex-column" @click="showDelIndex = -1">
    <div class="loading d-flex align-items-center justify-content-center" v-if="isLoading">
      <i class="fa fa-5x fa-spinner fa-pulse"></i>
    </div>

    <listnav :listName="listName" :isLoading="isLoading">
    </listnav>
    
    <header class="d-flex align-items-center px-1 mb-2" v-show="listName!==CONST.DONE">
      <button :class="['btn btn-outline-dark w-25', 
                    infoActive?'bg-dark text-white':'text-dark bg-white']"
            @click="showInfo">
        <i class="fa fa-info fa-lg align-middle btn-icon-w"></i>
        <span class="align-middle">{{CONST.DETAIL}}</span>
      </button>
      <div class="btn flex-item-grow btn-outline-dark text-dark bg-white mx-3" 
            @click.stop="popAdd">
        <i class="fa fa-plus fa-lg"></i>
      </div>
      <select class="form-control custom-select border-dark w-25"
              v-model="sortKey"
              @change="sort(sortKey)">
        <option disabled :value="CONST.SORT">
          {{CONST.SORT}}
        </option>
        <option v-for="(key,index) in CONST.SORT_KEYS" :key="index"   
                :value="key">
          {{key}}
        </option>
      </select>
    </header>

    <div class="w-100 flex-item-grow px-1">
      <div v-for="(item,index) in items" :key="index" 
            class="list-item-row d-flex align-items-center flex-nowrap list-item-bg mb-1"
            v-finger:swipe="swipeLeft.bind(this, index)"
            :style="{height: lineHeight}">
          
        <div :class="['h-100 d-flex align-items-center relative pl-2', getColor(item)]">
        </div>

        <div class="h-100 pl-2 d-flex align-items-center" @click.stop="">
          <checkbox v-model="item.done"
                    v-show="!editList" 
                    @input="setDone(item,index)">
          </checkbox>
        </div>

        <span class="h-100 text-cut relative flex-item-grow d-flex align-items-center px-2">
          <span>{{item.content}}</span>
          
          <span v-show="infoActive" class="info info-header text-cut text-muted">
            {{listName}}
          </span>
          <span v-show="infoActive" class="info info-footer text-cut text-muted text-right">
            {{item.planDate}}/{{item.planTime}}
          </span>
          <span v-if="item.remindInd && item.notifyId">
            <i class="fa fa-bell fa-inverse badge-bell"></i>
            <i class="fa fa-bell-o badge-bell"></i>
          </span>
          <priority-icon v-if="item.priority && (typeof item.priority === 'number') && (item.priority > 0)"
                          class="badge-priority"
                          :value="item.priority">
          </priority-icon>
        </span>

        <div class="h-100 p-0 m-0" v-show="listName!==CONST.DONE">
          <button class="list-item-button h-100 list-btn-bg p-0 m-0" 
                  v-show="!editList && (index!==showDelIndex)" 
                  @click.stop="popEdit(item,index)">
            <i class="fa fa-cog fa-fw align-middle"></i>
          </button>
          <button class="list-item-button h-100 text-white bg-danger p-0 m-0" 
                  v-show="editList || (index===showDelIndex)" 
                  @click.stop="deleteItem(item,index)">
            <i class="fa fa-trash-o fa-fw align-middle"></i>
          </button>
        </div>

      </div>

    </div>
    
    <pop  :loadItem="loadItem"
          :action="popAction"
          :listName="listName"
          :max="max"
          @add="add"
          @save="saveItem">
    </pop>
  </div>  
</template>

<script>
import moment from 'moment'
import * as CONST from '../modules/Const'
import Notify from '../modules/Notify'
import TodoDB from '../modules/TodoDB'
import Util from '../modules/Util'
import UtilDom from '../modules/UtilDom'

import listnav from './ListNav'
import Pop from './Pop'
import TodoItem from '../modules/TodoItem'
import PriorityIcon from './common/PriorityIcon'

export default {
  name: 'List',
  components: { Pop, listnav, PriorityIcon },
  props: ['listName'],
  data () {
    return {
      todoDB: new TodoDB('TodoDB'),                           // Will be user name in the future.
      CONST: CONST,
      items: [],
      showDelIndex: -1,
      isLoading: false,
      sortKey: CONST.SORT,
      infoActive: false,
      lineHeight: '3.75rem',
      min: null,
      max: null,

      popAction: '',                                          // For Pop editting
      loadItem: new TodoItem(),
      loadIndex: -1
    }
  },
  computed: {
    editList () { return this.$store.state.List.editList },
    planList () { return this.$store.state.SideBar.planList },
    planListArgs () { return this.$store.state.SideBar.planListArgs }
  },
  mounted () {
    this.isLoading = true
    this.editable = false                             // 刷新时，可更新

    if (this.planListArgs[this.listName]) {
      this.min = this.planListArgs[this.listName].min
      this.max = this.planListArgs[this.listName].max
    } else {
      this.min = null
      this.max = null
    }
    this.todoDB.createIndex()
      .then(() => {
        return this.todoDB.getItems(this.listName, this.min, this.max)
      })
      .then((result) => {
        this.items = result.docs
        this.isLoading = false
      })
      .catch(Util.log)
  },
  watch: {
    listName: function (val) {                          // 路由进入时，可更新
      this.isLoading = true
      this.$store.commit('shutEditList')
      this.showDelIndex = -1

      if (this.planListArgs[this.listName]) {
        this.min = this.planListArgs[this.listName].min
        this.max = this.planListArgs[this.listName].max
      } else {
        this.min = null
        this.max = null
      }
      this.todoDB.getItems(val, this.min, this.max)
        .then((result) => {
          this.items = result.docs
          this.isLoading = false
        })
        .catch(Util.log)
    }
  },
  methods: {
    saveDBItem (item) {
      this.todoDB.putOne(item).then((result) => {
        item._rev = result.rev                      // save _rev field for later modification
      })
    },
    getColor (item) {
      const now = new Date()
      const dateTime = Util.getItemDateTime(item)

      if (!dateTime) {
        return Util.isSuccess(item) ? 'bg-green-gradient' : ''
      } else if (dateTime <= now) {
        return 'bg-orange-gradient'
      } else if (Util.isSuccess(item)) {
        return 'bg-green-gradient'
      } else if (dateTime < now) {
        return ''
      } else if (dateTime > now) {
        return ''
      }
    },

    showInfo () {
      this.infoActive = !this.infoActive
      this.lineHeight = this.infoActive ? '4.5rem' : '3.75rem'
    },
    sort (sortKey) {
      this.isLoading = true
      switch (sortKey) {
        case CONST.SORT_DEFAULT:
          this.items.sort(Util.compareId)
          break
        case CONST.SORT_PRIORITY:
          this.items.sort(Util.comparePriority)
          break
        case CONST.SORT_REMINDER:
          this.items.sort(Util.compareReminder)
          break
        case CONST.SORT_DATETIME:
          this.items.sort(Util.compareDateTime)
          break
        default:
          break
      }
      this.isLoading = false
    },

    setDone (item, index) {
      UtilDom.playTap()
      if (item.done) {
        // item.doneDate = new Date()
        item.doneDate = moment().format('YYYY-MM-DD')
      } else {
        item.doneDate = null
        if (item.remindInd) {
          var planDateTime = Notify.timeObj(item.planDate, item.planTime)
          if (!planDateTime) {
            item.remindInd = false
          }
        }
      }
      this.todoDB.putOne(item).then((result) => {
        item._rev = result.rev                    // save _rev field for later modification
        if (item.remindInd && item.done) {
          Notify.cancel(item)
        } else if (item.remindInd && (!item.done)) {
          Notify.schedule(item, this.listName, planDateTime)
        }
      })
    },
    swipeLeft (index, evt) {
      if (evt.direction === 'Left') {
        this.showDelIndex = index
      }
    },
    deleteItem (item, index) {
      this.todoDB.remove(item).then(() => {
        this.items.splice(index, 1)
        this.showDelIndex = -1
      }).catch(Util.log)
      if (item.remindInd) {
        Notify.cancel(item)
      }
    },

    // Pop functions
    popAdd () {
      this.loadItem = new TodoItem()
      this.popAction = CONST.ADD
      this.$store.commit('setPop', true)
    },
    popEdit (item, index) {
      this.loadIndex = index
      this.loadItem = item
      this.popAction = CONST.EDIT
      this.$store.commit('setPop', true)
    },
    add (item) {
      let planDateTime
      if (item.remindInd) {
        planDateTime = Notify.timeObj(item.planDate, item.planTime)
        if (!planDateTime) {
          item.remindInd = false
        }
      }
      if (item.remindInd) {
        Notify.schedule(item, this.listName, planDateTime)
      }
      if (this.planList.indexOf(this.listName) >= 0) {      // Decide which listName to use
        item.list = CONST.DEFAULT
      } else {
        item.list = this.listName
      }

      this.todoDB.putOne(item).then((result) => {
        item._rev = result.rev                    // save _rev field for later modification
        this.items.push(item)
      })
    },
    saveItem (item) {
      let planDateTime = null
      const preItem = { ...this.items[this.loadIndex] }         // 对象浅复制

      if (item.remindInd) {
        planDateTime = Notify.timeObj(item.planDate, item.planTime)
        if (!planDateTime) {
          item.remindInd = false
        }
      }

      const isPlanListName = (this.planList.indexOf(this.listName) >= 0)
      if (isPlanListName || item.list === this.listName) {
        this.$set(this.items, this.loadIndex, item)
      } else {
        this.items.splice(this.loadIndex, 1)
      }
      this.saveDBItem(item)

      if ((!preItem.remindInd) && item.remindInd && planDateTime > new Date()) {
        Notify.schedule(item, this.listName, planDateTime)
      } else if (preItem.remindInd && (!item.remindInd)) {
        Notify.cancel(item)
      } else if (preItem.remindInd && item.remindInd) {
        Notify.update(item, this.listName, planDateTime)
        // Notify.schedule(item, this.listName, planDateTime)
      }

      this.loadIndex = -1
      this.loadItem = new TodoItem()
    }
  }    // End of methods
}
</script>

<style lang="scss">
@import "../assets/scss/const.scss";

.list-btn-bg {
  background: $list-bg;
}
.list-item-bg {
  background: $list-bg;
}
.list-item-row {
  padding:0;
  margin-top: 0;
  margin-bottom: 0.25rem;
  margin-left: 0;
  margin-right: 0;
}

.info{
  position: absolute;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
}
.info-header{
  width: 30%;
  top: -0.1rem;
  left: 2rem;
}
.info-footer{
  width: 45%;
  bottom: -0.1rem;
  right: 1.4rem;
}
.badge-bell{
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0rem;
  left: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;  
}
.badge-priority{
  position: absolute;
  margin: 0;
  padding: 0;
  bottom: -0.3rem;
  right: 0rem;
  font-size: 0.8rem;
  opacity: 0.7;
}
.btn-icon-w{
  width: 1.2rem;
}
.list-item-button {
  width: 3.75rem;
  font-size: 1.5rem;
  border-top:0;
  border-bottom:0;
  border-right:0;
  border-left: 1px solid $border-light;
}

.checkbox-component > label {                         //Customize checkbox 
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 2.5rem
}
.small-checkbox > .checkbox-component > label {       //Small checkbox 
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 1.8rem
}
// .checkbox-component > input+label > span.input-box {   //checkbox backgroud color
//   border-color: #4d82ff;
//   background: #4d82ff;
// }
// .checkbox-component > input+label > span.input-box > .input-box-tick > path {   //checkbox color
//   stroke: rgb(0, 100, 38);
// }
</style>
