import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div} = jsx

var RTooltip = Vue.extend({
  props: {
    content: String,
    placement: {
      type: String,
      default: 'bottom',
    }
  },
  data () {
    return {
      popup: null,
      hideTimer: null,
    }
  },
  mounted () {
    // 绑定鼠标事件
    this.$el.addEventListener('mouseenter', _=>{
      this._showPopup()
    })
    this.$el.addEventListener('mouseleave', _=>{
      this._hidePopup()
    })
  },
  methods: {
    _createPopup () {
      if (this.popup){
        return
      }

      this.popup = new RTooltipPopup({
        data: {
          content: this.$slots.content,
          placement: this.placement,
          targetEl: this.$el,
        }
      })
      this.popup.$mount(document.createElement('div'))
      document.body.appendChild(this.popup.$el)
  
      this.popup.$el.addEventListener('mouseenter', _=>{
        this._showPopup()
      })
      this.popup.$el.addEventListener('mouseleave', _=>{
        this._hidePopup()
      })
    },
    _showPopup () {
      clearTimeout(this.hideTimer)

      this._createPopup()
      this._setPopupContent()

      this.$nextTick(_=>{
        this.popup.show()
      })
    },
    _hidePopup () {
      clearTimeout(this.hideTimer)

      this.hideTimer = setTimeout(_ => {
        this.popup.hide()
      }, 10)
    },
    _setPopupContent () {
      if (!this.popup){
        return
      }

      this.popup.content = this.$slots.content || [this.content] || ['']
    }
  },
  render (h) {
    return this.$slots.default[0]
  }
})

var RTooltipPopup = Vue.extend({
  props: {
  },
  data () {
    return {
      content: '',
      targetEl: null,
      isShow: false,
      top: -1000,
      left: -1000,
      placement: 'bottom'
    }
  },
  methods: {
    show () {
      if (this.isShow){
        return
      }
      this.setPosition()
    },
    hide () {
      this.top = this.left = -1000
    },
    setPosition () {
      var rect = this.targetEl.getBoundingClientRect()
      var top = rect.top + window.scrollY
      var left = rect.left + window.scrollX

      var rect2 = this.$el.getBoundingClientRect()

      // bottom
      if (this.placement === 'bottom'){
        top += rect.height
        left = left - (rect2.width / 2) + (rect.width / 2)
      }
      else if (this.placement === 'bottom-start'){
        top += rect.height
      }
      else if (this.placement === 'bottom-end'){
        top += rect.height
        left = left + rect.width - rect2.width
      }

      // top
      else if (this.placement === 'top'){
        top -= rect2.height
        left = left - (rect2.width / 2) + (rect.width / 2)
      }
      else if (this.placement === 'top-start'){
        top -= rect2.height
      }
      else if (this.placement === 'top-end'){
        top -= rect2.height
        left = left + rect.width - rect2.width
      }

      // left
      else if (this.placement === 'left'){
        top = top - (rect2.height / 2) + (rect.height / 2)
        left = left - rect2.width
      }
      else if (this.placement === 'left-start'){
        left = left - rect2.width
      }
      else if (this.placement === 'left-end'){
        top = top + rect.height - rect2.height
        left = left - rect2.width
      }

      // right
      else if (this.placement === 'right'){
        top = top - (rect2.height / 2) + (rect.height / 2)
        left = left + rect.width
      }
      else if (this.placement === 'right-start'){
        left = left + rect.width 
      }
      else if (this.placement === 'right-end'){
        top = top + rect.height - rect2.height
        left = left + rect.width
      }

      this.top = Math.max(top, 0)
      this.left = Math.max(left, 0)
    }
  },
  render (h) {
    jsx.h = h

    return div('.r-tooltip-popup', {
      s_top: this.top + 'px',
      s_left: this.left + 'px',
      'a_x-placement': this.placement,
    },
      div('.r-tooltip-popup-inner', ...this.content)
    )
  }
})

Vue.component('r-tooltip', RTooltip)