import {isArray, hx, globalClick, paddingZero} from '../../common/_tools.js'

var RDatepicker = Vue.extend({
  props: {
    value: String,
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
    format: {
      type: String,
      default: 'a',
    },
    size: String,
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
    }
  },
  data () {
    return {
      year: 0,
      month: 0,
      isExpand: false,
    }
  },
  methods: {
    // 同步value的值给year, month
    _syncValue () {
      var date = new Date
      
      if (this.value){
        var date2 = new Date(this.value)

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
    _getDropdown () {
      var me = this
      var $dropdown = hx('div.r-datepicker-dropdown', {
        style: {
          display: this.isExpand ? 'block' : 'none'
        }
      })

      var $head = hx('div.r-datepicker-dropdown-head')
        .push(
          // 年份-
          hx('r-icon.r-datepicker-head-prev-btn', {
            props: {
              type: 'ios-rewind-outline'
            },
            nativeOn: {
              click () {
                me.year --
              }
            }
          })
        )
        .push(
          // 月份-
          hx('r-icon.r-datepicker-head-prev-btn', {
            props: {
              type: 'ios-skipbackward-outline'
            },
            nativeOn: {
              click () {
                var yearMonth = me._getYearMonth(me.year, --me.month)
                me.year = yearMonth.year
                me.month = yearMonth.month
              }
            }
          })
        )
        .push(
          // 年label
          hx('span.r-datepicker-head-label', {}, [this.year + '年'])
        )
        .push(
          // 月label
          hx('span.r-datepicker-head-label', {}, [this.month + 1 + '月'])
        )
        .push(
          // 年份+
          hx('r-icon.r-datepicker-head-next-btn', {
            props: {
              type: 'ios-fastforward-outline'
            },
            nativeOn: {
              click () {
                me.year ++
              }
            }
          })
        )
        .push(
          // 月份+
          hx('r-icon.r-datepicker-head-next-btn', {
            props: {
              type: 'ios-skipforward-outline'
            },
            nativeOn: {
              click () {
                var yearMonth = me._getYearMonth(me.year, ++me.month)
                me.year = yearMonth.year
                me.month = yearMonth.month
              }
            }
          })
        )

      var $body = hx('div.r-datepicker-dropdown-body')

      '日一二三四五六'.split('').forEach(_=>{
        $body.push(
          hx('span', {}, [_])
        )
      })

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

      var valueDate = new Date(this.value)
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

      cells.forEach(cell=>{
        var isDisabled = false

        if (me.disabledDate){
          isDisabled = !!me.disabledDate(new Date(cell.year, cell.month, cell.day, 23, 59, 59))
        }

        // 如果禁用，去掉item样式
        if (isDisabled){
          var idx = cell.cls.indexOf('r-datepicker-item')
          if (idx != -1){
            cell.cls.splice(idx, 1)
          }
        }

        $body.push(
          hx(`span.${cell.cls.join('+')}`, {
            'class': {
              'r-datepicker-item-disabled': isDisabled
            },
            on: {
              click () {
                var month = paddingZero(cell.month + 1, 2)
                var day = paddingZero(cell.day, 2)
                var value = ''

                if (me.format == 'b'){
                  value = `${cell.year}/${month}/${day}`
                }
                else {
                  value = `${cell.year}-${month}-${day}`
                }

                me.$emit('input', value)
                me.isExpand = false
              }
            }
          }, [cell.day])
        )
      })

      return $dropdown.push($head).push($body)
    }
  },
  render (h) {
    console.log('datepicker render')
    var me = this
    var $wrapper = hx(`div.${this.cls.join('+')}`)

    var inputOptions = {
      props: {
        value: this.value,
        icon: 'ios-calendar-outline',
        readonly: 'readonly',
        placeholder: this.placeholder,
        disabled: this.disabled,
        size: this.size,
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
      },
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
  },
})

Vue.component('r-datepicker', RDatepicker)