import * as CONST from './Const'
import Util from './Util'
import TodoDB from './TodoDB'
import moment from 'moment'

function getDelItems (doneItems, delDate) {                                 // webworker function
  if (doneItems && doneItems.length > 0) {
    const delItems = doneItems.filter(item => item.doneDate.substring(0, 10) <= delDate)
    postMessage(delItems)
  }
}

export function cleanDone (vueObj) {
  const todoDB = new TodoDB('TodoDB')
  const today = moment().format('YYYY-MM-DD')
  const lastCleanDate = window.localStorage.getItem(CONST.LAST_CLEAN_DATE)

  if (!lastCleanDate || today > lastCleanDate) {
    let keepDays = parseInt(window.localStorage.getItem(CONST.DONE_KEEP_DAYS))
    if (isNaN(keepDays)) {
      keepDays = 7
    }
    const delDate = moment().subtract(keepDays, 'days').format('YYYY-MM-DD')

    return todoDB.getNamedListItems(CONST.DONE)
      .then((result) => {
        return vueObj.$worker.run(getDelItems, [result.docs, delDate])      // Run webworker
      })
      .then((delItems) => {
        if (delItems && delItems.length > 0) {
          return Promise.all(delItems.map(function (item) {
            return todoDB.remove(item)
          }))
        }
      })
      .then((result) => {
        // window.localStorage.setItem(CONST.LAST_CLEAN_DATE, today)
      })
      .catch(Util.log)
  }
}
