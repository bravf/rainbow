import {hx, isObject, isArray, deepClone} from '../../common/_tools.js'
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
  data () {
    return {
      oldModel: {}
    }
  },
  created () {
    this.oldModel = deepClone(this.model)
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
    },

    _resetObject (obj, oldObj) {
      for (var prop in obj){
        var val = obj[prop]
        var oldVal = oldObj[prop]

        if (isObject(val)){
          this._resetObject(val, oldVal)
        }
        else {
          obj[prop] = deepClone(oldVal)
        }
      }
    },

    resetValidate () {
      this._getItems().forEach(item=>{
        item.errorMsg = ''
      })
    },

    resetModel () {
      this._resetObject(this.model, this.oldModel)
    },

    reset () {
      this.resetModel()
      this.$nextTick(_=>{
        this.resetValidate()
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
    required: Boolean,
  },
  data () {
    return {
      errorMsg: ''
    }
  },
  computed: {
    cls () {
      var cls = ['r-form-item']

      if (this.required){
        cls.push('r-form-item-required')
      }

      return cls
    },
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
        var value = instance.getPropByPath(this.form.model, this.prop).get()

        if (rule.loadingMsg){
          this.errorMsg = rule.loadingMsg
        }

        rule.validate(value, (isOk, msg)=>{
          doneCount ++

          // 如果还没结束
          if (!isError){
            // 如果校验失败
            if (!isOk){
              isError = true
              this.errorMsg = msg || rule.msg
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
    var $wrapper = hx(`div.${this.cls.join('+')}`)

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