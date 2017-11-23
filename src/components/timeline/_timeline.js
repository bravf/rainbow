import {hx} from '../../common/_tools.js'

var RTimeline = Vue.extend({
  props: {
    pending: Boolean,
  },
  render (h) {
    return hx('ul.r-timeline', {
      'class': {
        'r-timeline-pending': this.pending ? true : false
      }
    }, [this.$slots.default]).resolve(h)
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
    var $li = hx(`li.${this.cls.join('+')}`)

    // 竖线
    var $line = hx('div.r-timeline-item-line')

    // 图标
    var $head = hx('div.r-timeline-item-head', {
      'class': {
        'r-timeline-item-head-custom': this.$slots.dot ? true : false
      }
    }, [this.$slots.dot])

    // 内容
    var $content = hx('div.r-timeline-item-content', {}, [this.$slots.default])

    return $li.push([$line, $head, $content]).resolve(h)
  }
})

Vue.component('r-timeline', RTimeline)
Vue.component('r-timeline-item', RTimelineItem)