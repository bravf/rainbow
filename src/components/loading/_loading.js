import {hx} from '../../common/_tools'
import jsx from  '../../common/_jsx'

var {div} = jsx

var RLoading = Vue.extend({
  render (h) {
    jsx.h = h
    return div('.r-table-loading', div(), div(), div(), div(), div())
  }
})

Vue.component('r-loading', RLoading)