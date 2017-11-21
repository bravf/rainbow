import {hx} from '../../common/_tools.js'

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
    var me = this
    var $wrapper = hx(`div.${this.cls.join('+')}`)

    var $outer = hx('div.r-progress-outer')
    .push(
      hx('div.r-progress-inner')
      .push(
        hx('div.r-progress-bg', {
          style: {
            width: this.percentText,
            height: this.strokeWidth + 'px'
          }
        })
      )
    )

    $wrapper.push($outer)
    
    if (!this.hideInfo){
      var textContent = this.percentText
      var isWrong = this.status2 === 'wrong'
      var isSuccess = this.status2 === 'success'

      if (isWrong || isSuccess){
        textContent = hx('r-icon', {
          props: {
            type: isWrong ? 'ios-close' : 'ios-checkmark'
          }
        })
      }

      var $text = hx('div.r-progress-text')
      .push(
        hx('div.r-progress-text-inner', {}, [textContent])
      )

      $wrapper.push($text)
    }
    
    return $wrapper.resolve(h)
  }
})

Vue.component('r-progress', RProgress)