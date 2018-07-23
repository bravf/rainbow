import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, a, rIcon, rModal, rButton, p, span} = jsx

// modal的zindex从1000开始递增
var zindex = 1000

var RModal = Vue.extend({
  props: {
    value: Boolean,
    title: String,
    width: {
      type: [String, Number],
      default: 520
    },
  },
  data () {
    return {
      zindex: zindex
    }
  },
  computed: {
    cls () {
      var cls = []
      cls.push('r-modal')

      return cls
    },
  },
  watch: {
    value () {
      if (this.value){
        zindex ++
        this.zindex = zindex
      }
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    return div('.r-modal-wrapper + r-modal-mask', {
      s_display: this.value ? 'block' : 'none',
      's_z-index': this.zindex,
    },
      // modal
      div('.r-modal', {s_width: this.width + 'px'},
        // close
        a('.r-modal-close',
          rIcon({
            p_type: 'ios-close-empty',
            no_click () {
              me.$emit('input', false)
            }
          })
        ),
        // header
        div('.r-modal-header',
          div('.r-modal-header-inner', this.title)
        ),
        // body
        div('.r-modal-body', ...this.$slots.default),
        // footer
        div('.r-modal-footer', {vif: !!this.$slots.footer}, ...this.$slots.footer)
      )
    )

  },

  mounted () {
    window.addEventListener('keydown', e=>{
      if (e.key === 'Escape'){
        this.$emit('input', false)
      }
    }, false)
  }
})

Vue.component('r-modal', RModal)

// 全局注入alert
var RAlert = Vue.extend({
  data () {
    return {
      title: '',
      content: '',
      onOk: ()=>{},
      value: false
    }
  },
  methods: {
    show (content, title, onOk) {
      this.content = content
      this.title = title || document.title

      if (onOk){
        this.onOk = onOk
      }

      this.value = true
    },
    hide () {
      this.value = false
    },
    okClick () {
      this.onOk()
      this.value = false
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    return rModal({
      vmodel: [this, 'value'],
      a_title: this.title,
      a_width: 300,
      'c_r-alert-global': true
    },
      p(this.content),
      div({slot:'footer'},
        rButton({
          no_click () {
            me.okClick()
          }
        }, '确定')
      )
    )
  }
})

var getAlert = function (){
  var alert = null

  return function (){
    if (alert){
      return alert
    }

    alert = new RAlert
 
    alert.$mount(document.createElement('div'))
    document.body.appendChild(alert.$el)

    return alert
  }
}()

// 全局注入confirm
var RConfirm = Vue.extend({
  data () {
    return {
      title: '',
      content: '',
      onOk: ()=>{},
      onCancel: ()=>{},
      value: false
    }
  },
  methods: {
    show (options) {
      this.content = options.content
      this.title = options.title || document.title
      
      if (options.onOk){
        this.onOk = options.onOk
      }

      if (options.onCancel){
        this.onCancel = options.onCancel
      }

      this.value = true
    },
    hide () {
      this.value = false
    },
    okClick () {
      this.onOk()
      this.value = false
    },
    cancelClick () {
      this.onCancel()
      this.value = false
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    return rModal({
      vmodel: [this, 'value'],
      a_title: this.title,
      a_width: 300,
      'c_r-confirm-global': true
    },
      p(this.content),
      div({slot:'footer'},
        rButton({
          no_click () {
            me.cancelClick()
          }
        }, '取消'),
        span(' '),
        rButton({
          p_type: 'primary',
          no_click () {
            me.okClick()
          }
        }, '确定')
      )
    )
  }
})

var getConfirm = function (){
  var confirm = null

  return function (){
    if (confirm){
      return confirm
    }

    confirm = new RConfirm()
 
    confirm.$mount(document.createElement('div'))
    document.body.appendChild(confirm.$el)

    return confirm
  }
}()

Vue.mixin({
  methods: {
    $alert (content, title, onOk) {
      getAlert().show(content, title, onOk)
    },
    $confirm (options) {
      getConfirm().show(options || {})
    }
  }
})