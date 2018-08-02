import {hx, isArray} from '../../common/_tools'
import instance from '../../common/_instance'
import jsx from '../../common/_jsx'

var {table, thead, tbody, tr, th, td, col ,colgroup, div, rCheckbox, rRadio, span, rIcon, rLoading} = jsx

var RTable = Vue.extend({
  props: {
    data: Array,
    border: Boolean,
    showHeader: {
      type: Boolean,
      default: true,
    },
    width: [String, Number],
    noDataText: {
      type: String,
      default: '暂无数据',
    },
    sortMethod: {
      type: Function,
      default: function (){}
    },
    sortField: String,
    // asc, desc
    sortDir: String,
    loading: Boolean,
    // 合计相关
    showSummary: Boolean,
    summaryText: {
      type: String,
      default: '合计'
    },
    summaryMethod: Function,
  },
  data () {
    return {
      columnConfs: [],
      renderHook: 0,
      radioData: null,
    }
  },
  computed: {
    cls () {
      var cls = ['r-table']

      if (this.border){
        cls.push('r-table-border')
      }

      return cls
    },
  },
  methods: {
    _getColumnConfs () {
      var confs = []
      
      if (!this.$slots.default){
        return
      }

      var propList = ['type', 'title', 'field', 'width', 'align', 'sortable', 'sortMethod', 'ellipsis']
      
      this.$slots.default.forEach(slot=>{
        var options = slot.componentOptions
        var instance = slot.componentInstance

        if (!options || (options.tag != 'r-table-column') ){
          return
        }

        var conf = {
          scopeSlot: instance.$scopedSlots.default
        }

        propList.forEach(prop=>{
          conf[prop] = instance[prop]
        })

        confs.push(conf)
      })

      this.columnConfs = confs
    },
    _renderThead () {
      var me = this
      var columnConfs = this.columnConfs

      return (
        thead(
          tr(
            ...columnConfs.map(conf => {
              return (
                th({'s_text-align': conf.align},
                  div(
                    // 内容
                    conf.type === 'checkbox' ? 
                    rCheckbox('.r-table-checkbox', {
                      p_checkedValue: me.data.length > 0 && me.data.filter(data => {return data.__checked === true}).length === me.data.length,
                      o_input (value) {
                        value = !!value

                        me.data.forEach(data=>{
                          data.__checked = value
                        })

                        me.$emit('check-all-change', value)

                        me.renderHook ++
                      }
                    })
                    :
                    span(conf.title),

                    // 是否有排序
                    span('.r-table-sort', {vif: conf.sortable},
                      rIcon({
                        'c_r-table-sort-active': (conf.field === me.sortField) && ('asc' === me.sortDir),
                        p_type: 'arrow-up-b',
                        no_click () {
                          me.sortMethod('asc', conf.field)
                        }
                      }),
                      rIcon({
                        'c_r-table-sort-active': (conf.field === me.sortField) && ('desc' === me.sortDir),
                        p_type: 'arrow-down-b',
                        no_click () {
                          me.sortMethod('desc', conf.field)
                        }
                      })
                    )
                  )
                )
              )
            })
          )
        )
      )
    },
    _renderTbody () {
      var me = this
      var columnConfs = this.columnConfs

      var dataSource = this.data
      if (!Array.isArray(dataSource)){
        dataSource = []
      }

      return (
        tbody(
          tr({vif: !dataSource.length, 'c_no-data-text': true},
            td({a_colspan: columnConfs.length},
              div(this.noDataText)
            )
          ),
          ...dataSource.map( (data, dataIdx) => {
            return tr({
              o_click (e) {
                me.$emit('row-click', data, e)
              }
            },
            // 列 start
            ...columnConfs.map(conf => {
              var tdContent

              if (conf.field){
                tdContent = span(instance.getPropByPath(data, conf.field).get())
              }

              if (conf.type === 'index'){
                tdContent = span(dataIdx + 1)
              }
              else if (conf.type === 'checkbox'){
                tdContent = rCheckbox('.r-table-checkbox', {
                  p_checkedValue: data.__checked === true,
                  o_input (value) {
                    if (value === true){
                      data.__checked = true
                    }
                    else {
                      data.__checked = false
                    }

                    me.$emit('check-change', data)
                    me.renderHook ++
                  },
                  no_click (e) {
                    e.stopPropagation()
                  }
                })
              }
              else if (conf.type === 'radio') {
                tdContent = rRadio('.r-table-radio', {
                  p_checkedValue: data.__checked === true,
                  o_input (value) {
                    if (data.__checked !== true){
                      data.__checked = true
                    }
                    else {
                      data.__checked = false
                    }

                    if (me.radioData && (me.radioData != data) ){
                      me.radioData.__checked = false
                    }

                    me.radioData = data

                    me.$emit('check-change', data)
                    me.renderHook ++
                  },
                  no_click (e) {
                    e.stopPropagation()
                  }
                })
              }
              else {
                if (conf.scopeSlot){
                  tdContent = conf.scopeSlot({
                    data: data,
                    index: dataIdx
                  })
                }
              }

              return this._renderTd(conf, tdContent)
            })
            // 列 end
            )
          }),
          this._renderSummary()
        )
      )
    },
    _renderTd (column, text) {
      var style = {}

      if (column.ellipsis){
        style = {
          s_width: column.width + 'px',
          's_white-space': 'nowrap',
          s_overflow: 'hidden',
          's_text-overflow': 'ellipsis'
        }
      }

      return td({'s_text-align': column.align},
        div(style, text)
      )
    },
    _renderColgroup () {
      var columnConfs = this.columnConfs

      return (
        colgroup(
          ...columnConfs.map(conf => {
            return col({a_width: conf.width})
          })
        )
      )
    },
    _renderSummary () {
      var columnConfs = this.columnConfs
      var dataSource = this.data

      if (!(this.showSummary && dataSource.length && columnConfs.length)){
        return
      }

      var summaryData = this._getSummaryData(columnConfs, dataSource)

      return tr('.summary',
        ...summaryData.map((text, idx) => {
          var column = columnConfs[idx]
          return this._renderTd(column, text)
        })
      )
    },
    _getSummaryData (columnConfs, dataSource) {
      if (this.summaryMethod) {
        return this.summaryMethod(columnConfs, dataSource)
      }

      var summary = []

      columnConfs.forEach((column, idx) => {
        if (idx === 0){
          summary[idx] = this.summaryText
          return
        }
        if (!column.field){
          summary[idx] = ''
          return
        }

        var values = dataSource.map(item => Number(instance.getPropByPath(item, column.field).get()))
        if (!values.every(value => isNaN(value))){
          summary[idx] = values.reduce((prev, curr) => {
            return prev + curr
          })
        }
        else {
          summary[idx] = ''
        }
      })
      return summary
    },

    // 公开方法
    getCheckeds (field) {
      var checkeds = []

      this.data.forEach(data=>{
        if (data.__checked){
          if (field){
            checkeds.push(data[field])
          }
          else {
            checkeds.push(data)
          }
        }
      })

      return checkeds
    }
  },
  render (h) {
    jsx.h = h
    this.renderHook

    return (
      div('.' + this.cls.join('+'), {
        s_width: this.width + 'px'
      },
        table(
          ...this.$slots.default,
          this._renderColgroup(),
          this.showHeader ? this._renderThead() : null,
          this._renderTbody(),
        ),
        rLoading({vif:this.loading})
      )
    )
  },
})

var RTableColumn = Vue.extend({
  props: {
    title: {
      type: String,
      default: '#',
    },
    field: String,
    // index, checkbox, radio
    type: String,
    width: [Number, String],
    align: {
      type: String,
      default: 'left',
    },
    sortable: Boolean,
    ellipsis: Boolean,
  },
  computed: {
    cls () {
      var cls = []
      return cls
    }
  },
  mounted () {
    this.$parent._getColumnConfs()
  },
  beforeDestroy () {
    this.$parent._getColumnConfs()
  },
  watch: {
    title () {
      this.$parent._getColumnConfs()
    },
  },
  render () {

  }
})

Vue.component('r-table', RTable)
Vue.component('r-table-column', RTableColumn)