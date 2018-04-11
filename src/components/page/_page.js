import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, span, rSelect, rSelectOption, rButton} = jsx

function getNumArr(start, end){
  var arr = []
  for (var i=start; i<end; i++){
    arr.push(i)
  }
  return arr
}

var RPage = Vue.extend({
  props: {
    value: Number,
    total: {
      type: Number,
      default: 0,
    },
    size: String,
    showTotal: Boolean,
    pageSize: {
      type: Number,
      default: 10,
    }
  },
  computed: {
    cls () {
      var cls = ['r-page']

      return cls
    },
  },
  methods: {
  },
  render (h) {
    jsx.h = h
    var me = this

    // 总页码
    var pageTotal = parseInt((this.total + this.pageSize - 1) / this.pageSize)

    if (pageTotal === 0){
      return null
    }

    return (
      div('.r-page',
        this.showTotal ? span('.r-page-total', '共 ' + this.total + ' 条') : null,
      
        // 上一页
        rButton({
          p_disabled: this.value === 1 ? true : false,
          p_size: this.size,
          no_click () {
            me.$emit('input', me.value - 1)
          }
        }, '上一页'),

        // 页码选择
        rSelect('.r-page-mid', {
          p_value: this.value,
          p_filterable: true,
          p_placeholder: '...',
          p_notFoundText: '...',
          p_size: this.size,
          s_width: Math.max(0, pageTotal.toString().length - 2) * 10 + 60 + 'px',
          o_input (value) {
            me.$emit('input', value)
          }
        },
          ...getNumArr(1, Math.min(pageTotal, 100)).map(i => {
            return rSelectOption({p_value: i, p_label: i.toString()})
          }),
          // 如果大于99
          pageTotal > 99 ? rSelectOption({p_value: '', p_label: '...', p_disabled: true}) : null,
          pageTotal > 99 ? rSelectOption({p_value: pageTotal, p_label: pageTotal.toString()}): null
        ),

        // 下一页
        rButton({
          p_disabled: this.value >= pageTotal ? true : false,
          p_size: this.size,
          no_click () {
            me.$emit('input', me.value + 1)
          }
        }, '下一页')
      )
    )
  }
})

Vue.component('r-page', RPage)