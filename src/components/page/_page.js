import {hx} from '../../common/_tools.js'

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
    var me = this
    var $wrapper = hx(`div.${this.cls.join('+')}`)

    // 总页码
    var pageTotal = parseInt((this.total + this.pageSize - 1) / this.pageSize)

    if (this.showTotal){
      $wrapper.push(
        hx('span.r-page-total', {}, ['共 ' + this.total + ' 条'])
      )
    }

    $wrapper.push(
      hx('r-button', {
        props: {
          disabled: this.value === 1 ? true : false,
          size: this.size
        },
        nativeOn: {
          click () {
            me.$emit('input', me.value - 1)
          } 
        }
      }, ['上一页'])
    )

    var $select = hx('r-select.r-page-mid', {
      props: {
        value: this.value,
        filterable: true,
        placeholder: '...',
        notFoundText: '...',
        size: this.size,
      },
      style: {
        width: Math.max(0, pageTotal.toString().length - 2) * 10 + 60 + 'px'
      },
      on: {
        input (value) {
          me.$emit('input', value)
        }
      }
    })

    for (var i=1; i<=Math.min(pageTotal, 99); i++){
      $select.push(
        hx('r-select-option', {
          props: {
            value: i,
            label: i.toString(),
          }
        })
      )
    }

    if (pageTotal > 99){
      $select.push(
        hx('r-select-option', {
          props: {
            value: '',
            label: '...',
            disabled: true,
          }
        })
      )

      $select.push(
        hx('r-select-option', {
          props: {
            value: pageTotal,
            label: pageTotal.toString(),
          }
        })
      )
    }

    $wrapper.push($select)

    $wrapper.push(
      hx('r-button', {
        props: {
          disabled: this.value === pageTotal ? true : false,
          size: this.size
        },
        nativeOn: {
          click () {
            me.$emit('input', me.value + 1)
          } 
        }
      }, ['下一页'])
    )

    return $wrapper.resolve(h)
  }
})

Vue.component('r-page', RPage)