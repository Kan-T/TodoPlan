class TodoItem {
  constructor (content, list, priority, done, doneDate, planDate, planTime, remindInd) {
    this._id = new Date().toISOString()
    this._rev = null
    this.content = content              // Also used as title field in Calendar
    this.list = list
    this.priority = priority
    this.done = false
    this.doneDate = doneDate

    this.planDate = planDate
    this.planTime = planTime
    this.remindInd = remindInd
    this.notifyId = null
    this.subItems = []
  }
}

export default TodoItem
