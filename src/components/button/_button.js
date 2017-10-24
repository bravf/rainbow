import {hx} from '../../common/_tools.js'

var RbButton = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: String,
    long: {
      type: Boolean,
      default: false,
    },
    htmlType: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    icon: String,
  },
  computed: {
    cls () {
      var cls = []
      cls.push(`rb-btn-${this.type}`)
      
      if (this.disabled || this.loading){
        cls.push('rb-btn-disabled')
      }

      if (this.size === 'small'){
        cls.push('rb-btn-small')
      }

      if (this.long === true){
        cls.push('rb-btn-long')
      }      

      return cls
    }
  },
  render (h) {
    var $btn = hx(`button.rb-btn + ${this.cls.join('+')}`, {
      domProps: {
        type: this.htmlType,
      },
    })
    var $btnTxt = this.$slots.default

    var icon = this.icon
    if (this.loading){
      icon = 'load-c'
    }

    if (icon){
      var $icon = hx('rb-icon', {
        'class': {
          'rb-icon-only': $btnTxt ? false : true,
        },
        props: {
          type: icon,
          'auto-rotate': this.loading,
        },
      })
      $btn.push($icon)
    }

    $btn.push($btnTxt)
    return $btn.resolve(h)
  }
})

var RbButtonGroup = Vue.extend({
  props: {
    size: String,
  },
  computed: {
    cls () {
      var cls = ['rb-btn-group']
      
      if (this.size === 'small'){
        cls.push('rb-btn-group-small')
      }
      
      return cls
    }
  },
  render (h) {
    return hx(`div.${this.cls.join('+')}`, {}, [this.$slots.default]).resolve(h)
  }
})

Vue.component('rb-button', RbButton)
Vue.component('rb-button-group', RbButtonGroup)