// import Vue from 'vue'
// import app from '../../../src/app.vue'
// const assert = require('assert')

// describe('app.vue', () => {
//   it('touchStartX init to 0', () => {
//     const vm = new Vue(app).$mount()
//     assert.strictEqual(vm.touchStartX, 0)
//   })
// })

import Vue from 'vue'
import app from '../../../src/app.vue'
const assert = require('chai').assert

describe('app.vue', () => {
  it('touchStartX init to 0', () => {
    const vm = new Vue(app).$mount()
    assert.strictEqual(vm.touchStartX, 0)
  })
})
