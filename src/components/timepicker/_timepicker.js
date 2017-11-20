import {hx, paddingZero, globalClick, inArray} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { RFormItem } from '../form/_form'

var RTimepicker = Vue.extend({
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '选择时间',
    },
    disabled: Boolean,
    clearable: Boolean,

    // 枚举
    // a: HH:mm:ss
    // b: HH:mm
    // c: mm:ss
    format: {
      type: String,
      default: 'a',
    },
    size: String,

    disabledHours: Array,
    disabledMinutes: Array,
    disabledSeconds: Array,
  },
  computed: {
    cls () {
      var cls = []
      cls.push('r-timepicker')

      if (this.clearable && !this.disabled){
        cls.push('r-timepicker-clearable')
      }

      if (this.size == 'small'){
        cls.push('r-timepicker-small')
      }

      return cls
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    },
  },
  data () {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      isExpand: false,
    }
  },
  methods: {
    _syncValue () {
      var format = this.format
      var values = this.value.split(':')

      if ( (format == 'a') || (format == 'b') ){
        this.hour = values[0] || 0
        this.minute = values[1] || 0
        this.second = values[2] || 0
      }
      else if (format == 'c'){
        this.minute = values[0] || 0
        this.second = values[1] || 0
      }
    },
    _getDropdown () {
      var me = this
      var format = this.format

      var $dropdown = hx('div.r-timepicker-dropdown', {
        style: {
          display: this.isExpand ? 'block' : 'none'
        }
      })

      var items = []

      if (format == 'a' || format == 'b'){
        for (var i=0; i<24; i++){
          items.push({
            value: i,
            type: 'hour'
          })
        }
      }

      for (var i=0; i<60; i++){
        items.push({
          value: i,
          type: 'minute'
        })
      }

      if (format == 'a' || format == 'c'){
        for (var i=0; i<60; i++){
          items.push({
            value: i,
            type: 'second'
          })
        }
      }

      var currType, $col, $ul

      items.forEach(item => {
        if (item.type != currType){
          currType = item.type

          $col = hx('div.r-timepicker-col',  {
            ref: item.type
          })
          $ul = hx('ul')

          $col.push($ul)
          $dropdown.push($col)
        }

        var value = paddingZero(item.value, 2)

        // 是否选中
        var isActive = false

        if ( 
            ( (item.type == 'hour') && (this.hour === value) ) ||
            ( (item.type == 'minute') && (this.minute === value) ) ||
            ( (item.type == 'second') && (this.second === value) )
        ){
          isActive = true
        }

        // 是否禁用
        var isDisabled = false

        if (
          ( (item.type == 'hour') && inArray(item.value, this.disabledHours||[]) ) ||
          ( (item.type == 'minute') && inArray(item.value, this.disabledMinutes||[]) ) ||
          ( (item.type == 'second') && inArray(item.value, this.disabledSeconds||[]) )
        ){
          isDisabled = true
        }

        $ul.push(
          hx('li', {
            'class': {
              'r-timepicker-item': !isActive && !isDisabled,
              'r-timepicker-item-active': isActive,
              'r-timepicker-item-disabled': isDisabled,
            },
            on: {
              click () {
                if (isDisabled){
                  return
                }
                me[item.type] = value

                var format = me.format

                var hour = me.hour || '00'
                var minute = me.minute || '00'
                var second = me.second || '00'

                var modelValue
                
                if (format == 'a'){
                  modelValue = `${hour}:${minute}:${second}`
                }
                else if (format == 'b'){
                  modelValue = `${hour}:${minute}`
                }
                else if (format == 'c'){
                  modelValue = `${minute}:${second}`
                }

                me.$emit('input', modelValue)
              }
            }
          }, [value])
        )
      })

      return $dropdown
    },
    _setScrollTop (type) {
      var $dom = this.$refs[type]
      if (!$dom){
        return
      }
      setTimeout(_=>{
        $dom.scrollTop = parseInt(this[type]) * 32
      })
    }
  },
  watch: {
    hour () {
      this._setScrollTop('hour')
    },
    minute () {
      this._setScrollTop('minute')
    },
    second () {
      this._setScrollTop('second')
    },
    value () {
      if (this.formItem){
        this.formItem.validate()
      }
    }
  },
  render (h) {
    var me = this
    var $wrapper = hx(`div.${this.cls.join('+')}`)

    var inputOptions = {
      props: {
        value: this.value,
        icon: 'ios-clock-outline',
        readonly: 'readonly',
        placeholder: this.placeholder,
        disabled: this.disabled,
        size: this.size,
        shouldValidate: false,
      },
      nativeOn: {
        click () {
          if (me.disabled){
            return
          }
          if (me.isExpand === true){
            me.isExpand = false
          }
          else {
            me._syncValue()
            me.isExpand = true
          }
        }
      }
    }

    if (this.clearable && !this.disabled){
      inputOptions['on'] = {
        'click-icon' (e) {
          me.$emit('input', '')
          e.stopPropagation()
        }
      }
    }

    $wrapper.push(
      hx('r-input', inputOptions)
    )

    if (!me.disabled){
      $wrapper.push(
        this._getDropdown()
      )
    }

    return $wrapper.resolve(h)
  },
  mounted () {
    globalClick(this.$el, _=>{
      this.isExpand = false
    })
  }
})

Vue.component('r-timepicker', RTimepicker)