import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {button,div,span, rIcon} = jsx

var RButton = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: String,
    long: Boolean,
    htmlType: {
      type: String,
      default: 'button',
    },
    disabled: Boolean,
    loading: Boolean,
    icon: String,

    // icon位置，默认before
    // 枚举: before, after
    iconPos: {
      type: String,
      default: 'before'
    }
  },
  computed: {
    cls () {
      var cls = []
      cls.push(`r-btn-${this.type}`)
      
      if (this.disabled || this.loading){
        cls.push('r-btn-disabled')
      }

      if (this.size === 'small'){
        cls.push('r-btn-small')
      }

      if (this.long === true){
        cls.push('r-btn-long')
      }

      return cls
    }
  },
  render (h) {
    jsx.h = h

    var props = {}
    props['dp_type'] = this.htmlType

    if (this.disabled || this.loading){
      props['dp_disabled'] = 'disabled'
    }

    // 文本
    var $txt = span(...this.$slots.default)

    // 图标
    var icon = this.icon
    if (this.loading){
      icon = 'load-c'
    }

    if (icon){
      var $icon = rIcon('.r-button-icon', {
        p_type: icon,
        'p_auto-rotate': this.loading
      })
    }

    return (
      button(`.r-btn + ${this.cls.join('+')}`, props,
        ...(this.iconPos === 'after' ? [$txt, $icon] : [$icon, $txt])
      )
    )
  }
})

var RButtonGroup = Vue.extend({
  props: {
    size: String,
    align: {
      type: String,
      default: 'left',
    },
  },
  computed: {
    cls () {
      var cls = ['r-btn-group']
      
      if (this.size === 'small'){
        cls.push('r-btn-group-small')
      }
      
      return cls
    }
  },
  render (h) {
    jsx.h = h
    return div('.' + this.cls.join('+'), {'s_text-align':this.align}, ...this.$slots.default)
  }
})

Vue.component('r-button', RButton)
Vue.component('r-button-group', RButtonGroup)