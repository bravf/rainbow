import {isArray, inArray, hx} from '../../common/_tools'
import instance from '../../common/_instance'
import { RFormItem } from '../form/_form'
import jsx from '../../common/_jsx'

var {label, rIcon, span ,div} = jsx

var RCheckbox = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: [String, Number, Boolean, Array],
    value: {
      type: [String, Number, Boolean],
      default: true,
    },
    label: [String, Number],
    indeterminate: Boolean,
    disabled: Boolean,
  },
  computed: {
    cls () {
      var cls = ['r-checkbox']

      if (this.checked){
        cls.push('r-checkbox-checked')
      }
      else {
        // if (this.indeterminate){
        //   cls.push('r-checkbox-indeterminate')
        // }
      }
      
      if (this.disabled){
        cls.push('r-checkbox-disabled')
      }

      return cls
    },
    isGroupParent () {
      return this.$parent instanceof RCheckboxGroup
    },
    realCheckedValue () {
      var checkedValue = this.checkedValue
      
      if (this.isGroupParent){
        checkedValue = this.$parent.checkedValue
      }

      return checkedValue
    },
    checked () {
      if (isArray(this.realCheckedValue)){
        return inArray(this.value, this.realCheckedValue)
      }
      else {
        return (this.value === this.realCheckedValue) || (this.realCheckedValue === true)
      }
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    },
  },
  methods: {
    _setCheckedValue () {
      var checkedValue

      if (isArray(this.realCheckedValue)){
        checkedValue = this.realCheckedValue

        if (this.checked){
          var idx = checkedValue.indexOf(this.value)
          checkedValue.splice(idx, 1)
        }
        else {
          checkedValue.push(this.value)
        }
      }
      else {
        if (this.checked){
          checkedValue = ''
        }
        else {
          checkedValue = this.value
        }
      }

      if (this.isGroupParent){
        this.$parent.$emit('input', checkedValue)
      }
      else {
        this.$emit('input', checkedValue)
      }
    },
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
          me._setCheckedValue()
          
          if (me.formItem){
            me.formItem.validate()
          }
        }
      },
        rIcon('.r-checkbox-icon', {
          p_type: this.checked ? 'android-checkbox-outline' : 'android-checkbox-outline-blank'
        }),
        span({vif: !!content}, span(...content))
      )
    )
  }
})

var RCheckboxGroup = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: [String, Number, Array],
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cls () {
      var cls = ['r-checkbox-group']

      if (this.vertical){
        cls.push('r-checkbox-group-vertical')
      }

      return cls
    },
  },
  render (h) {
    return div('.' + this.cls.join('+'), ...this.$slots.default)
  }
})

Vue.component('r-checkbox', RCheckbox)
Vue.component('r-checkbox-group', RCheckboxGroup)