import {hx, globalClick} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {a, rIcon, div, ul, li} = jsx

var RRropdown = Vue.extend({
  props: {
    label: String,
    size: String,
    // left or right
    placement: {
      type: String,
      default: 'left',
    },
  },
  data () {
    return {
      isExpand: false
    }
  },
  methods: {
  },
  render (h) {
    jsx.h = h
    var me = this
    
    return (
      div('.r-dropdown', {'c_r-dropdown-small': this.size === 'small'},
        // btn
        a('.r-dropdown-btn', {
          o_click () {
            if (me.isExpand !== true){
              me.isExpand = true
            }
            else {
              me.isExpand = false
            }
          }
        },
          this.label,
          rIcon({p_type: this.isExpand ? 'arrow-up-b' : 'arrow-down-b'})
        ),
        // list
        div(`.r-dropdown-list + r-dropdown-list-${this.placement}`, {s_display: this.isExpand ? 'block' : 'none'},
          ul(...this.$slots.default)
        )
      )
    )
  },
  mounted () {
    globalClick(this.$el, _=>{
      this.isExpand = false
    })
  }
})

var RDropdownItem = Vue.extend({
  props: {
    href: String,
    target: String,
  },
  render (h) {
    jsx.h = h
    var me = this

    return (
      li('.r-dropdown-item', {
        o_click () {
          me.$parent.isExpand = false
        }
      },
        a({
          a_href: this.href,
          a_target: this.target ? this.target : null
        }, ...this.$slots.default)
      )
    )
  }
})

Vue.component('r-dropdown-item', RDropdownItem)
Vue.component('r-dropdown', RRropdown)
