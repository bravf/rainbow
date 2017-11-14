import {hx} from '../../common/_tools.js'

var RRow = Vue.extend({
  props: {
    gutter: Number,
    alignItems: String,
    justifyContent: String,
  },
  computed: {
    style (){
      var style = {}
      if (this.alignItems) {
        style.alignItems = this.alignItems
      }

      if (this.justifyContent) {
        style.justifyContent = this.justifyContent
      }

      const gutter = this.gutter
      if (gutter > 0) {
        gutter = gutter / 2
        style.marginLeft = style.marginRight = `-${gutter}px`
      }

      return style
    }
  },
  render (h) {
    return hx('div.r-row + r-row-flex', {
      style: this.style
    }, [this.$slots.default]).resolve(h)
  }
})

var RCol = Vue.extend({
  props: {
    span: Number,
    offset: Number,
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
        const gutter = this.$parent.gutter
        if (gutter > 0) {
          gutter = gutter / 2
          style.paddingLeft = style.paddingRight = `${gutter}px`
        }
      }
      return style
    }
  },
  render (h) {
    return hx(`div.r-col + ${this.cls.join('+')}`, {
      style: this.style,
    }, [this.$slots.default]).resolve(h)
  }
})

Vue.component('r-row', RRow)
Vue.component('r-col', RCol)