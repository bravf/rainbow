import {hx} from '../../common/_tools.js'

var RbRadio = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: null,
    value: null,
    label: [String, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cls () {
      var cls = ['rb-radio']

      if (this.checked){
        cls.push('rb-radio-checked')
      }
      
      if (this.disabled){
        cls.push('rb-radio-disabled')
      }

      return cls
    },
    isGroupParent () {
      return this.$parent instanceof RbRadioGroup
    },
    checked () {
      if (this.isGroupParent){
        return this.$parent.checkedValue === this.value
      }
      else {
        return this.checkedValue === this.value
      }
    },
  },
  render (h) {
    var me = this

    var $radio = hx(`label.${this.cls.join('+')}`, {
      on: {
        click () {
          if (me.isGroupParent){
            me.$parent.$emit('input', me.value)
          }
          else {
            me.$emit('input', me.value)
          }
        }
      }
    })

    $radio.push(
      hx('rb-icon', {
        props: {
          type: this.checked ? 
            'ios-circle-filled' :
            'ios-circle-outline'
        },
      })
    )
    .push(
      hx('span', {}, [this.$slots.default || this.label])
    )

    return $radio.resolve(h)
  }
})

var RbRadioGroup = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: null,
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cls () {
      var cls = ['rb-radio-group']

      if (this.vertical){
        cls.push('rb-radio-group-vertical')
      }

      return cls
    },
  },
  render (h) {
    var children = this.$slots.default

    return hx(`div.${this.cls.join('+')}`, {}, [children]).resolve(h)
  }
})

Vue.component('rb-radio', RbRadio)
Vue.component('rb-radio-group', RbRadioGroup)