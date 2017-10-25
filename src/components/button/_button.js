import {hx} from '../../common/_tools.js'

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
    var params = {
      domProps: {
        type: this.htmlType,
      },
    }

    if (this.disabled || this.loading){
      params.domProps['disabled'] = 'disabled'
    }

    var $btn = hx(`button.r-btn + ${this.cls.join('+')}`, params)
    var $btnTxt = this.$slots.default

    var icon = this.icon
    if (this.loading){
      icon = 'load-c'
    }

    if (icon){
      var $icon = hx('r-icon', {
        'class': {
          'r-icon-only': $btnTxt ? false : true,
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

var RButtonGroup = Vue.extend({
  props: {
    size: String,
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
    return hx(`div.${this.cls.join('+')}`, {}, [this.$slots.default]).resolve(h)
  }
})

Vue.component('r-button', RButton)
Vue.component('r-button-group', RButtonGroup)