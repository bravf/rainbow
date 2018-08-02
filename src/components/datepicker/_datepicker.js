import {isArray, hx, globalClick, paddingZero} from '../../common/_tools'
import instance from '../../common/_instance'
import { RFormItem } from '../form/_form'
import jsx from '../../common/_jsx'

var {div, rIcon, span, rInput} = jsx

var RDatepicker = Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '选择日期',
    },
    disabled: Boolean,
    clearable: Boolean,
    disabledDate: {
      type: Function,
      default: function (){}
    },

    // 枚举
    // a: yyyy-MM-dd
    // b: yyyy/MM/dd
    // c: yyyy年MM月dd日
    format: {
      type: String,
      default: 'a',
    },
    size: String,

    // 设置一个开始时间，用来模拟范围
    startDate: String,
  },
  watch: {
    value () {
      if (this.formItem){
        this.formItem.validate()
      }
    }
  },
  computed: {
    cls () {
      var cls = ['r-datepicker']

      if (this.clearable && !this.disabled){
        cls.push('r-datepicker-clearable')
      }

      if (this.size == 'small'){
        cls.push('r-datepicker-small')
      }

      return cls
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    },
  },
  data () {
    return {
      year: 0,
      month: 0,
      isExpand: false,
    }
  },
  methods: {
    _getValueDate () {
      var value = this.value
      
      if (value){
        if (this.format === 'c'){
          value = value.replace(/[年月]/g, '-').replace('日', '')
        }
        // safari 解析2018-03-03 12:12:12格式出错，
        value = value.replace('-', '/')
      }

      return new Date(value)
    },
    // 同步value的值给year, month
    _syncValue () {
      var date = new Date
      
      if (this.value){
        var date2 = this._getValueDate()

        if (!isNaN(date2.getDate())){
          date = date2
        }
      }
  
      this.year = date.getFullYear()
      this.month = date.getMonth()
    },
    // 得到本月第一天是周几
    _getFirstDay (year, month) {
      return (new Date(year, month, 1)).getDay()
    },
    // 得到每月多少天
    _getDayCount (year, month) {
      var dayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]

      // 检查闰月
      if (month == 1){
        var isLeapYear = ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0)

        if (isLeapYear){
          dayCount = 29
        }
      }

      return dayCount
    },
    // 处理跨年问题
    _getYearMonth (year, month) {
      if (month < 0){
        year --
        month = 11
      }
      else if (month > 11){
        year ++
        month = 0
      }

      return {year, month}
    },
    _renderDropdown () {
      var me = this

      //# 计算 cells 
      var year = this.year
      var month = this.month

      var firstDay = this._getFirstDay(year, month)
      var dayCount = this._getDayCount(year, month)

      var prevMonth = this._getYearMonth(year, month - 1)
      var prevMonthDayCount = this._getDayCount(prevMonth.year, prevMonth.month)

      var nextMonth = this._getYearMonth(year, month + 1)

      var cells = []

      // 前边补足上个月firstDay个输出
      for (var i=1; i<=firstDay; i++){
        cells.push({
          year: prevMonth.year,
          month: prevMonth.month,
          day: prevMonthDayCount-firstDay + i,
          cls: ['r-datepicker-item-gray']
        })
      }

      var valueDate = this._getValueDate()
      var todayDate = new Date

      // 输出本月
      for (var i=0; i<dayCount; i++){
        var cls = ['r-datepicker-item']

        // 如果是当前选中日期
        if ( (valueDate.getFullYear() == year) && 
            (valueDate.getMonth() == month) && 
            (valueDate.getDate() == (i + 1)) ){
          cls.push('r-datepicker-item-active')
        }

        // 如果是今天
        if ( (todayDate.getFullYear() == year) && 
          (todayDate.getMonth() == month) && 
          (todayDate.getDate() == (i + 1)) ){
        cls.push('r-datepicker-item-today')
      }

        cells.push({
          year: year,
          month: month,
          day: i + 1,
          cls: cls
        })
      }

      // 补足下个月
      for (var i=0; i<42-dayCount-firstDay; i++){
        cells.push({
          year: nextMonth.year,
          month: nextMonth.month,
          day: i + 1,
          cls: ['r-datepicker-item-gray']
        })
      }

      return (
        div('.r-datepicker-dropdown', {
          s_display: this.isExpand ? 'block' : 'none'
        },
          // head
          div('.r-datepicker-dropdown-head',
            // 年份-
            rIcon('.r-datepicker-head-prev-btn', {p_type: 'ios-rewind-outline', no_click () {me.year --}}),
            // 月份-
            rIcon('.r-datepicker-head-prev-btn', {
              p_type: 'ios-skipbackward-outline', 
              no_click () {
                var yearMonth = me._getYearMonth(me.year, --me.month)
                me.year = yearMonth.year
                me.month = yearMonth.month
              }
            }),
            // 年label
            span('.r-datepicker-head-label', this.year + '年'),
            // 月label
            span('.r-datepicker-head-label', this.month + 1 + '月'),
            // 年份+
            rIcon('.r-datepicker-head-next-btn', {p_type: 'ios-fastforward-outline', no_click () {me.year ++}}),
            // 月份+
            rIcon('.r-datepicker-head-next-btn', {
              p_type: 'ios-skipforward-outline', 
              no_click () {
                var yearMonth = me._getYearMonth(me.year, ++me.month)
                me.year = yearMonth.year
                me.month = yearMonth.month
              }
            }),
          ),

          // body
          div('.r-datepicker-dropdown-body',
            ...'日一二三四五六'.split('').map(_ => {
              return span(_)
            }),
            ...cells.map(cell => {
              var isDisabled = false
              var _date = new Date(cell.year, cell.month, cell.day, 23, 59, 59)

              if (me.disabledDate){
                isDisabled = !!me.disabledDate(_date)
              }

              if (me.startDate){
                isDisabled = +(new Date(me.startDate)) > +_date
              }

              // 如果禁用，去掉item样式
              if (isDisabled){
                var idx = cell.cls.indexOf('r-datepicker-item')
                if (idx != -1){
                  cell.cls.splice(idx, 1)
                }
              }

              return span('.' + cell.cls.join('+'), {
                'c_r-datepicker-item-disabled': isDisabled,
                o_click () {
                  if (isDisabled){
                    return
                  }
                  
                  var month = paddingZero(cell.month + 1, 2)
                  var day = paddingZero(cell.day, 2)
                  var value = ''
  
                  if (me.format == 'b'){
                    value = `${cell.year}/${month}/${day}`
                  }
                  else if (me.format == 'c'){
                    value = `${cell.year}年${month}月${day}日`
                  }
                  else {
                    value = `${cell.year}-${month}-${day}`
                  }
  
                  me.$emit('input', value)
                  me.$emit('change', value)
                  me.isExpand = false
                }
              }, cell.day)
            })
          )
        )
      )
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    return (
      div('.' + this.cls.join('+'),
        rInput({
          p_value: this.value,
          p_icon: 'ios-calendar-outline',
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
              me.$emit('change', '')
              e.stopPropagation()
            }
          }
        }),
        !me.disabled ? this._renderDropdown() : null
      )
    )
  },
  mounted () {
    globalClick(this.$el, _=>{
      // 解决移动端不失去焦点，从而无法再次点击问题
      this.$el.querySelector('.r-input').blur()
      this.isExpand = false
    })
  },
})

Vue.component('r-datepicker', RDatepicker)