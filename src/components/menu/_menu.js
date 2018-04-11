import {hx, globalClick} from '../../common/_tools'
import instance from '../../common/_instance'
import jsx from '../../common/_jsx'

var {div, ul, li, a, rIcon} = jsx

var RMenu = Vue.extend({
  props: {
    // 枚举值：vertical(垂直), horizontal(水平)
    mode: {
      type: String,
      default: 'vertical'
    },
    value: [String, Number],
    expand: Boolean,
  },
  data () {
    return {
      
    }
  },
  computed: {
    cls () {
      var cls = ['r-menu']

      cls.push('r-menu-' + this.mode)
      return cls
    },
  },
  methods: {
  },
  render (h) {
    jsx.h = h
    var me = this

    return ul('.' + this.cls.join('+'), ...this.$slots.default)
  },
})

var RMenuItem = Vue.extend({
  props: {
    name: [String, Number],
    href: String,
    target: String,
  },
  computed: {
    menu () {
      return instance.getParent(this, RMenu)
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    return li('.r-menu-item', {
      'c_r-menu-item-active': this.name === this.menu.value,
      o_click () {
        me.menu.$emit('input', me.name)
      }
    },
      a({
        a_href: this.href,
        a_target: this.target
      }, ...this.$slots.default)
    )
  }
})

var RSubMenu = Vue.extend({
  props: {
    name: [String, Number]
  },
  data () {
    return {
      isExpand: null,
      menuValue: ''
    }
  },
  created () {
    this.isExpand = this.menu.expand
  },
  computed: {
    menu () {
      return instance.getParent(this, RMenu)
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    var isActive = this.menu.value.indexOf(this.name) === 0

    // 如果是垂直模式
    if (this.menu.mode === 'vertical'){
      // 如果被选中
      if (isActive){
        // 如果记录的menu value和当前menu value不同，则强制展开，并同步value
        if (this.menuValue !== this.menu.value){
          this.isExpand = true
        }
      }
      this.menuValue = this.menu.value
    }

    return li('.r-sub-menu', {
      // 如果是水平模式，则增加样式
      'c_r-menu-item-active': (this.menu.mode === 'horizontal') && isActive
    },
      // title
      div('.r-sub-menu-title', {
        ref: 'title',
        o_click () {
          if (me.isExpand !== true){
            me.isExpand = true
          }
          else {
            me.isExpand = false
          }
        }
      }, 
        ...this.$slots.title,
        rIcon({
          p_type: this.isExpand ? 'ios-arrow-up' : 'ios-arrow-down'
        })
      ),
      // dropdown
      div('.r-sub-menu-dropdown', {
        s_display: this.isExpand ? 'block' : 'none',
        o_click () {
          // 如果水平，则点击隐藏
          if (me.menu.mode === 'horizontal'){
            me.isExpand = false
          }
        }
      },
        ul(...this.$slots.default)
      )
    )
  },
  mounted () {
    // 如果水平，则点击隐藏
    if (this.menu.mode === 'horizontal'){
      globalClick(this.$el, _=>{
        this.isExpand = false
      })
    }
  }
})

var RMenuGroup = Vue.extend({
  props: {
    title: String
  },
  render (h) {
    jsx.h = h
    var me = this

    return li('.r-menu-group',
      div('.r-menu-group-title', this.title),
      ul(...this.$slots.default)
    )
  }
})

Vue.component('r-menu', RMenu)
Vue.component('r-menu-item', RMenuItem)
Vue.component('r-sub-menu', RSubMenu)
Vue.component('r-menu-group', RMenuGroup)
