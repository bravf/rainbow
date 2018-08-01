import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, span, rIcon} = jsx

var RMessage = Vue.extend({
  props: {
  },
  data () {
    return {
      isShow: false,
      duration: 3000,
      msgQueue: [],
      // 是否暂停删除队列 msg
      stopDelFlag: false,
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
    show (msg, type='error') {
      var msgObj = {msg, type}
      
      this.msgQueue.push(msgObj)
      this.isShow = true

      // duration 时间后删除此 msg
      this.delayDelMsgObj(msgObj)
    },
    delMsgObj (msgObj) {
      var idx = this.msgQueue.indexOf(msgObj)
      this.msgQueue.splice(idx, 1)

      if (!this.msgQueue.length){
        this.isShow = false
      }
    },
    // 延迟删除操作
    delayDelMsgObj (msgObj) {
      setTimeout(_ => {
        if (this.stopDelFlag){
          this.delayDelMsgObj(msgObj)
          return
        }
        
        this.delMsgObj(msgObj)
      }, this.duration);
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

    return div('.r-message', {
      s_display: this.isShow ? 'block' : 'none',
      o_mouseenter () {
        me.stopDelFlag = true
      },
      o_mouseleave () {
        me.stopDelFlag = false
      }
    },
      this.msgQueue.map(msgObj => {
        var itemStyle = 'r-message-' + msgObj.type

        return div(`.r-message-item + ${itemStyle}`, 
          rIcon({p_type:iconList[msgObj.type]}),
          span(msgObj.msg)
        )
      })
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

