import {hx} from '../../common/_tools.js'

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
  },
  render (h) {
    var me = this

    var $radio = hx(`label.${this.cls.join('+')}`, {
      on: {
        click () {
          if (me.disabled){
            return
          }
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
      hx('r-icon.r-radio-icon', {
        props: {
          type: this.checked ? 
            'android-radio-button-on' :
            'android-radio-button-off'
        },
      })
    )

    var label = this.$slots.default || this.label

    if (label){
      $radio.push(
        hx('span', {}, [label])
      )
    }

    return $radio.resolve(h)
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
    var children = this.$slots.default

    return hx(`div.${this.cls.join('+')}`, {}, [children]).resolve(h)
  }
})

Vue.component('r-radio', RRadio)
Vue.component('r-radio-group', RRadioGroup)