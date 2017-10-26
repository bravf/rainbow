import {isArray, inArray, hx, globalClick, getTextWidth} from '../../common/_tools.js'

var RSelect = Vue.extend({
  props: {
    value: [String, Number, Array],
    multiple: Boolean,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    size: String,
    placeholder: {
      type: String,
      default: '请选择',
    },
    notFoundText: {
      type: String,
      default: '无匹配数据', 
    },
  },
  data () {
    return {
      isExpand: false,
      word: null,
    }
  },
  computed: {
    cls () {
      var cls = ['r-select']

      if (this.clearable){
        cls.push('r-select-clearable')
      }

      if (this.isMultiple){
        cls.push('r-select-multiple')
      }

      return cls
    },
    isMultiple () {
      return isArray(this.value)
    },
    hasValue () {
      if (this.isMultiple){
        return this.value.length > 0
      }
      else {
        return this.value !== undefined
      }
    },
  },
  methods: {
    _removeValue (_value) {
      var value = [...this.value]
      var idx = value.indexOf(_value)
      value.splice(idx, 1)

      this.$emit('input', value)
    },
    _getWordWidth () {
      if (!this.$el){
        return 50
      }

      var $$input = this.$refs.input
      var style = window.getComputedStyle($$input)
      var width = getTextWidth(this.word, `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`)

      return Math.min(width + 10, this.$el.getBoundingClientRect().width - 40)
    },
    _getLabelValue () {
      var labelValue = []
      
      this.$slots.default.forEach($slot=>{
        var componentOptions = $slot.componentOptions

        if (componentOptions && (componentOptions.tag === 'r-select-option')){
          var value = componentOptions.propsData.value
          var label = componentOptions.propsData.label
          labelValue.push({label, value})
          
        }
      })

      return labelValue
    },
    _isSelected (value) {
      if (this.isMultiple){
        return inArray(value, this.value)
      }
      else {
        return this.value === value
      }
    },
    _optionClick (_value, _label) {
      var data = {
        label: _label,
        value: _value,
      }

      if (this.isMultiple){
        var value = [...this.value]

        if (inArray(_value, this.value)){
          var idx = value.indexOf(_value)

          value.splice(idx, 1)
          this.$emit('input', value)
        }
        else {
          value.push(_value)
          this.$emit('input', value)
        }
      }
      else {
        this.$emit('input', _value)
      }

      this.word = null
      if (this.isMultiple && this.filterable){
        this.$refs.input.focus()
      }
      else {
        this.isExpand = false
      }
    },
    _getSelected (labelValue) {
      var value = this.value
      if (!isArray(value)){
        value = [value]
      }

      var selected = []
      labelValue.forEach(lv=>{
        if (inArray(lv.value, value)){
          selected.push({
            value: lv.value,
            label: lv.label,
          })
        }
      })
      return selected
    },
    _getFilter (labelValue) {
      if (this.word === null){
        return labelValue
      }

      var filter = []
      labelValue.forEach(lv=>{
        if (lv.label.indexOf(this.word) != -1){
          filter.push({
            label: lv.label,
            value: lv.value,
          })
        }
      })
      return filter
    },
  },
  mounted () {
    globalClick(this.$el, _=>{
      this.isExpand = false
      this.word = null
    })
  },
  render (h) {console.log('select render')
    var me = this
    var labelValue = this._getLabelValue()
    var $select = hx(`div.${this.cls.join('+')}`)
    
    //- 选择框区域
    var $selection = hx('div.r-select-selection', {
      on: {
        click () {
          if (me.isMultiple){
            me.isExpand = true
          }
          else {
            me.isExpand = !me.isExpand
          }

          if (me.filterable){
            me.$refs.input.focus()
          }
        }
      }
    })

    var selectedLabelValue = this._getSelected(labelValue)
    // 多选tags
    if (this.isMultiple){
      var $tags = selectedLabelValue.map(s=>{
        return hx('r-tag', {
          props: {
            closeable: true,
            name: s.value,
          },
          on: {
            close (e, name) {
              me._removeValue(name)
              e.stopPropagation()
            }
          },
        }, [s.label])
      })

      $selection.push($tags)
    }

    // 输入框
    var inputParams = {
      style: {},
      domProps: {},
      attrs: {
        type: 'text',
      },
      on: {
        input (e) {
          me.word = e.target.value
        }
      },
      ref: 'input',
    }

    if (this.isMultiple){
      var width =  this._getWordWidth() + 'px'

      if (!this.hasValue){
        inputParams.attrs['placeholder'] = this.placeholder
        width = '100%'
      }

      inputParams.style['width'] = width
      inputParams.domProps.value = me.word || ''
    }
    else {
      inputParams.style.width = '100%'
      inputParams.attrs['placeholder'] = this.placeholder

      var inputValue = ''
      if (me.word !== null){
        inputValue = me.word
      }
      else {
        if (selectedLabelValue[0]){
          inputValue = selectedLabelValue[0].label
        }
      }

      inputParams.domProps.value = inputValue
    }

    if (!this.filterable){
      inputParams.attrs['readonly'] = 'readonly'
    }
    $selection.push(
      hx('div.r-select-input-wrapper').push(
        hx('input', inputParams)
      )
    )

    // 箭头
    var arrowIcon
    if (this.isExpand){
      arrowIcon = 'arrow-up-b'
    }
    else {
      arrowIcon = 'arrow-down-b'
    }
    $selection.push(
      hx('r-icon', {
        props: {
          type: arrowIcon,
        },
      })
    )

    // clearable
    if (this.clearable){
      $selection.push(
        hx('r-icon', {
          props: {
            type: 'ios-close',
          },
          nativeOn: {
            click (e) {
              if (me.isMultiple){
                me.$emit('input', [])
              }
              else {
                me.$emit('input', '')
              }
              me.selected = []

              me.isExpand = false
              e.stopPropagation()
            }
          },
        })
      )
    }

    //- 列表区域
    var filterLabelValue = this._getFilter(labelValue)
    var dropdownWidth = 10

    if (me.$el){
      dropdownWidth = me.$el.getBoundingClientRect().width
    }
    var $dropdown = hx('div.r-select-dropdown', {
      style: {
        width: dropdownWidth + 'px',
        display: this.isExpand ? 'block' : 'none'
      }
    })
    var $dropdownList = hx('ul.r-select-dropdown-list')

    // 无匹配
    var $notFound = hx('li', {
      style: {
        display: filterLabelValue.length === 0 ? 'block' : 'none',
      },
    }, [this.notFoundText])

    $dropdownList.push($notFound)

    // options
    var $options = filterLabelValue.map(lv => {
      var params = {
        props: {
          label: lv.label,
          value: lv.value,
          selected: this._isSelected(lv.value),
        },
        nativeOn: {
          click () {
            me._optionClick(lv.value, lv.label)
          }
        },
      }
      return hx('r-select-option', params)
    })

    $dropdownList.push($options)
    $dropdown.push($dropdownList)

    return $select
      .push($selection)
      .push($dropdown)
      .resolve(h)
  }
})

var RSelectOption = Vue.extend({
  props: {
    value: [String, Number],
    label: String,
    disabled: Boolean,
    selected: Boolean,
  },
  computed: {
    cls () {
      var cls = ['r-select-option']
      var $parent = this.$parent

      if (this.selected){
        cls.push('r-select-option-selected')
      }

      return cls
    },
  },
  render (h) {
    var me = this

    return hx(`li.${this.cls.join('+')}`, {}, [this.label]).resolve(h)
  }
})

var RSelectOptionGroup = Vue.extend({
  props: {
    label: String,
  },
  computed: {
    cls () {
      var cls = ['r-select-option-group']
      return cls
    },
  },
  render (h) {
    var me = this
  }
})

Vue.component('r-select', RSelect)
Vue.component('r-select-option', RSelectOption)
Vue.component('r-select-option-group', RSelectOptionGroup)