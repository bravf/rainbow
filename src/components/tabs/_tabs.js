import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, rIcon} = jsx

var RTabs = Vue.extend({
  props: {
    value: [String, Number],
  },
  data () {
    return {
      paneConfs: []
    }
  },
  methods: {
    _getPaneConfs () {
      var confs = []

      if (!this.$slots.default){
        return
      }

      var propList = ['name', 'label', 'icon', 'disabled']

      this.$slots.default.forEach(slot=>{
        var options = slot.componentOptions
        var instance = slot.componentInstance

        if (!options || (options.tag != 'r-tab-pane') ){
          return
        }

        var conf = {
          slot: instance.$slots.default
        }

        propList.forEach(prop=>{
          conf[prop] = instance[prop]
        })

        confs.push(conf)
      })

      this.paneConfs = confs
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    // 当前选中索引
    var activeIdx = 0
    this.paneConfs.some( (conf, idx) =>{
      if (conf.name === this.value){
        activeIdx = idx
        return true
      }
      else {
        return false
      }
    })

    return (
      div('.r-tabs',
        ...this.$slots.default,
        // tabs-head
        div('.r-tabs-head',
          ...this.paneConfs.map( (conf, idx) => {
            return div('.r-tabs-tab', {
              'c_r-tabs-tab-active': activeIdx === idx,
              o_click () {
                me.$emit('input', conf.name) 
              }
            },
              conf.icon ? rIcon({p_type: conf.icon}) : null,
              conf.label
            )
          })
        ),
        // tabs-body
        ...this.paneConfs.map( (conf, idx) => {
          return div('.r-tabs-pane', {
            s_display: activeIdx === idx ? 'block' : 'none'
          }, ...conf.slot)
        })
      )
    )
  }
})

var RTabPane = Vue.extend({
  props: {
    name: [String, Number],
    label: String,
    icon: String,
    disabled: String,
  },
  mounted () {
    this.$parent._getPaneConfs()
  },
  beforeDestroy () {
    this.$parent._getPaneConfs()
  },
  updated () {
    this.$parent._getPaneConfs()
  },
  render () {
  }
})

Vue.component('r-tab-pane', RTabPane)
Vue.component('r-tabs', RTabs)