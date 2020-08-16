// Utility Class

class Util {
  static log (msg) {
    if (process.env.NODE_ENV === 'development') {
      console.log(msg)
    }
  }

  static toDate (dateString) {          // Convert date string format('2018-01-08T06:39:19.733Z') to date obj.
    const strArray = dateString.split('T')
    const strDate = strArray[0].split('-')
    const strTime = strArray[1].substr(0, 12).split(':')
    return new Date(strDate[0], (strDate[1] - parseInt(1)), strDate[2], strTime[0], strTime[1], strTime[2])
  }

  static validInt (val) {
    const IntReg = new RegExp('^-?\\d+$')
    return IntReg.test(val)
  }

  static getItemDateTime (item) {
    const dateTime = new Date()
    const date = item.planDate
    const time = item.planTime
    if (date) {
      dateTime.setFullYear(date.substr(0, 4), (date.substr(5, 2) - 1), date.substr(8, 2))
    } else {
      return null
    }
    if (time) {
      dateTime.setHours(time.substr(0, 2), time.substr(3, 2), 0, 0)
    } else {
      dateTime.setHours(23, 59, 59, 0)
    }
    return dateTime
  }
  static isSuccess (item) {
    const subs = item.subItems
    let ok = true
    if (subs && subs.length > 0) {
      subs.forEach((sub) => {
        if (!sub.done) {
          ok = false
        }
      })
    } else {
      ok = false
    }
    return ok
  }
  static compareReminder (item1, item2) {
    if (item1.remindInd && !item2.remindInd) {                    // One remindInd on, one off
      return -1
    } else if (!item1.remindInd && item2.remindInd) {
      return 1
    } else if (item1.remindInd && item2.remindInd) {              // RemindInds both on
      const dateTime1 = Util.getItemDateTime(item1)
      const dateTime2 = Util.getItemDateTime(item2)
      if (dateTime1 < dateTime2) {
        return -1
      } else if (dateTime1 === dateTime2) {
        return 0
      } else {
        return 1
      }
    } else {                                                        // RemindInds both off
      if (item1.planDate && !item2.planDate) {
        return -1
      } else if (!item1.planDate && item2.planDate) {
        return 1
      }
      const dateTime1 = Util.getItemDateTime(item1)
      const dateTime2 = Util.getItemDateTime(item2)
      if (dateTime1 < dateTime2) {
        return -1
      } else if (dateTime1 === dateTime2) {
        return 0
      } else {
        return 1
      }
    }
  }
  static compareDateTime (item1, item2) {
    if (item1.planDate && !item2.planDate) {
      return -1
    } else if (!item1.planDate && item2.planDate) {
      return 1
    }
    const dateTime1 = Util.getItemDateTime(item1)
    const dateTime2 = Util.getItemDateTime(item2)
    if (dateTime1 < dateTime2) {
      return -1
    } else if (dateTime1 === dateTime2) {
      return 0
    } else {
      return 1
    }
  }
  static compareId (item1, item2) {
    return (item1._id < item2._id) ? -1 : 1
  }
  static comparePriority (item1, item2) {
    item1.priority = item1.priority || 0
    item2.priority = item2.priority || 0
    if (item1.priority < item2.priority) {
      return 1
    } else if (item1.priority === item2.priority) {
      return 0
    } else {
      return -1
    }
  }

  static focusEnd (obj) {
    const len = obj.innerText.length
    if (window.getSelection) {                              // For contenteditable block
      obj.focus()                                           // 解决ff不获取焦点无法定位问题
      const range = window.getSelection()                     // 创建range
      range.selectAllChildren(obj)                          // range 选择obj下所有子内容
      range.collapseToEnd()                                 // 光标移至最后
    } else if (obj.setSelectionRange) {                     // For input tag
      obj.childNodes[0].setSelectionRange(len, len)
    } else if (document.selection) {                        // For IE
      const sel = obj.createTextRange()
      sel.moveStart('character', len)
      sel.collapse()
      sel.select()
    }
  }
}

export default Util
