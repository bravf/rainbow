import {isArray, inArray, hx} from '../../common/_tools.js'

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
      label: [],
    }
  },
  computed: {
    cls () {
      var cls = ['r-select']

      if (this.clearable){
        cls.push('r-select-clearable')
      }

      return cls
    },
    hasValue () {
      if (isArray(this.value)){
        return this.value.length > 0
      }
      else {
        return this.value !== undefined
      }
    },
  },
  render (h) {
    var me = this

    var $select = hx(`div.${this.cls.join('+')}`)
    
    //- 选择框区域
    var $selection = hx('div.r-select-selection')

    // 输入框
    var $inputParams = {
      attrs: {
        placeholder: this.placeholder,
        value: this.label,
      }
    }
    if (!this.clearable){
      $inputParams.attrs['readonly'] = 'readonly'
    }
    $selection.push(
      hx('input', $inputParams)
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
            click () {
              if (isArray(this.value)){
                me.$emit('input', [])
                me.label = []
              }
              else {
                me.$emit('input', '')
                me.label = ''
              }
            }
          },
        })
      )
    }

    //- 列表区域
    var $dropdown = hx('div.r-select-dropdown')
    var $dropdownList = hx('ul.r-select-dropdown-list')

    var $children = this.$slots.default
    if ($children){
      $dropdownList.push($children)
    }
    else {
      $dropdownList.push(hx('li', {}, [this.notFoundText]))
    }

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
  },
  computed: {
    cls () {
      var cls = ['r-select-option']
      var $parent = this.$parent

      if (isArray($parent.value)){

      }
      else {
        if ($parent.value === this.value){
          cls.push('r-select-option-selected')
        }
      }

      return cls
    },
  },
  methods: {
    _setSelectValue () {
      if (isArray(this.$parent.value)){
        
      }
      else {
        this.$parent.$emit('input', this.value)
      }
    },
    _setSelectLabel () {
      if (isArray(this.$parent.value)){

      }
      else {
        this.$parent.label = this.label
      }
    }
  },
  created () {
    if (isArray(this.$parent.value)){
      
    }
    else {
      if (this.value === this.$parent.value){
        this._setSelectLabel()
      }
    }
  },
  render (h) {
    var me = this

    return hx(`li.${this.cls.join('+')}`, {
      on: {
        click () {
          me._setSelectValue()
          me._setSelectLabel()
        }
      },
    }, [this.label]).resolve(h)
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