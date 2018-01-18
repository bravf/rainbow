import {hx, isArray} from '../../common/_tools.js'
import instance from '../../common/_instance.js'

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
    _getThead () {
      var me = this
      var columnConfs = this.columnConfs
      var $thead = hx('thead')
      var $tr = hx('tr')
  
      columnConfs.forEach(conf=>{
        var $th = hx('th', {
          style: {
            'text-align': conf.align,
          },
        })

        var $thContent

        if (conf.type == 'checkbox'){
          var isAllChecked = true
          var indeterminate = false

          if (me.data.length === 0){
            isAllChecked = false
          }
          else {
            me.data.forEach(data=>{
              if (data.__checked !== true){
                isAllChecked = false
              }
              else {
                indeterminate = true
              }
            })
          }

          $thContent = hx('r-checkbox.r-table-checkbox', {
            props: {
              checkedValue: isAllChecked,
              indeterminate: indeterminate,
            },
            on: {
              input (value) {
                value = !!value

                me.data.forEach(data=>{
                  data.__checked = value
                })

                me.renderHook ++
              }
            }
          })
        }
        else {
          $thContent = hx('span', {}, [conf.title])
        }

        var $div = hx('div').push($thContent)

        if (conf.sortable){
          var $ascArrow = hx('r-icon', {
            'class': {
              'r-table-sort-active': 
                (conf.field === me.sortField) && ('asc' === me.sortDir)
            },
            props: {
              type: 'arrow-up-b'
            },
            nativeOn: {
              click () {
                me.sortMethod('asc', conf.field)
              }
            }
          })
          var $descArrow = hx('r-icon', {
            'class': {
              'r-table-sort-active': 
                (conf.field === me.sortField) && ('desc' === me.sortDir)
            },
            props: {
              type: 'arrow-down-b'
            },
            nativeOn: {
              click () {
                me.sortMethod('desc', conf.field)
              }
            }
          })

          $div.push(
            hx('span.r-table-sort')
              .push($ascArrow)
              .push($descArrow)
          )
        }

        $tr.push(
          $th.push(
            $div
          )
        )
      })
  
      return $thead.push($tr)
    },
    _getTbody () {
      var me = this
      var columnConfs = this.columnConfs
      var $tbody = hx('tbody')

      if (this.data && this.data.length){
        this.data.forEach( (data, dataIdx) =>{
          var $tr = hx('tr', {
            on: {
              click (e) {
                me.$emit('row-click', data, e)
              }
            }
          })

          columnConfs.forEach(conf=>{
            var tdContentValue = ''
            
            if (conf.field) {
              tdContentValue = instance.getPropByPath(data, conf.field).get()
            }
            var tdContent = hx('span', {}, [tdContentValue])

            if (conf.type == 'index'){
              tdContent.children = [dataIdx + 1]
            }
            else if (conf.type == 'checkbox'){
              tdContent = hx('r-checkbox.r-table-checkbox', {
                props: {
                  checkedValue: data.__checked === true
                },
                on: {
                  input (value) {
                    if (value === true){
                      data.__checked = true
                    }
                    else {
                      data.__checked = false
                    }
                    me.renderHook ++
                  }
                },
                nativeOn: {
                  click (e) {
                    e.stopPropagation()
                  }
                }
              })
            }
            else if (conf.type == 'radio'){
              tdContent = hx('r-radio.r-table-radio', {
                props: {
                  checkedValue: data.__checked === true,
                },
                on: {
                  input (value){
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
                    me.renderHook ++
                  }
                },
                nativeOn: {
                  click (e) {
                    e.stopPropagation()
                  }
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

            var divParams = {}

            if (conf.ellipsis){
              divParams['style'] = {
                width: conf.width + 'px',
                'white-space': 'nowrap'
              }
            }

            $tr.push(
              hx('td', {
                style: {
                  'text-align': conf.align,
                },
              }).push(
                hx('div', divParams).push(
                 tdContent
                )
              )
            )
          })

          $tbody.push($tr)
        })
      }
      else {
        var $tr = hx('tr.no-data-text')
        var $td = hx('td', {
          attrs: {
            colspan: columnConfs.length
          }
        })
        $tr.push(
          $td.push(
            hx('div', {}, [this.noDataText])
          )
        )

        $tbody.push($tr)
      }

      return $tbody
    },
    _getColgroup () {
      var columnConfs = this.columnConfs
      var $colgroup = hx('colgroup')
      
      columnConfs.forEach(conf=>{
        $colgroup.push(
          hx('col', {
            attrs: {
              width: conf.width
            }
          })
        )
      })

      return $colgroup
    },
    _getLoading () {
      return this.loading ? hx('r-loading') : null
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
    this.renderHook

    var $tableWrapper = hx(`div.${this.cls.join('+')}`, {
      style: {
        width: this.width + 'px',
      }
    })
    var $table = hx('table').push(this.$slots.default)

    if (this.columnConfs.length){
      $table.push(this._getColgroup())
      
      if (this.showHeader){
        $table.push(this._getThead())
      }
      
      $table.push(this._getTbody())
    }

    return $tableWrapper
      .push($table)
      .push(this._getLoading())
      .resolve(h)
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
  render () {

  }
})

Vue.component('r-table', RTable)
Vue.component('r-table-column', RTableColumn)