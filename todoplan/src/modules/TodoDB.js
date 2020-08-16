// PouchDB class
import PouchDB from 'pouchdb'
import PouchFind from 'pouchdb-find'
import moment from 'moment'

import * as CONST from './Const'
import Util from '../modules/Util'
PouchDB.plugin(PouchFind)

export default class TodoDB {
  constructor (dbName) {
    this.dbName = dbName
    this.db = new PouchDB(dbName, { 'auto_compaction': true })    // Need to build a unique dbname by constructor parameter

    // PouchDB.debug.disable('pouchdb:find')
    // PouchDB.debug.enable('pouchdb:find')
    // db.changes({
    //   since: 'now',
    //   live: true
    // }).on('change', showTodos);
  }
  // sync() {
  //   this.db.sync('http://kan:kan@127.0.0.1:5984/TodoDB', {
  //     live: true,
  //     retry: true
  //   }).on('error', Util.log)
  // }

  // Always catch errors at the end, when using DB class functions.
  put (doc) {
    return this.db.put(doc)
  }
  remove (doc) {
    return this.db.remove(doc)
  }
  createIndex () {
    return this.db.createIndex({
      index: {
        fields: ['planDate', 'done']
      }
    })
    .then(() => {
      return this.db.createIndex({
        index: {
          fields: ['list', 'done']
        }
      })
    })
    .then(() => {
      return this.db.createIndex({
        index: {
          fields: ['list'],
          name: 'listIndex'
        }
      })
    })
    .then(() => {
      return this.db.createIndex({
        index: {
          fields: ['done'],
          name: 'doneIndex'
        }
      })
    })
  }

  putOne (doc) {
    return this.db.put(doc).catch(Util.log)
  }
  destroy () {
    this.db.destroy().then(function (response) {
    }).catch(Util.log)
  }

  setId (doc, id) {
    doc._id = id.toString()
    this.db.putOne(doc)
  }

  getNamedListItems (listName) {
    switch (listName) {
      case CONST.NO_PLAN:
        return this.db.find({
          selector: {
            planDate: { $lte: '' },
            done: false
          }
        })

      case CONST.DONE:
        return this.db.find({
          selector: {
            done: true
          }
        })

      default:
        return this.db.find({
          selector: {
            list: listName,
            done: false
          }
        })
    }
  }

  getItems (listName, min, max) {
    if (Util.validInt(min)) {
      min = moment().add(min, 'days').format('YYYY-MM-DD')
    } else if (min === -Infinity) {
      min = moment('0000-01-01', 'YYYY-MM-DD').format('YYYY-MM-DD')
    }
    if (Util.validInt(max)) {
      max = moment().add(max, 'days').format('YYYY-MM-DD')
    } else if (max === Infinity) {
      max = moment('9999-12-31', 'YYYY-MM-DD').format('YYYY-MM-DD')
    }

    if (min && max) {
      return this.db.find({
        selector: {
          $and: [
            { planDate: { $gte: min }},
            { planDate: { $lte: max }},
            { done: false }
          ]
        }
      })
    } else {
      return this.getNamedListItems(listName)
    }
  }
}
