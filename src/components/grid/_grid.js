import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div} = jsx

var RRow = Vue.extend({
  props: {
    gutter: [Number, String],
    alignItems: String,
    justifyContent: String,
  },
  computed: {
    style (){
      var style = {}
      if (this.alignItems) {
        style.s_alignItems = this.alignItems
      }

      if (this.justifyContent) {
        style.s_justifyContent = this.justifyContent
      }

      return style
    }
  },
  render (h) {
    jsx.h = h
    return (
      div('.r-row + r-row-flex', Object.assign({}, this.style), ...this.$slots.default)
    )
  }
})

var RCol = Vue.extend({
  props: {
    span: [Number, String],
    offset: [Number, String],
  },
  computed: {
    cls () {
      var cls = []
      if (!isNaN(this.span) && this.span > 0 && this.span <= 24) {
        cls.push(`r-col-span-${this.span}`)
      }

      if (!isNaN(this.offset) && this.offset > 0 && this.offset <= 24) {
        cls.push(`r-col-offset-${this.offset}`)
      }

      return cls
    },
    style () {
      var style = {}
      if (this.$parent instanceof RRow) {
        var gutter = this.$parent.gutter
        if (gutter > 0) {
          gutter = gutter / 2
          style.s_paddingLeft = style.s_paddingRight = `${gutter}px`
        }
      }
      return style
    }
  },
  render (h) {
    jsx.h = h
    return (
      div(`.r-col + ${this.cls.join('+')}`, Object.assign({}, this.style), ...this.$slots.default)
    )
  }
})

Vue.component('r-row', RRow)
Vue.component('r-col', RCol)