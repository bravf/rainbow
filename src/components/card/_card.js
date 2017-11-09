import {hx} from '../../common/_tools.js'

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
    var $wrapper = hx(`div.${this.cls.join('+')}`)
    var $slots = this.$slots

    if ($slots.title){
      $wrapper.push(
        hx('div.r-card-head', {}, [$slots.title])
      )
    }

    if ($slots.extra){
      $wrapper.push(
        hx('div.r-card-extra', {}, [$slots.extra])
      )
    }

    $wrapper.push(
      hx('div.r-card-body', {} , [$slots.default])
    )

    return $wrapper.resolve(h)
  }
})

Vue.component('r-card', RCard)