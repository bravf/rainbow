import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, ul, li} = jsx

var RTimeline = Vue.extend({
  props: {
    pending: Boolean,
  },
  render (h) {
    jsx.h = h

    return ul('.timeline', {'c_r-timeline-pending': this.pending ? true : false}, ...this.$slots.default)
  }
})

var RTimelineItem = Vue.extend({
  props: {
    // 枚举，blue, red, green
    color: {
      type: String,
      default: 'blue',
    }
  },
  computed: {
    cls () {
      var cls = ['r-timeline-item']

      cls.push('r-timeline-item-' + this.color)

      return cls
    }
  },
  render (h){
    jsx.h = h

    return li('.' + this.cls.join('+'),
      // 竖线
      div('.r-timeline-item-line'),
      // 图标
      div('.r-timeline-item-head', {'c_r-timeline-item-head-custom': this.$slots.dot ? true : false}, ...this.$slots.dot),
      // 内容
      div('.r-timeline-item-content', ...this.$slots.default)
    )
  }
})

Vue.component('r-timeline', RTimeline)
Vue.component('r-timeline-item', RTimelineItem)