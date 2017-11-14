import {hx} from '../../common/_tools.js'
import instance from '../../common/_instance.js'

var RForm = Vue.extend({
  props: {
    labelWidth: {
      type: [Number, String],
      default: 80
    },
    inline: Boolean,
    model: Object,
    rules: Object,
  },
  computed: {
    cls () {
      var cls = ['r-form']

      cls.push('r-form-label-right')

      if (this.inline){
        cls.push('r-form-inline')
      }

      return cls
    }
  },
  methods: {
    _getItems () {
      var items = []
      this._getItemsLoop(this, items)

      return items
    },
    _getItemsLoop (vueEl, items) {
      if (vueEl.$children){
        vueEl.$children.forEach(child=>{
          
          if (child instanceof RFormItem){
            if (child.prop){
              items.push(child)
            }
          }

          this._getItemsLoop(child, items)
        })
      }
    },

    validate (callback) {
      var items = this._getItems()
      
      var isError = false
      var itemCount = items.length
      var doneCount = 0

      items.forEach(item=>{
        item.validate(isOk=>{
          doneCount ++

          // 如果还没结束
          if (!isError){
            // 如果校验失败
            if (!isOk){
              isError = true
              callback(false)
              return
            }

            if (doneCount == itemCount){
              callback(true)
            }
          }

        })
      })
    }
  },
  render (h) {
    var me = this
    var $wrapper = hx(`form.${this.cls.join('+')}`, {}, [this.$slots.default])
    
    return $wrapper.resolve(h)
  },
})

export var RFormItem = Vue.extend({
  props: {
    label: String,
    prop: String,
    rules: Array,
  },
  data () {
    return {
      errorMsg: ''
    }
  },
  computed: {
    form () {
      return instance.getParent(this, RForm)
    },
    labelWidth () {
      return this.form.labelWidth
    },
    inline () {
      return this.form.inline
    },
    realRules () {
      if (this.rules){
        return this.rules
      }

      if (this.form.rules){
        if (this.prop in this.form.rules){
          return this.form.rules[this.prop]
        }
      }

      return []
    }
  },
  methods: {
    validate (callback) {
      callback = callback || function (){}

      // 如果没有设置验证
      if (!this.prop){
        callback(true)
        return
      }

      var isError = false
      var ruleCount = this.realRules.length
      var doneCount = 0

      this.realRules.forEach(rule=>{
        rule.validate(this.form.model[this.prop], (isOk, msg)=>{
          doneCount ++

          // 如果还没结束
          if (!isError){
            // 如果校验失败
            if (!isOk){
              isError = true
              this.errorMsg = msg || rule.message
              callback(false)
              return
            }

            if (doneCount == ruleCount){
              this.errorMsg = ''
              callback(true)
            }
          }

        })
      })
    }
  },
  render (h) {
    var me = this
    var $wrapper = hx('div.r-form-item')

    // label
    var width = 'auto'
    if (!this.inline){
      width = this.labelWidth + 'px'
    }

    if (this.label){
      $wrapper.push(
        hx('label.r-form-item-label', {
          style: {
            width: width
          }
        }, [this.label])
      )
    }

    $wrapper.push(
      hx('div.r-form-item-content', {}, [this.$slots.default])
        .push(
          hx('div.r-form-item-error-tip', {}, [this.errorMsg])
        )
    )

    return $wrapper.resolve(h)
  }
})

Vue.component('r-form', RForm)
Vue.component('r-form-item', RFormItem)