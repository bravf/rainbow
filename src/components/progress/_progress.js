import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, rIcon} = jsx

var RProgress = Vue.extend({
  props: {
    percent: Number,

    // 枚举：normal, active, wrong, success
    status: {
      type: String,
      default: 'normal'
    },
    strokeWidth: {
      type: Number,
      default: 10,
    },
    hideInfo: Boolean,
  },
  data () {
    return {
      status2: ''
    }
  },
  created () {
    this.status2 = this.status
  },
  watch: {
    percent () {
      if (this.percent === 100){
        this.status2 = 'success'
      }
    }
  },
  computed: {
    cls () {
      var cls = ['r-progress']

      cls.push('r-progress-' + this.status2)

      if (this.hideInfo){
        cls.push('r-progress-hide-info')
      }

      return cls
    },
    percentText () {
      return this.percent + '%'
    }
  },
  methods: {
  },
  render (h) {
    jsx.h = h
    var me = this

    var textContent = this.percentText
    var isWrong = this.status2 === 'wrong'
    var isSuccess = this.status2 === 'success'

    return div('.' + this.cls.join('+'),
      // outer
      div('.r-progress-outer',
        // inner
        div('.r-progress-inner',
          // bg
          div('.r-progress-bg', {
            s_width: this.percentText,
            s_height: this.strokeWidth + 'px'
          })
        )
      ),

      div('.r-progress-text', {vif: !this.hideInfo},
        div('.r-progress-text-inner',
          isWrong || isSuccess ?
          rIcon({p_type: isWrong ? 'ios-close' : 'ios-checkmark'})
          :
          this.percentText
        )
      )
    )
  }
})

Vue.component('r-progress', RProgress)