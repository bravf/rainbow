import {hx} from '../../common/_tools.js'

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
      zindex: 0
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
    var me = this

    var $wrapper = hx('span', {
      style: {
        display: this.value ? 'block' : 'none'
      }
    })

    var zindexStyle = {
      style: {
        'z-index': this.zindex,
      }
    }
    
    // mask
    $wrapper.push(
      hx('div.r-modal-mask', zindexStyle)
    )

    // modal
    var $modal = hx('div.r-modal', {
      style: {
        width: this.width + 'px',
      }
    })

    // close
    $modal.push(
      hx('a.r-modal-close').push(
        hx('r-icon', {
          props: {
            type: 'ios-close-empty'
          },
          nativeOn: {
            click () {
              me.$emit('input', false)
            }
          }
        })
      )
    )

    // head
    $modal.push(
      hx('div.r-modal-header').push(
        hx('div.r-modal-header-inner', {}, [this.title])
      )
    )

    // body
    $modal.push(
      hx('div.r-modal-body', {}, [this.$slots.default])
    )

    // footer
    var $footerContent = this.$slots.footer
    if ($footerContent){
      $modal.push(
        hx('div.r-modal-footer', {}, [$footerContent])
      )
    }

    $wrapper.push(
      hx('div.r-modal-wrapper', zindexStyle).push($modal)
    )

    return $wrapper.resolve(h)
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
  template: `
    <r-modal v-model="value" :title="title" width="300" class="r-alert-global">
      <p>{{content}}</p>
      <div slot="footer">
        <r-button @click.native="okClick">确定</r-button>
      </div>
    </r-modal>
  `,
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
      this.content = content || ''
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
  template: `
    <r-modal v-model="value" :title="title" width="300" class="r-confirm-global">
      <p>{{content}}</p>
      <div slot="footer">
        <r-button @click.native="cancelClick">取消</r-button>
        <r-button @click.native="okClick" type="primary">确定</r-button>
      </div>
    </r-modal>
  `,
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
      this.content = options.content || ''
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