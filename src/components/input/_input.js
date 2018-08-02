import {hx, isdef} from '../../common/_tools'
import instance from '../../common/_instance'
import { RFormItem } from '../form/_form'
import jsx from '../../common/_jsx'

var {div, textarea, input, rIcon} = jsx

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
    clearable: Boolean,
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

      if (this.clearable || this.icon){
        cls.push('r-input-wrapper-has-icon')
      }

      return cls
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    }
  },
  render (h) {
    jsx.h = h
    
    var me = this
    var isInput = this.type === 'text' || this.type === 'password'
    var isTextarea = this.type === 'textarea'
    var myInput = isTextarea ? textarea : input

    var icon = this.icon
    if (this.clearable){
      icon = 'ios-close-outline'
    }

    return (
      div(`.r-input-wrapper + ${this.cls.join('+')}`,
        myInput('.r-input', {
          a_rows: this.rows,
          dp_type: isInput ? this.type : null,
          dp_value: isdef(this.value) ? this.value : '',
          dp_placeholder: this.placeholder || '',
          a_readonly: this.readonly,
          a_disabled: this.disabled,
          a_maxlength: this.maxlength,
          o_input (e) {
            me.$emit('input', e.target.value)
          },
          o_change (e) {
            me.$emit('change', e)
          },
          o_focus (e) {
            me.$emit('focus', e)
          },
          o_blur (e) {
            me.$emit('blur', e)
            
            if (me.trim){
              me.$emit('input', e.target.value.trim())
            }

            if (me.shouldValidate && me.formItem){
              me.formItem.validate()
            }
          }
        }),
        rIcon('.r-input-icon', {
          vif: !!icon,
          p_type: icon,
          no_click (e) {
            if (me.clearable){
              me.$emit('input', '')
            }
            me.$emit('click-icon', e)
          }
        })
      )
    )
  }
})

Vue.component('r-input', RInput)