import {hx} from '../../common/_tools.js'

var RLoading = Vue.extend({
  render (h) {
    return hx('div.r-table-loading').push(
      [hx('div'), hx('div'), hx('div'), hx('div'), hx('div'),]
    )
    .resolve(h)
  }
})

Vue.component('r-loading', RLoading)