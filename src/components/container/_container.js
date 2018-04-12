import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div} = jsx

var RContainer = Vue.extend({
  props: {
  },
  computed: {
    cls () {
      var cls = ['r-container']

      return cls
    },
  },
  methods: {
    _hasAside () {
      var has = false

      this.$slots.default.some(slot=>{
        var options = slot.componentOptions

        if (options && (options.tag === 'r-aside') ){
          has = true
          return true
        }
        else {
          return false
        }
      })

      return has
    }
  },  
  render (h) {
    jsx.h = h
    this._hasAside()

    return div('.r-container', {'c_r-container-vertical': this._hasAside()}, ...this.$slots.default)
  }
})

var RHeader = Vue.extend({
  props: {

  },
  render (h){
    jsx.h = h
    return div('.r-header', ...this.$slots.default)
  }
})

var RAside = Vue.extend({
  props: {

  },
  render (h) {
    jsx.h = h
    return div('.r-aside', ...this.$slots.default)
  }
})

var RMain = Vue.extend({
  props: {

  },
  render (h) {
    jsx.h = h
    return div('.r-main', ...this.$slots.default)
  }
})

var RFooter = Vue.extend({
  props: {

  },
  render (h) {
    jsx.h = h
    return div('.r-footer', ...this.$slots.default)
  }
})

Vue.component('r-container', RContainer)
Vue.component('r-header', RHeader)
Vue.component('r-aside', RAside)
Vue.component('r-main', RMain)
Vue.component('r-footer', RFooter)