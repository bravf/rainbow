import {hx, isdef} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { RFormItem } from '../form/_form'

var RInput = Vue.extend({
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: [String, Number],
    size: String,
    placeholder: {
      type: String,
      default: '请输入',
    },
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
    // 是否触发校验，默认触发，当rinput被其他组件使用时候选择关闭
    shouldValidate: {
      type: Boolean,
      default: true,
    },
    // 是否trim
    trim: Boolean,
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
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    }
  },
  render (h) {
    var me = this
    var $input

    var params = {
      domProps: {
        value: isdef(this.value) ? this.value : '',
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
        focus (e) {
          me.$emit('focus', e)
        },
        blur (e) {
          me.$emit('blur', e)

          if (me.trim){
            me.$emit('input', e.target.value.trim())
          }

          if (me.shouldValidate && me.formItem){
            me.formItem.validate()
          }
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
    var cls = this.cls
    var $icon

    if (this.clearable){
      icon = 'ios-close-outline'
    }
    
    if (icon){
      cls.push('r-input-wrapper-has-icon')

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

    return hx(`div.r-input-wrapper + ${cls.join('+')}`)
      .push($icon)
      .push($input)
      .resolve(h)
  }
})

Vue.component('r-input', RInput)