import * as CONST from './Const'

class AsideList {
  constructor () {
    this._id = CONST.ASIDE_LIST_ID
    this._rev = null
    this.list = CONST.ASIDE_LIST
    this.planList = []
    this.namedList = []
  }

}

export default AsideList
