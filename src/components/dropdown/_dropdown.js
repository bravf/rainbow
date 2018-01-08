import {hx, globalClick} from '../../common/_tools.js'

var RRropdown = Vue.extend({
  props: {
    label: String,
    size: String,
  },
  data () {
    return {
      isExpand: false
    }
  },
  computed: {
    cls () {
      var cls = ['r-dropdown']

      if (this.size === 'small'){
        cls.push('r-dropdown-small')
      }

      return cls
    },
  },
  methods: {
  },
  render (h) {
    var me = this
    var $wrapper = hx(`div.${this.cls.join('+')}`)

    var $btn = hx('a.r-dropdown-btn', {
      on: {
        click () {
          if (me.isExpand !== true){
            me.isExpand = true
          }
          else {
            me.isExpand = false
          }
        }
      }
    }, [this.label])
      .push(
        hx('r-icon', {
          props: {
            type: this.isExpand ? 'arrow-up-b' : 'arrow-down-b',
          }
        })
      )

    var $list = hx('div.r-dropdown-list', {
      style: {
        display: this.isExpand ? 'block' : 'none',
      }
    }).push(
      hx('ul', {}, [this.$slots.default])
    )

    return $wrapper
      .push($btn)
      .push($list)
      .resolve(h)
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
    var me = this

    var options = {}

    if (this.href){
      options['attrs'] = {
        href: this.href
      }

      if (this.target){
        options['attrs'].target = this.target
      }
    }

    var $wrapper = hx('li.r-dropdown-item', {
      on: {
        click () {
          me.$parent.isExpand = false
        }
      }
    }).push(
      hx('a', options, [this.$slots.default])
    )

    return $wrapper.resolve(h)
  }
})

Vue.component('r-dropdown-item', RDropdownItem)
Vue.component('r-dropdown', RRropdown)
