import {hx, globalClick} from '../../common/_tools.js'
import instance from '../../common/_instance.js'

var RMenu = Vue.extend({
  props: {
    // 枚举值：vertical(垂直), horizontal(水平)
    mode: {
      type: String,
      default: 'vertical'
    },
    value: [String, Number],
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
    var me = this
    var $wrapper = hx(`ul.${this.cls.join('+')}`, {}, [this.$slots.default])

    return $wrapper
      .resolve(h)
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
    var me = this
    var $wrapper = hx('li.r-menu-item', {
      'class': {
        'r-menu-item-active': this.name === this.menu.value
      },
      on: {
        click () {
          me.menu.$emit('input', me.name)
        }
      }
    }).push(
      hx('a', {
        attrs: {
          href: this.href,
          target: this.target
        }
      }, [this.$slots.default])
    )

    return $wrapper.resolve(h)
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
  computed: {
    menu () {
      return instance.getParent(this, RMenu)
    }
  },
  render (h) {
    var me = this

    var isActive = this.menu.value.indexOf(this.name) === 0

    var $wrapper = hx('li.r-sub-menu', {
      // 如果是水平模式，则增加样式
      'class': {
        'r-menu-item-active': (this.menu.mode === 'horizontal') && isActive
      }
    })

    // 如果是垂直模式
    if (this.menu.mode === 'vertical'){
      // 如果被选中
      if (isActive){
        // 如果记录的menu value和当前menu value不同，则强制展开，并同步value
        if (this.menuValue !== this.menu.value){
          this.menuValue = this.menu.value
          this.isExpand = true
        }
      }
    }

    var $title = hx('div.r-sub-menu-title', {
      on: {
        click () {
          if (me.isExpand !== true){
            me.isExpand = true
          }
          else {
            me.isExpand = false
          }
        }
      },
      ref: 'title'
    }, [this.$slots.title])

    $title.push(
      hx('r-icon', {
        props: {
          type: this.isExpand ? 'ios-arrow-up' : 'ios-arrow-down'
        }
      })
    )

    var $dropdown = hx('div.r-sub-menu-dropdown', {
      style: {
        display: this.isExpand ? 'block' : 'none'
      },
      on: {
        click () {
          // 如果水平，则点击隐藏
          if (me.menu.mode === 'horizontal'){
            me.isExpand = false
          }
        }
      }
    })
      .push(
        hx('ul', {}, [this.$slots.default])
      )

    return $wrapper
      .push($title)
      .push($dropdown)
      .resolve(h)
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
    var me = this
    var $wrapper = hx('li.r-menu-group')
      .push(
        hx('div.r-menu-group-title', {}, [this.title])
      )
      .push(
        hx('ul', {}, [this.$slots.default])
      )

    return $wrapper.resolve(h)
  }
})

Vue.component('r-menu', RMenu)
Vue.component('r-menu-item', RMenuItem)
Vue.component('r-sub-menu', RSubMenu)
Vue.component('r-menu-group', RMenuGroup)
