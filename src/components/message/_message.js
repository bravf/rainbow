import {hx} from '../../common/_tools.js'

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
    var me = this

    var $wrapper = hx(`div.${this.cls.join('+')}`, {
      style: {
        display: this.isShow ? 'block' : 'none'
      },
      on: {
        mouseenter () {
          clearTimeout(me.timer)
        },
        mouseleave () {
          me.hide()
        }
      }
    })

    var iconList = {
      info: 'information-circled',
      success: 'checkmark-circled',
      warning: 'android-alert',
      error: 'close-circled',
    }
    
    $wrapper
      .push(
        hx('r-icon', {
          props: {
            type: iconList[this.type]
          }
        })
      )
      .push(
        hx('span', {}, [this.msg])
      )

    return $wrapper.resolve(h)
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

