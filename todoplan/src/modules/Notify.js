// Utility Class, use the functions after deviceready.
import * as CONST from './Const'
import Util from './Util'

// Private functions for Notify Module
// function generateId(){
//   let idLocal = new Local(CONST.NOTIFY_ID)
//   let id = parseInt( idLocal.get() ) || 0
//   id = id + 1
//   idLocal.set(id)
//   return id
// }

// notify events
document.addEventListener('deviceready', function () {
  const notify = window.cordova.plugins.notification.local

// On trigger | Cordova Dialogs
  notify.on('trigger', function (notification) {
    Util.log('Triggered id: ' + notification.id)
    function onConfirm (buttonIndex) {
      if (buttonIndex === 1) {
        notify.core.fireEvent('later', notification)
      } else {
        notify.core.fireEvent('close', notification)
      }
    }
    navigator.notification.confirm(               // Show confirm dialog
          notification.text,                        // message
          onConfirm,                       // callback to invoke with index of button pressed
          notification.title,                       // title
          [CONST.REMIND_LATER, CONST.TURN_OFF]      // buttonLabels
      )
  })
// On trigger | Cordova Dialogs

  notify.on('add', function (notification) {
    Util.log('Added, notification.id: ' + notification.id)
  })

  notify.on('close', function (notification) {
    Util.log('On close, id: ' + notification.id)
    notify.cancel(notification.id)
  })

  notify.on('later', function (notification) {
    notify.cancel(notification.id)
    Notify.scheduleLater(notification)
  })
}, false)

// Notify utility Class Module
class Notify {
  static timeObj (date, time) {
    const dateTime = new Date()
    if (date && date > '' && time && time > '') {
      dateTime.setFullYear(date.substr(0, 4), (date.substr(5, 2) - 1), date.substr(8, 2))
      dateTime.setHours(time.substr(0, 2), time.substr(3, 2), 0, 0)
      return dateTime
    } else {
      const message = CONST.TIME_INCORRECT
      const alertCallback = null
      const title = CONST.ATTENTION
      const buttonName = CONST.CONFIRM_BTN
      Util.log(message)
      navigator.notification.alert(message, alertCallback, title, buttonName)
      return null
    }
  }

  static hasPermission () {
    const notify = window.cordova.plugins.notification.local

    notify.hasPermission(function (granted) {
      Util.log('hasPermission: ' + granted)
      if (!granted) {
        granted = Notify.requestPermission()
      }
    })
  }

  static requestPermission () {
    const notify = window.cordova.plugins.notification.local

    notify.requestPermission(function (granted) {
      Util.log('After register, hasPermission: ' + granted)
      return granted
    })
  }

  static schedule (item, listName, dateTime) {
    const notify = window.cordova.plugins.notification.local
    Notify.hasPermission()                         // Check notification permission

    if (dateTime) {
      item.notifyId = parseInt(item._id)
      notify.schedule({
        id: item.notifyId,
        title: listName,
        text: item.content,
        foreground: true,
        icon: 'res://favicon.ico',
        smallIcon: 'res://favicon.ico',
        sound: 'file://test.mp3',
        trigger: { at: dateTime },
        actions: [
          { id: 'close', type: 'button', title: CONST.TURN_OFF },
          { id: 'later', type: 'button', title: CONST.REMIND_LATER, launch: true }
        ]
      }, function () {})
    } else {
      const message = CONST.TIME_INCORRECT
      const alertCallback = null
      const title = CONST.ATTENTION
      const buttonName = CONST.CONFIRM_BTN
      navigator.notification.alert(message, alertCallback, title, buttonName)
    }
  }

  static scheduleLater (notification) {
    const notify = window.cordova.plugins.notification.local
    notification.trigger = { in: 10, unit: 'minute' }
    notify.schedule(notification, function () { Util.log('ScheduleLater end, id: ' + notification.id) })
  }

  static update (item, listName, dateTime) {
    Util.log('In update')
    const notify = window.cordova.plugins.notification.local

    if (!item.notifyId) {
      Notify.schedule(item, listName, dateTime)
      return
    }

    notify.get(item.notifyId, function (notification) {
      if (notification) {
        notify.update({
          id: item.notifyId,
          text: item.content,
          trigger: { at: dateTime }
        }, function () {
          notify.get(item.notifyId, function (notification) { Util.log(notification) })
        }
        )
      } else {
        Notify.schedule(item, listName, dateTime)
      }
    })
  };

  static cancel (item) {
    const notify = window.cordova.plugins.notification.local

    notify.cancel(item.notifyId, function () {
      item.notifyId = null
      Util.log('ID: ' + item.notifyId + ' cancelled.')
    })
  };

}

export default Notify
