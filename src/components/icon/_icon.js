import {hx} from '../../common/_tools.js'

var RbIcon = Vue.extend({
  props: {
    type: String,
    size: [String, Number],
    color: String,
    autoRotate: Boolean,
  },
  computed: {
    cls () {
      var cls = []
      cls.push(`ion-${this.type}`)

      if (this.autoRotate){
        cls.push('rb-icon-rotate')
      }

      return cls
    },
    style () {
      var style = {}

      if (this.size){
        style['font-size'] = this.size + 'px'
      }
      if (this.color){
        style['color'] = this.color
      }

      return style
    }
  },
  render (h) {
    return hx(`i.rb-icon + ${this.cls.join('+')}`, {
      style: this.style
    }).resolve(h)
  }
})

Vue.component('rb-icon', RbIcon)