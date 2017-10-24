import {hx} from '../../common/_tools.js'

var RbRow = Vue.extend({
  props: {
    gutter: Number,
    align: String,
    justify: String,
  },
  computed: {
    style (){
      var style = {}
      if (this.align) {
        style.align = this.align
      }

      if (this.justify) {
        style.justify = this.justify
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
    return hx('div.rb-row + rb-row-flex', {
      style: this.style
    }, [this.$slots.default]).resolve(h)
  }
})

var RbCol = Vue.extend({
  props: {
    span: Number,
    offset: Number,
  },
  computed: {
    cls () {
      var cls = []
      if (!isNaN(this.span) && this.span > 0 && this.span <= 24) {
        cls.push(`rb-col-span-${this.span}`)
      }

      if (!isNaN(this.offset) && this.offset > 0 && this.offset <= 24) {
        cls.push(`rb-col-offset-${this.offset}`)
      }

      return cls
    },
    style () {
      var style = {}
      if (this.$parent instanceof RbRow) {
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
    return hx(`div.rb-col + ${this.cls.join('+')}`, {
      style: this.style,
    }, [this.$slots.default]).resolve(h)
  }
})

Vue.component('rb-row', RbRow)
Vue.component('rb-col', RbCol)