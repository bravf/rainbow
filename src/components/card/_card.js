import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div} = jsx

var RCard = Vue.extend({
  props: {
    hover: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    cls () {
      var cls = ['r-card']

      if (this.hover){
        cls.push('r-card-hover')
      }

      return cls
    },
  },
  render (h) {
    jsx.h = h
    var $slots = this.$slots

    return div('.' + this.cls.join('+'),
      $slots.title ? div('.r-card-head', ...$slots.title) : null,
      $slots.extra ? div('.r-card-extra', ...$slots.extra) : null,
      div('.r-card-body', ...$slots.default)
    )
  }
})

Vue.component('r-card', RCard)