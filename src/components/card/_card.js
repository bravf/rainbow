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
      div('.r-card-head', {vif: !!$slots.title}, ...$slots.title),
      div('.r-card-extra', {vif: !!$slots.extra}, ...$slots.extra),
      div('.r-card-body', ...$slots.default)
    )
  }
})

Vue.component('r-card', RCard)