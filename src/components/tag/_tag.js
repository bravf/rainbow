import {hx} from '../../common/_tools.js'

var RTag = Vue.extend({
  props: {
    closeable: Boolean,
    // 枚举，可选值
    // primary、success、info、warning、danger
    type: {
      type: String,
      default: 'info',
    },
    name: [String, Number],
    size: String,
    disabled: Boolean,
  },
  computed: {
    cls () {
      var cls = []
      cls.push('r-tag')

      cls.push('r-tag-' + this.type)

      if (this.size === 'small'){
        cls.push('r-tag-small')
      }

      if (this.disabled){
        cls.push('r-tag-disabled')
      }

      return cls
    },
  },
  render (h) {
    var me = this

    var $tag = hx(`div.${this.cls.join('+')}`)
    
    $tag.push(
      hx('span.r-tag-text', {}, [this.$slots.default])
    )

    if (this.closeable){
      $tag.push(
        hx('r-icon', {
          props: {
            type: 'ios-close-empty',
          },
          nativeOn : {
            click (e) {
              if (me.disabled){
                return
              }
              me.$emit('close', e, me.name)
            }
          },
        })
      )
    }
    
    return $tag.resolve(h)
  }
})

Vue.component('r-tag', RTag)