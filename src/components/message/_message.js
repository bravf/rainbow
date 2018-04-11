import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, span, rIcon} = jsx

var RMessage = Vue.extend({
  props: {
  },
  data () {
    return {
      // 枚举，info, success, warning, error
      type: 'info',
      msg: '',
      isShow: false,
      timer: null,
      duration: 3000,
    }
  },
  computed: {
    cls () {
      var cls = ['r-message']
      cls.push('r-message-global')

      cls.push('r-message-' + this.type)

      return cls
    },
  },
  methods: {
    show (msg, type) {
      clearTimeout(this.timer)
      
      this.msg = msg
      this.type = type || 'info'
      this.isShow = true

      this.hide()
    },
    hide () {
      this.timer = setTimeout(_=>{
        this.isShow = false
      }, this.duration)
    }
  },
  render (h) {
    jsx.h = h
    var me = this

    var iconList = {
      info: 'information-circled',
      success: 'checkmark-circled',
      warning: 'android-alert',
      error: 'close-circled',
    }

    return div('.' + this.cls.join('+'), {
      s_display: this.isShow ? 'block' : 'none',
      o_mouseenter () {
        clearTimeout(me.timer)
      },
      o_mouseleave () {
        me.hide()
      }
    },
      rIcon({
        p_type: iconList[this.type]
      }),
      span(this.msg)
    )
  }
})

var getMessage = function (){
  var message = null

  return function (){
    if (message){
      return message
    }

    message = new RMessage

    message.$mount(document.createElement('div'))
    document.body.appendChild(message.$el)

    return message
  }
}()

Vue.mixin({
  methods: {
    $message (msg, type) {
      var message = getMessage()
      message.show(msg, type)
    }
  }
})

