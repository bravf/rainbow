import {hx} from '../../common/_tools.js'

var RTag = Vue.extend({
  props: {
    closeable: Boolean,
    color: String,
    name: [String, Number],
  },
  computed: {
    cls () {
      var cls = []
      cls.push(`r-tag`)

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