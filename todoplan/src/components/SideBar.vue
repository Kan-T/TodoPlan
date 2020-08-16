<template>
  <div>    
    <div class="bg-close" @click.stop="toggleLeft" v-show="showSide"></div>

    <div class="side-container d-flex">

      <aside class="side-bar" v-show="showSide"> 
        <div class="side-brand d-flex justify-content-between">
            <div class="px-2" @click.stop="toggleLeft">
              <i class="fa fa-chevron-left fa-fw"></i>
              {{CONST.CLOSE_LIST}}
            </div>
            <div class="px-2" 
                  @click.stop="editable=!editable">
              {{ this.editable ? CONST.COMPLETE : CONST.EDIT }}
            </div>
        </div>

        <div class="side-body">
            <ul role="tablist" class="nav d-flex flex-column">

              <li :class="['nav-item', (activeLi==-1) ? 'li-active' : '']">
                <a class="nav-link" @click.stop="goto(-1)">
                  <i class="fa fa-fw fa-cog"></i> &nbsp {{CONST.SETTING}}
                </a>
              </li>

              <li class="nav-item" 
                  @click.stop="showPlanList=!showPlanList">
                <a class="nav-link">
                  {{CONST.PLAN_LIST}}
                  <i :class="['fa','fa-fw',showPlanList?'fa-caret-down':'fa-caret-right']"></i>
                </a>
              </li>
              <template v-for="(element,index) in asideList.planList">
                <li :class="['nav-item', (activeLi==index) ? 'li-active' : '']"
                    v-show="showPlanList" 
                    @click.stop="goto(index)">

                  <a class="nav-link sub-list">{{element}}</a>

                </li>
              </template>

              <li class="nav-item" 
                  @click.stop="showNamedList=!showNamedList">
                <a class="nav-link">{{CONST.LISTS}}
                  <i :class="['fa','fa-fw',showNamedList?'fa-caret-down':'fa-caret-right']"></i>
                </a>
              </li>
              <div v-if="showNamedList">
                <template v-for="(element,index) in asideList.namedList" >
                  <li :class="['d-flex align-items-center', 
                                (activeLi===(index + asideList.planList.length))?'li-active':'']"
                      @click.stop="goto(index + asideList.planList.length)">

                    <a class="flex-item-grow nav-link sub-list text-cut">  {{element}} </a>
                    <i class="fa fa-close text-danger" 
                        @click.stop="del(index,element)" 
                        v-show="editable && element !== CONST.DEFAULT">
                    </i>

                  </li>
                </template>
              </div>

            </ul>
        </div>

        <div class="side-foot-filler input-group">
            <input type="text" class="form-control " 
                    :placeholder="CONST.LIST_TO_ADD">
            <button class="input-group-addon">
              <i class="fa fa-plus fa-fw"></i>
            </button>
        </div>
        <div class="side-foot input-group">
            <input type="text" class="form-control " 
                    :placeholder="CONST.LIST_TO_ADD"
                    v-model="addItem">
            <button class="input-group-addon" @click.stop="add">
              <i class="fa fa-plus fa-fw"></i>
            </button>
        </div>        

      </aside>

      <div class="d-flex align-items-center justify-content-center">
        <div class="side-bar-switch" @click.stop="toggleLeft">
          <i class="fa fa-angle-right fa-fw"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import * as CONST from '../modules/Const'
import Util from '../modules/Util'
import TodoDB from '../modules/TodoDB'
import AsideList from '../modules/AsideList'

export default {
  name: 'SideBar',
  data () {
    return {
      todoDB: new TodoDB('TodoDB'),
      CONST: CONST,
      activeLi: -1,
      asideList: new AsideList(),
      addItem: '',
      addError: '',
      showPlanList: true,
      showNamedList: true,
      editable: false
    }
  },
  computed: {
    showSide () {
      return this.$store.state.SideBar.showSide
    },
    list () {
      return this.asideList.planList.concat(this.asideList.namedList)
    },
    planListArgs: {
      get () { return this.$store.state.SideBar.planListArgs },
      set (val) { this.$store.commit('setPlanListArgs', val) }
    }
  },
  mounted () {
    this.todoDB.db.find({
      selector: {
        list: this.CONST.ASIDE_LIST
      }
    }).then((result) => {
      if (result.docs && result.docs.length > 0) {
        this.asideList = result.docs[0]                      // initialize
      } else {
        this.asideList.planList = this.CONST.PLAN_TODO_LIST
        this.asideList.namedList = [CONST.DEFAULT]
      }
      this.$store.commit('setNamedList', this.asideList.namedList)
      this.$store.commit('setPlanList', this.asideList.planList)

      const listName = this.$route.params.listName           // 刷新时，active正确的列表项
      if (listName) {
        this.activeLi = this.list.indexOf(listName)
      }

      return this.todoDB.db.find({
        selector: {
          list: this.CONST.PLAN_LIST_ARGS
        }
      })
    }).then((result) => {
      if (result.docs && result.docs.length > 0) {
        this.planListArgs = result.docs[0]
      } else {
        this.planListArgs = CONST.PLAN_LIST_ARGS_INIT
      }
    }).catch(Util.log)
  },
  methods: {
    goto (index) {                     // 进入各子列表，用不同的listName名称复用List组件
      if (index >= 0) {
        const text = this.list[index]
        if (text) {
          this.activeLi = index
          this.$router.push({ name: 'list', params: { 'listName': text }})
          this.toggleLeft()
        }
      } else {
        this.activeLi = -1
        this.$router.push({ path: '/setting' })
        this.toggleLeft()
      }
    },

    toggleLeft () {
      this.$store.commit('toggleSide')
      this.editable = false
    },

    add () {
      const i = CONST.RESERVED_NAMES.indexOf(this.addItem)
      const j = this.asideList.namedList.indexOf(this.addItem)
      if (this.addItem !== '' & i < 0 & j < 0) {
        this.asideList.namedList.push(this.addItem)

        this.todoDB.putOne(this.asideList).then((result) => {
          this.asideList._rev = result.rev                    // save _rev field for later modification
          this.$store.commit('setNamedList', this.asideList.namedList)
        })
        this.addItem = ''
      }
    },

    del (index, element) {
      this.todoDB.getNamedListItems(element)
        .then((result) => {
          if (result.docs && result.docs.length > 0) {
            const message = CONST.LIST_DEL_ALERT
            const alertCallback = null
            const title = CONST.ATTENTION
            const buttonName = CONST.CONFIRM_BTN
            navigator.notification.alert(message, alertCallback, title, buttonName)
          } else {
            const i = index + this.asideList.planList.length
            if (i < this.activeLi) {
              this.activeLi = this.activeLi - 1
            } else if (i === this.activeLi) {
              this.activeLi = 0
              this.$router.push({ path: '/' })
            }

            this.asideList.namedList.splice(index, 1)
            this.todoDB.putOne(this.asideList)
              .then((result) => {
                this.asideList._rev = result.rev                    // save _rev field for later modification
                this.$store.commit('setNamedList', this.asideList.namedList)
              })
          }
        })
    }

  }, // end methods
  components: { }
}
</script>

<style lang="scss">
@import "../assets/scss/const.scss";

.side-container{
  position: fixed;
  z-index: 300;
  top: 0;
  height: 100%;
  max-width: 80%;
  font-size: 1.3rem;

  .side-bar-switch{
    position: absolute;
    right: -0.7rem;
    display: flex;
    align-items:center;
    width: 0.7rem;
    height: 3.6rem;
    box-shadow: 0.3rem 0 0.6rem rgba(0, 0, 0, .24);
    border-top-right-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    background: $side-bg;
    opacity: 0.6;
  }
  .side-bar {   
      position: relative;     
      width: $side-width;
      height: 100%;
      -ms-flex-negative: 0;
      flex-shrink: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background: $side-bg;
      box-shadow: 0.3rem 0 0.6rem rgba(0, 0, 0, .24);
  }
  .side-foot {
      border-top: $side-divide-line;
      background: $side-bg;
      position: fixed;
      bottom: 0px;
      left: 0px;
      width: $side-width;
      max-width: 80%;      
      padding-left: 2px;
      padding-right: 2px;
      padding-top: 2px;
      padding-bottom: 10px;
      margin-right: 0.3rem;
  }
  .side-foot-filler {
      visibility: hidden;
      border-top: $side-divide-line;
      padding-top: 2px;
      padding-bottom: 10px;
  }
  .side-brand{
      padding-top: 1rem;
      padding-bottom: 1rem;
      border-bottom: $side-divide-line;
  }
  .side-body {
      .nav li{
          margin: 0
      }
      .nav li.li-active {
          background: $side-active-bg;
          color: $side-active-col;
          font-weight: bold;
          box-shadow: inset 0.6rem 0 0 $side-active-col
      }
      .nav li a{
          color: inherit;
          transition: all .3s ease-in-out;
          text-align: left;
          text-transform: none;
          padding: 1rem;
          border: 0
      }
      .nav li a.sub-list{
          padding: 1rem 1.2rem 1rem 3rem
      }
      // .nav li:hover {
      //     background: $side-active-bg;
      // }
      .nav li.no-link a {
          font-weight: 700;
          cursor: default;
          background: transparent
      }
    }
  }
</style>