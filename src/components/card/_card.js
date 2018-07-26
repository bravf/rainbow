import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div} = jsx

var RCard = Vue.extend({
  props: {
    hover: {
      type: Boolean,
      default: false,
    },
    title: String,
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
    var title = null

    if (this.title){
      title = [this.title]
    }

    if ($slots.title){
      title = $slots.title
    }

    return div('.' + this.cls.join('+'),
      div('.r-card-head', {vif: !!title}, ...title),
      div('.r-card-extra', {vif: !!$slots.extra}, ...$slots.extra),
      div('.r-card-body', ...$slots.default)
    )
  }
})

Vue.component('r-card', RCard)