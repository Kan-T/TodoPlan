const storage = window.localStorage

const Local = function (key) {
  this.get = function () {
    return JSON.parse(storage.getItem(key))
  }
  this.set = function (obj) {
    storage.setItem(key, JSON.stringify(obj))
  }
  this.clear = function () {
    storage.removeItem(key)
  }
  this.addList = function (item) {
    const arr = this.get() || []
    arr.push(item)
    this.set(arr)
  }
}

export default Local
