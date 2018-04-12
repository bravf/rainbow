import {hx} from '../../common/_tools'
import instance from '../../common/_instance'
import { RFormItem } from '../form/_form'
import jsx from '../../common/_jsx'

var {label, rIcon, div, span} = jsx

var RRadio = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: [String, Number, Boolean],
    value: {
      type: [String, Number, Boolean],
      default: true,
    },
    label: [String, Number],
    disabled: Boolean,
  },
  computed: {
    cls () {
      var cls = ['r-radio']

      if (this.checked){
        cls.push('r-radio-checked')
      }
      
      if (this.disabled){
        cls.push('r-radio-disabled')
      }

      return cls
    },
    isGroupParent () {
      return this.$parent instanceof RRadioGroup
    },
    checked () {
      if (this.isGroupParent){
        return this.$parent.checkedValue === this.value
      }
      else {
        return (this.checkedValue === this.value) || (this.checkedValue === true)
      }
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    }
  },
  render (h) {
    var me = this
    jsx.h = h

    var content

    if (this.label){
      content = [this.label]
    }

    if (this.$slots.default){
      content = this.$slots.default
    }

    return (
      label('.' + this.cls.join('+'), {
        o_click () {
          if (me.disabled){
            return
          }
          if (me.isGroupParent){
            me.$parent.$emit('input', me.value)
          }
          else {
            me.$emit('input', me.value)
          }

          if (me.formItem){
            me.formItem.validate()
          }
        }
      },
        rIcon('.r-radio-icon', {
          p_type: this.checked ? 'android-radio-button-on' : 'android-radio-button-off'
        }),
        span({vif: !!content}, ...content)
      )
    )
  }
})

var RRadioGroup = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: [String, Number],
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cls () {
      var cls = ['r-radio-group']

      if (this.vertical){
        cls.push('r-radio-group-vertical')
      }

      return cls
    },
  },
  render (h) {
    jsx.h = h
    return div('.' + this.cls.join('+'), ...this.$slots.default)
  }
})

Vue.component('r-radio', RRadio)
Vue.component('r-radio-group', RRadioGroup)