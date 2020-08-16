<template>
  <b-modal size="lg" no-close-on-backdrop no-fade v-model="open" :title="action"
          @shown="init" 
          @hidden="hide">

    <section class="d-flex align-items-center border-bottom pb-2"
          v-if="action === CONST.EDIT">
      <span class="text-nowrap pr-3">
        {{CONST.SAVE_TO}}{{CONST.LIST}}:
      </span>
      <select class="form-control custom-select"
              @change="playTap"
              v-model="saveItem.list">
        <option disabled value="">{{CONST.SAVE_TO}}</option>
        <option v-for="(list,index) in namedList" :key="index" 
                :value="list">
          {{list}}
        </option>
      </select>
    </section>

    <section class="w-100 d-flex align-items-center flex-nowrap py-3">
      <auto-textarea id="itemContent" border
                    :warn="warnContent"
                    :placeholder="CONST.ADD_ITEM_CONTENT"
                    v-model="saveItem.content"/>
      
    </section>

    <section class="d-flex align-items-center pb-3">
      <span class="col-5">
        {{CONST.PRIORITY}}:
      </span>
      <priority-dropdown  :item="saveItem"
                          @changePriority="changePriority">
      </priority-dropdown>
    </section>

    <section :class="['py-2', warnReminder ? 'border border-danger' : 'border-top border-bottom']">
      <div class="d-flex align-items-center pb-1">
        <span class="col-5">
          {{CONST.REMIND}}:
        </span>
        <my-switch @change="playTap" 
                  v-model="saveItem.remindInd">
        </my-switch>
      </div>

      <div class="d-flex align-items-center py-1">
        <span class="col-5">
          {{CONST.DATE}}:
        </span>
        <input type="date" class="form-control flex-item-grow input-time"
                v-model="saveItem.planDate">
      </div>

      <div class="d-flex align-items-center py-1">
        <span class="col-5">
          {{CONST.TIME}}:
        </span>
        <input type="time" class="form-control flex-item-grow input-time" 
                v-model="saveItem.planTime">
      </div>
      
      <span class="small pt-1">{{CONST.ADDTODO_MESSAGE}}</span>
    </section>

    <section class="list-body pl-3 pt-3 pb-0">
      <li :class="['sub-input d-flex align-items-center justify-items-left flex-nowrap',
                    subInputFocus?'sub-input-focus':'border-bottom']">
        <span class="flex-item-grow"
              @focusin="subInputFocus=true"
              @focusout="subInputFocus=false">
          <auto-textarea :placeholder="CONST.ADD_SUBITEM"
                          v-model="subContent"/>
        </span>

        <button class="btn bg-dark-gradient" @click="addSubItem">
          <i class="fa fa-plus fa-fw fa-inverse"></i>
        </button>
      </li>

      <li :class="['sub-input d-flex align-items-center justify-items-left flex-nowrap ml-2',
                    subItemFocus?'sub-input-focus':'border-bottom']" 
          v-for="(subItem,subIndex) in saveItem.subItems" :key="subIndex">
        <div class="small-checkbox">
          <checkbox v-model="subItem.done">
          </checkbox>
        </div>

        <span class="flex-item-grow"
              @focusin="subItemFocus=true"
              @focusout="subItemFocus=false">
          <auto-textarea v-model="subItem.content"/>
        </span>

        <i class="fa fa-close fa-fw color-gray"
            @click.stop="delSubItem(saveItem,subIndex)">
        </i>
      </li>

    </section>

    <div slot="modal-footer" class="flex-item-grow row justify-content-around px-3">
      <button type="button" class="col flex-item-grow btn btn-outline-dark" @click="open=false">{{CONST.CANCEL}}</button>
      <span class="col"></span>
      <button type="button" class="col flex-item-grow btn btn-primary" @click="save">{{CONST.SAVE}}</button>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import mySwitch from './common/MySwitch'
import autoTextarea from './common/AutoTextarea'
import PriorityDropdown from './PriorityDropdown'
import * as CONST from '../modules/Const'
import TodoItem from '../modules/TodoItem'
import Util from '../modules/Util'
import UtilDom from '../modules/UtilDom'

export default {
  name: 'Pop',
  components: { mySwitch, autoTextarea, PriorityDropdown },
  data () {
    return {
      CONST: CONST,
      warnReminder: false,
      warnContent: false,
      saveItem: new TodoItem(),
      subContent: '',
      subInputFocus: false,
      subItemFocus: false
    }
  },
  props: ['loadItem', 'action', 'listName', 'max'],
  computed: {
    namedList () {
      return this.$store.state.SideBar.namedList
    },
    open: {
      get () {
        return this.$store.state.Pop.showPop
      },
      set (val) {
        this.$store.commit('setPop', val)
      }
    }
  },
  methods: {
    playTap: UtilDom.playTap,
    init () {
      this.saveItem = { ...this.loadItem }
      // this.saveItem = Object.assign({}, this.loadItem)      //对象浅复制

      if (this.action === CONST.ADD) {
        if (Util.validInt(this.max)) {
          this.saveItem.planDate = moment().add(this.max, 'days').format('YYYY-MM-DD')
        }
      }
    },
    hide () {
      this.warnReminder = false
      this.warnContent = false
    },
    save () {
      if (!this.saveItem.content) {              // Need to add JSON filter function.
        this.warnContent = true
        return
      }
      if (this.saveItem.remindInd &&
          (!this.saveItem.planDate ||
            this.saveItem.planDate === '' ||
            !this.saveItem.planTime ||
            this.saveItem.planTime === '')) {
        this.warnReminder = true
        return
      }

      if (this.action === CONST.EDIT) {
        this.$emit('save', this.saveItem)
      } else if (this.action === CONST.ADD) {
        this.$emit('add', this.saveItem)
      }

      this.open = false
    },
    changePriority (item, value) {
      if (value === 0) {
        this.$set(item, 'priority', null)
      } else {
        this.$set(item, 'priority', value)
      }
    },
    changeSubItem (event, item, subItem) {
      subItem.content = event.currentTarget.innerText
    },
    delSubItem (item, subIndex) {
      item.subItems.splice(subIndex, 1)
    },
    addSubItem (val) {
      const sub = {}
      if (val > '') {
        sub.content = this.subContent
        sub.done = false
        this.saveItem.subItems.push(sub)
        this.subContent = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sub-input.sub-input-focus{
  border-bottom: 2px solid rgb(0, 183, 255);
}
</style>
