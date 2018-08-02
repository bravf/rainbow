import {paddingZero, globalClick, inArray} from '../../common/_tools'
import instance from '../../common/_instance'
import { RFormItem } from '../form/_form'
import jsx from '../../common/_jsx'

var {div, span, ul, li, rInput} = jsx

function getNumArr(num){
  var arr = []
  for (var i=0; i<num; i++){
    arr.push(i)
  }
  return arr
}

var RTimepicker = Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
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
    _getVal () {
      var me = this
      var format = this.format
      var hour = me.hour || '00'
      var minute = me.minute || '00'
      var second = me.second || '00'

      var modelValue
      
      if (format === 'a'){
        modelValue = `${hour}:${minute}:${second}`
      }
      else if (format === 'b'){
        modelValue = `${hour}:${minute}`
      }
      else if (format === 'c'){
        modelValue = `${minute}:${second}`
      }

      return modelValue
    },
    _renderDropdown () {
      var me = this
      var format = this.format

      var hasHour = format === 'a' || format === 'b'
      var hasSecond = format === 'a' || format === 'c'


      return div('.r-timepicker-dropdown', {
        s_display: this.isExpand ? 'block' : 'none',
        s_width: ((format === 'a') ? 3 : 2) * 52 + 'px',
      },
        // head
        div('.r-timepicker-titles', 
          span({vif: hasHour}, '时'),
          span('分'),
          span({vif: hasSecond}, '秒')
        ),
        // body hour
        div('.r-timepicker-col', {vif: hasHour, ref: 'hour'},
          ul(
            ...getNumArr(24).map(n => {
              var value = paddingZero(n, 2)
              // 是否选中
              var isActive = this.hour === value
              // 是否禁用
              var isDisabled = inArray(n, this.disabledHours)

              return li({
                'c_r-timepicker-item': !isActive && !isDisabled,
                'c_r-timepicker-item-active': isActive,
                'c_r-timepicker-item-disabled': isDisabled,
                o_click () {
                  if (isDisabled){
                    return
                  }

                  me.hour = value
                  me.$emit('input', me._getVal())
                }
              }, value)
            })
          )
        ),

        // body minute
        div('.r-timepicker-col', {ref: 'minute'},
          ul(
            ...getNumArr(60).map(n => {
              var value = paddingZero(n, 2)
              // 是否选中
              var isActive = this.minute === value
              // 是否禁用
              var isDisabled = inArray(n, this.disabledMinutes)

              return li({
                'c_r-timepicker-item': !isActive && !isDisabled,
                'c_r-timepicker-item-active': isActive,
                'c_r-timepicker-item-disabled': isDisabled,
                o_click () {
                  if (isDisabled){
                    return
                  }

                  me.minute = value
                  me.$emit('input', me._getVal())
                }
              }, value)
            })
          )
        ),

        // body second
        div('.r-timepicker-col', {vif: hasSecond, ref: 'second'},
          ul(
            ...getNumArr(60).map(n => {
              var value = paddingZero(n, 2)
              // 是否选中
              var isActive = this.second === value
              // 是否禁用
              var isDisabled = inArray(n, this.disabledSeconds)

              return li({
                'c_r-timepicker-item': !isActive && !isDisabled,
                'c_r-timepicker-item-active': isActive,
                'c_r-timepicker-item-disabled': isDisabled,
                o_click () {
                  if (isDisabled){
                    return
                  }

                  me.second = value
                  me.$emit('input', me._getVal())
                }
              }, value)
            })
          )
        )
      )
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
    jsx.h = h
    var me = this
    
    return div('.' + this.cls.join('+'),
      rInput({
        p_value: this.value,
        p_icon: 'ios-clock-outline',
        p_readonly: 'readonly',
        p_placeholder: this.placeholder,
        p_disabled: this.disabled,
        p_size: this.size,
        p_shouldValidate: false,
        no_click () {
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
        },
        'o_click-icon' (e) {
          if (me.clearable && !me.disabled){
            me.$emit('input', '')
            e.stopPropagation()
          }
        }
      }),
      !me.disabled ? this._renderDropdown() : null
    )
  },
  mounted () {
    globalClick(this.$el, _=>{
      // 解决移动端不失去焦点，从而无法再次点击问题
      this.$el.querySelector('.r-input').blur()
      this.isExpand = false
    })
  }
})

Vue.component('r-timepicker', RTimepicker)