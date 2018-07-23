import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, span, rSelect, rSelectOption, rButton} = jsx

function getNumArr(start, end){
  var arr = []
  for (var i=start; i<=end; i++){
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
  watch: {
  },
  methods: {
    _emitChange (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
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
        span('.r-page-total', {vif: this.showTotal}, `共 ${this.total} 条，${pageTotal} 页`),
      
        // 上一页
        rButton({
          p_disabled: this.value === 1 ? true : false,
          p_size: this.size,
          no_click () {
            me._emitChange(me.value - 1)
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
            me._emitChange(value)
          }
        },
          ...getNumArr(1, Math.min(pageTotal, 100)).map(i => {
            return rSelectOption({p_value: i, p_label: i.toString()})
          }),
          // 如果大于99
          rSelectOption({vif: pageTotal > 99, p_value: '', p_label: '...', p_disabled: true}),
          rSelectOption({vif: pageTotal > 99, p_value: pageTotal, p_label: pageTotal.toString()})
        ),

        // 下一页
        rButton({
          p_disabled: this.value >= pageTotal ? true : false,
          p_size: this.size,
          no_click () {
            me._emitChange(me.value + 1)
          }
        }, '下一页')
      )
    )
  }
})

Vue.component('r-page', RPage)