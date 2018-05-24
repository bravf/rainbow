import {isArray, inArray, hx, globalClick, getTextWidth} from '../../common/_tools'
import instance from '../../common/_instance'
import {RFormItem} from '../form/_form'
import jsx from '../../common/_jsx'

var {div, rTag, rIcon, ul ,li, rSelectOption, input} = jsx

var RSelect = Vue.extend({
  props: {
    value: [String, Number, Array],
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
      labelValue: [],
      filterLabelValue: [],
      isExpand: false,
      word: null,
      focusIdx: -1,
    }
  },
  computed: {
    cls () {
      var cls = ['r-select']

      if (this.size === 'small'){
        cls.push('r-select-small')
      }

      if (this.clearable && !this.disabled){
        cls.push('r-select-clearable')
      }

      if (this.isMultiple){
        cls.push('r-select-multiple')
      }

      if (this.disabled){
        cls.push('r-select-disabled')
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
    formItem () {
      return instance.getParent(this, RFormItem)
    }
  },
  methods: {
    _emitChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    _removeValue (_value) {
      var value = [...this.value]
      var idx = value.indexOf(_value)
      value.splice(idx, 1)

      this._emitChange(value)
    },
    _getInputWidth () {
      if (!this.$el){
        return 50
      }

      var $$input = this.$refs.input
      var style = window.getComputedStyle($$input)
      var width = getTextWidth(this.word || this.placeholder, `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`)

      return Math.min(width + 10, this.$el.getBoundingClientRect().width - 40)
    },
    _getLabelValue () {
      var labelValue = []
      
      ;(this.$slots.default || []).forEach($slot=>{
        var componentOptions = $slot.componentOptions

        if (componentOptions && (componentOptions.tag === 'r-select-option')){
          var value = componentOptions.propsData.value
          var label = componentOptions.propsData.label
          var disabled = componentOptions.propsData.disabled

          if ( (disabled !== undefined) && (disabled !== false) ){
            disabled = true
          }

          labelValue.push({label, value, disabled})
        }
      })

      return labelValue
    },
    _isSelected (value) {
      if (this.isMultiple){
        return inArray(value, this.value)
      }
      else {
        return (value !== undefined) && (this.value === value)
      }
    },
    _optionClick (data) {
      if (data.disabled){
        return
      }

      var _value = data.value

      if (this.isMultiple){
        var value = [...this.value]

        if (inArray(_value, this.value)){
          var idx = value.indexOf(_value)

          value.splice(idx, 1)
          this._emitChange(value)
        }
        else {
          value.push(_value)
          this._emitChange(value)
        }
      }
      else {
        this._emitChange(_value)
      }

      this.word = null
      if (this.isMultiple){
        if (this.filterable){
          this.$refs.input.focus()
        }
      }
      else {
        this.isExpand = false
      }
    },
    _getSelected (labelValue) {
      if (this.value === undefined){
        return []
      }

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
    _setScolltop (idx) {
      var $$dropdown = this.$refs.dropdown

      // 32 item高度
      // 200 列表容器高度
      // 5 列表容器上padding
      $$dropdown.scrollTop = 32 * (idx + 1) - 200 + 5
    },
    _keydown (e) {
      var me = this
      var key = e.key
      
      if (key === 'Backspace'){
        if (me.isMultiple && (me.word === '' || me.word === null) ){
          var _value = me.value[me.value.length - 1]
          me._removeValue(_value)
        }
      }
      else if (inArray(key, ['ArrowDown', 'ArrowUp'])){
        var idx = me.focusIdx
        var minIdx = 0
        var maxIdx = me.filterLabelValue.length - 1
       
        if (key === 'ArrowDown'){
          idx ++
        }
        else if (key === 'ArrowUp'){
          idx --
        }
        idx = Math.min(maxIdx, Math.max(minIdx, idx))

        me.focusIdx = idx
        e.preventDefault()
      }
      else if (key === 'Enter'){
        var data = me.filterLabelValue[me.focusIdx]
        if (data){
          me._optionClick(data)
        }
      }
    },
  },
  watch: {
    isExpand (val) {
      if (!val){
        this.focusIdx = -1
      }
      else {
        var idx = -1
        var values = this.labelValue.map(lv=>{
          return lv.value
        })

        if (this.isMultiple){
          idx = values.indexOf(this.value[0])
        }
        else {
          idx = values.indexOf(this.value)
        }

        this.$nextTick(_=>{
          this._setScolltop(idx)
        })
      }
    },
    focusIdx (val) {
      this._setScolltop(val)
    },
    value () {
      if (this.formItem){
        this.formItem.validate()
      }
    }
  },
  mounted () {
    globalClick(this.$el, _=>{
      // 解决移动端不失去焦点，从而无法再次点击问题
      this.$refs.input.blur()
      
      this.isExpand = false
      this.word = null
    })
  },
  render (h) {
    jsx.h = h
    var me = this
    var labelValue = this.labelValue = this._getLabelValue()
    var filterLabelValue = this.filterLabelValue = this._getFilter(labelValue)
    var selectedLabelValue = this._getSelected(labelValue)
    var placeholder
    var value

    if (this.isMultiple){
      if (!selectedLabelValue.length){
        placeholder = this.placeholder
      }
      value = me.word || ''
    }
    else {
      placeholder = this.placeholder
      
      var inputValue = ''
      if (me.word !== null){
        value = me.word
      }
      else {
        if (selectedLabelValue[0]){
          value = selectedLabelValue[0].label
        }
      }
    }

    return (
      div('.' + this.cls.join('+'),
        // 选择框区域
        div('.r-select-selection', {
          // 添加tabindex，使得div可以相应键盘事件
          a_tabindex: 100,
          o_click () {
            if (me.disabled){
              return
            }
  
            if (me.isMultiple){
              me.isExpand = true
            }
            else {
              me.isExpand = !me.isExpand
            }
  
            if (me.filterable){
              me.$nextTick(_=>{
                me.$refs.input.focus()
              })
            }
          },
          o_keydown: this.filterable ? Function.prototype : this._keydown,
        },
          // 多选tags
          ...(this.isMultiple ? 
          selectedLabelValue.map(lv => {
            return rTag({
              p_closeable: true,
              p_name: lv.value,
              p_size: me.size,
              p_disabled: me.disabled,
              o_close (e, name) {
                me._removeValue(name)
                e.stopPropagation()
              }
            }, lv.label)
          })
          :
          []),
          // 输入框
          div('.r-select-input-wrapper', {
            s_width: (this.isMultiple && (selectedLabelValue.length > 0)) ? this._getInputWidth() + 'px' : '100%',
            s_display: (this.isMultiple && (selectedLabelValue.length > 0) && !this.isExpand) ? 'none' : 'inline-block',
          },
            input({
              a_type: 'text',
              a_placeholder: placeholder,
              dp_value: value,
              a_readonly: (this.disabled || !this.filterable) ? 'readonly' : null,
              o_input (e) {
                me.word = e.target.value
                me.$emit('word-change', me.word)
              },
              o_keydown : this.filterable ? this._keydown : Function.prototype,
              ref: 'input',
            })
          ),
          // 箭头
          rIcon('.r-select-arrow-icon', {
            p_type: this.isExpand ? 'arrow-up-b' : 'arrow-down-b'
          }),
          // clearable
          rIcon('.r-select-close-icon', {
            vif: this.clearable && !this.disabled,
            p_type: 'close-circled',
            no_click (e) {
              me._emitChange(me.isMultiple ? [] : '')
              me.isExpand = false
              e.stopPropagation()
            }
          })
        ),
        // 下拉区域
        div('.r-select-dropdown', {
          s_width: me.$el ? me.$el.getBoundingClientRect().width + 'px' : '10px',
          s_display: this.isExpand ? 'block' : 'none',
          ref: 'dropdown'
        },
          ul('.r-select-dropdown-list',
            // 无匹配
            filterLabelValue.length === 0 ? li(this.notFoundText) : null,
            ...filterLabelValue.map( (lv, idx) => {
              return rSelectOption({
                'c_r-select-option-selected': this._isSelected(lv.value),
                'c_r-select-option-focus': this.focusIdx === idx,
                p_label: lv.label,
                p_value: lv.value,
                p_disabled: lv.disabled,
                no_click () {
                  me._optionClick(lv)
                }
              })
            })
          )
        )
      )
    )
  }
})

var RSelectOption = Vue.extend({
  props: {
    value: [String, Number],
    label: String,
    disabled: Boolean,
  },
  computed: {
    cls () {
      var cls = ['r-select-option']

      if (this.disabled){
        cls.push('r-select-option-disabled')
      }

      return cls
    },
  },
  render (h) {
    jsx.h = h
    return li('.' + this.cls.join('+'), this.label)
  }
})

Vue.component('r-select', RSelect)
Vue.component('r-select-option', RSelectOption)