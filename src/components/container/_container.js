import {hx} from '../../common/_tools.js'

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
    this._hasAside()
    return hx('div.r-container', {
      'class': {
        'r-container-vertical': this._hasAside()
      }
    }, [this.$slots.default]).resolve(h)
  }
})

var RHeader = Vue.extend({
  props: {

  },
  render (h){
    return hx('div.r-header', {}, [this.$slots.default]).resolve(h)
  }
})

var RAside = Vue.extend({
  props: {

  },
  render (h) {
    return hx('div.r-aside', {}, [this.$slots.default]).resolve(h)
  }
})

var RMain = Vue.extend({
  props: {

  },
  render (h) {
    return hx('div.r-main', {}, [this.$slots.default]).resolve(h)
  }
})

var RFooter = Vue.extend({
  props: {

  },
  render (h) {
    return hx('div.r-footer', {}, [this.$slots.default]).resolve(h)
  }
})

Vue.component('r-container', RContainer)
Vue.component('r-header', RHeader)
Vue.component('r-aside', RAside)
Vue.component('r-main', RMain)
Vue.component('r-footer', RFooter)