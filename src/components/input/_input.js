import {hx} from '../../common/_tools.js'

var RInput = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: [String, Number],
    size: String,
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
    maxlength: [Number, String],
    icon: String,
    rows: {
      type: [Number, String],
      default: 2,
    },
    // 暂时不做
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    // 暂时不做
    number: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cls () {
      var cls = ['r-input-wrapper']

      if (this.type === 'textarea'){
        cls.push('r-input-wrapper-textarea')
      }
      else {
        if (this.size === 'small'){
          cls.push('r-input-wrapper-small')
        }
      }

      return cls
    }
  },
  render (h) {
    var me = this
    var $input

    var params = {
      domProps: {
        value: this.value || '',
        placeholder: this.placeholder || '',
      },
      attrs: {
        readonly: this.readonly,
        disabled: this.disabled,
        maxlength: this.maxlength,
      },
      on: {
        input (e) {
          me.$emit('input', e.target.value)
        },
        change (e) {
          me.$emit('change', e)
        },
        focus () {
          me.$emit('focus')
        },
        blur () {
          me.$emit('blur')
        },
      },
    }
    
    if (this.type === 'textarea'){
      params.attrs.rows = this.rows
      $input = hx(`textarea.r-input`, params)
    }
    else {
      params.domProps.type = this.type
      $input = hx(`input.r-input`, params)
    }

    var icon = this.icon
    var $icon

    if (this.clearable){
      icon = 'ios-close-outline'
    }
    
    if (icon){
      $icon = hx('r-icon.r-input-icon', {
        props: {
          type: icon,
        },
        nativeOn: {
          click (e) {
            me.$emit('click-icon', e)
          }
        },
      })
    }

    return hx(`div.r-input-wrapper + ${this.cls.join('+')}`,)
      .push($icon)
      .push($input)
      .resolve(h)
  }
})

Vue.component('r-input', RInput)