import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {i} = jsx

var RIcon = Vue.extend({
  props: {
    type: String,
    size: [String, Number],
    color: String,
    autoRotate: Boolean,
  },
  computed: {
    cls () {
      var cls = ['r-icon']
      cls.push(`ion-${this.type}`)

      if (this.autoRotate){
        cls.push('r-icon-rotate')
      }

      return cls
    }
  },
  render (h) {
    jsx.h = h
    return i('.' + this.cls.join('+'), {
      's_font-size': this.size ? this.size + 'px' : null,
      's_color': this.color ? this.color : null
    })
  }
})

Vue.component('r-icon', RIcon)