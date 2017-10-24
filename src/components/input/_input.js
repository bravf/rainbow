import {hx} from '../../common/_tools.js'

var RbInput = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: [String, Number],
    size: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    maxlength: [Number, String],
    icon: String,
    rows: {
      type: [Number, String],
      default: 2,
    },

    // 设置为true，则显示loading icon，主要用作ajax校验
    loading: {
      type: Boolean,
      default: false,
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
      var cls = ['rb-input-wrapper']

      if (this.type === 'textarea'){
        cls.push('rb-input-wrapper-textarea')
      }
      else {
        if (this.size === 'small'){
          cls.push('rb-input-wrapper-small')
        }
        else if (this.size === 'mini'){
          cls.push('rb-input-wrapper-mini')
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
        input ($$event) {
          me.$emit('input', $$event.target.value)
        },
        change ($$event) {
          me.$emit('change', $$event)
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
      $input = hx(`textarea.rb-input`, params)
    }
    else {
      params.domProps.type = this.type
      $input = hx(`input.rb-input`, params)
    }

    var icon = this.icon
    var $icon

    if (this.clearable){
      icon = 'ios-close-outline'
    }
    
    if (this.loading){
      icon = 'load-c'
    }
    
    if (icon){
      $icon = hx('rb-icon', {
        props: {
          type: icon,
          'auto-rotate': this.loading,
        },
      })
    }

    return hx(`div.rb-input-wrapper + ${this.cls.join('+')}`, {
      on: {
        click ($$event) {
         var $$target = $$event.target

         if ($$target.tagName.toLowerCase() === 'i'){
           me.$emit('click')
           
           if (me.clearable){
             me.$emit('input', '')
           }
         }
        }
      }
    })
      .push($icon)
      .push($input)
      .resolve(h)
  }
})

Vue.component('rb-input', RbInput)