import {hx} from '../../common/_tools.js'

function newArray(len) {
  return Array.apply(null, Array(len))
}

var RTableEditor = Vue.extend({
  props: {
    value: Object,
  },
  data () {
    return {
      // 内部数据
      array: [],

      // 默认最大列，最大行
      colCount: 10,
      rowCount: 100,

      focusX: -1,
      focusY: -1,

      // 是否输入中
      isInputing: false,

      modal: {
        colSetter: {
          show: false,
          idx: -1,
          key: '',
          name: '',
          type: '',
          width: '',
          enums: '',
        }
      },

      renderHook:0,
    }
  },
  created () {
    this._syncData()
  },
  watch: {
    'value' () {
      this._syncData()
      this.renderHook ++
    }
  },
  computed: {
    data () {
      return this.value.extra.data || []
    },
    cols () {
      return this.value.extra.cols || []
    }
  },
  methods: {
    // 当外部 data 发生变化，同步到组件 data
    _syncData () {
      // 构造 100（行） * 10（列） 的初始化数组
      for (var r=0; r<this.rowCount; r++){
        this.array[r] = []

        for (var c=0; c<this.colCount; c++){
          this.array[r][c] =  this.data[r] ? (this.data[r][c] || '') : ''
        }
      }
    },

    _getDataVal (rowIdx, colIdx) {
      return this.array[rowIdx][colIdx]
    },
    _setDataVal (rowIdx, colIdx, val){
      this.array[rowIdx][colIdx] = val
      this.renderHook ++
    },
    _getCol (colIdx) {
      return this.cols[colIdx] || {type:'text'}
    },
    _setCol (colIdx, width, key, name, type, enums){
      this.cols[colIdx] = {
        width: width,
        type: type,
        key: key,
        name: name,
        enums: enums,
      }
    },
    _getTotalWidth () {
      var width = 0
      
      for (var c=0; c<this.colCount; c++){
        width += (~~this._getCol(c).width || 100)
      }

      return width
    },

    _getColgroup () {
      var colLooper = newArray(this.colCount)
      var widthCount = 0

      var $colgroup = hx('colgroup').push(
        colLooper.map( (val, idx) => {
          var width = this._getCol(idx).width || 100
          widthCount += width

          return hx('col', {
            attrs: {
              width: width
            }
          })
        }) 
      )

      return {
        $el: $colgroup,
        widthCount
      }
    },

    _drawThead (colgroup) {
      var me = this
      var $table = hx('table')
      var colLooper = newArray(this.colCount)

      var $colgroup = colgroup.$el
      var $thead = hx('tbody').push(
        hx('tr').push(
          colLooper.map( (val, idx) => {
            return hx('th', {
              on: {
                click () {
                  var col = me._getCol(idx)
                  var colSetter = me.modal.colSetter

                  colSetter.show = true

                  colSetter.idx = idx
                  colSetter.width = col.width
                  colSetter.key = col.key
                  colSetter.name = col.name
                  colSetter.type = col.type
                  colSetter.enums = col.enums
                }
              }
            }, [me._getCol(idx).name || idx])
          } )
        )
      )

      return hx('div.r-table-editor-thead', {
        style: {
          width: colgroup.widthCount + 'px'
        }
      }).push(
        $table.push($colgroup).push($thead)
      )
    },

    _drawTbody (colgroup) {
      var me = this

      // 默认 10列 20行的 table
      var rowLooper = newArray(this.rowCount)
      var colLooper = newArray(this.colCount)

      var $table = hx('table')

      var $colgroup = colgroup.$el

      var $tbody = hx('tbody').push(
        rowLooper.map( (_, rowIdx) => {
          return hx('tr').push(
            colLooper.map( (_, colIdx) => {
              var $ret
              var col = me._getCol(colIdx)

              // 如果当前td focus，则显示输入框
              if ( (me.focusY === rowIdx) && (me.focusX === colIdx) ) {
                var $input

                // 如果 text
                if (col.type === 'text'){
                  $input = hx('input.input', {
                    attrs: {
                      value: me._getDataVal(rowIdx, colIdx)
                    },
                    on: {
                      input (e) {
                        me._setDataVal(rowIdx, colIdx, e.target.value)
                      },
                      blur () {
                        me.isInputing = false
                        me._getFocus()
                      }
                    }
                  })
                }
                // 如果 date, time
                else if ( (col.type === 'date') || (col.type === 'time') ) {
                  var tag = `r-${col.type}picker.${col.type}`
                  $input = hx(tag, {
                    props: {
                      value: me._getDataVal(rowIdx, colIdx)
                    },
                    on: {
                      input (val) {
                        me._setDataVal(rowIdx, colIdx, val)
                      }
                    }
                  })
                }
                // 如果select, select-mutli
                else if ( (col.type === 'select') || (col.type === 'select-mutli') ){
                  $input = hx('r-select', {
                    props: {
                      value: me._getDataVal(rowIdx, colIdx)
                    },
                    on: {
                      input (val) {
                        me._setDataVal(rowIdx, colIdx, val)
                      }
                    }
                  }).push(
                    col.enums.split('|').map(val => {
                      return hx('r-select-option', {
                        props: {
                          label: val.trim(),
                          value: val.trim(),
                        }
                      })
                    })
                  )
                }

                $ret = hx('td.input-td').push($input)
              }
              else {
                $ret = hx(`td.${col.type}`, {
                  on: {
                    click () {
                      me.focusX = colIdx
                      me.focusY = rowIdx

                      me._getFocus()
                    }
                  }
                }, [me._getDataVal(rowIdx, colIdx)])
              }

              return $ret
            })
          )
        } )
      )

      return hx('div.r-table-editor-tbody', {
        style: {
          width: colgroup.widthCount + 'px'
        }
      }).push(
        $table.push($colgroup).push($tbody)
      )
    },

    // 尝试去获取焦点
    _getFocus () {
      if (this.modal.colSetter.show){
        return
      }
      Vue.nextTick(_=>{
        if (this._getCol(this.focusX).type === 'text'){
          var $input = this.$el.querySelector('.input')

          $input.focus()
          $input.value = $input.value
          // 移动光标到末尾
          $input.selectionStart = $input.selectionEnd = $input.value.length
        }
        else {
          this.$el.focus()
        }
      })
    },

    // 是否有列名设置，如果有，则把行数据转为key:value
    _hasColKey () {
      var has = false
      this.cols.some( col => {
        if (col.key){
          has = true
          return true
        }
        else {
          return false
        }
      })
      return has
    },

    _getColKey (colIdx) {
      if (!this.cols[colIdx]){
        return colIdx
      }

      return this.cols[colIdx]['key'] || this.cols[colIdx]['name'] || colIdx
    },

    // 得到有效的最大col和最大row
    _getUsedRowCol () {
      var col = 0
      var row = 0

      for (var r=this.rowCount-1; r>=0; r--){
        for (var c=this.colCount-1; c>=0; c--){
          if (this.array[r][c] !== ''){
            return [r, c]
          }
        }
      }

      return [row, col]
    },  

    getData () {
      var data = []
      var extraData = []

      var [row, col] = this._getUsedRowCol()
      var isKV = this._hasColKey()

      for (var r=0; r<=row; r++){
        extraData[r] =  []
        data[r] = isKV ? {} : []

        for (var c=0; c<=col; c++){
          extraData[r][c] = this.array[r][c]

          var key = isKV ? this._getColKey(c) : c
          data[r][key] = this.array[r][c]
        }
      }

      return {
        data,
        extra: {
          data: extraData,
          cols: this.cols
        }
      }
    }
  },
  render (h) {
    var me = this

    me.renderHook

    var $wrapper = hx('div.r-table-editor + r-table + r-table-border', {
      // style: {
      //   width: this._getTotalWidth() + 'px'
      // },
      attrs: {
        tabindex: 0
      },
      on: {
        keydown (e) {
          if (me.modal.colSetter.show){
            return
          }

          var key = e.key

          // 无论何种模式，都要切换单元格
          if (['Tab', 'Enter'].includes(key)){
            var x = me.focusX + 1
              
            if (x >= me.colCount){
              me.focusX = 0
              me.focusY = Math.min(me.rowCount-1, me.focusY+1)
            }
            else {
              me.focusX = x
            }

            me.isInputing = false
            me._getFocus()

            e.preventDefault()
            return
          }

          // 如果正在输入模式，则不处理后续
          if (me.isInputing){
            return
          }

          if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(key)){
            if (key === 'ArrowUp'){
              me.focusY = Math.max(0, me.focusY-1)
            }
            else if (key === 'ArrowDown'){
              me.focusY = Math.min(me.rowCount-1, me.focusY+1)
            }
            else if (key === 'ArrowLeft'){
              me.focusX = Math.max(0, me.focusX-1)
            }
            else if (key === 'ArrowRight'){
              me.focusX = Math.min(me.colCount-1, me.focusX+1)
            }

            me._getFocus()
            e.preventDefault()
          }
          else {
            if (me._getCol(me.focusX).type === 'text'){
              // 开启输入模式
              me.isInputing = true
            }
          }
          
        }
      }
    })

    var colgroup = this._getColgroup()
    $wrapper.push(this._drawThead(colgroup)).push(this._drawTbody(colgroup))

    // col setter modal
    var colSetter = this.modal.colSetter
    $wrapper.push(
      hx('r-modal', {
        props: {
          title: '设置列名',
          value: colSetter.show
        },
        on: {
          input (val) {
            colSetter.show = val
          }
        }
      })
      .push(
        hx('r-form')
        // 
        .push(
          hx('r-form-item', {
            props: {
              label: '列宽'
            }
          }).push(
            hx('r-input', {
              props: {
                value: colSetter.width
              },
              on: {
                input (val) {
                  colSetter.width = val
                }
              }
            })
          ),
        )
        // 
        .push(
          hx('r-form-item', {
            props: {
              label: '列key'
            }
          }).push(
            hx('r-input', {
              props: {
                value: colSetter.key
              },
              on: {
                input (val) {
                  colSetter.key = val
                }
              }
            })
          ),
        )
        // 
        .push(
          hx('r-form-item', {
            props: {
              label: '列名'
            }
          }).push(
            hx('r-input', {
              props: {
                value: colSetter.name
              },
              on: {
                input (val) {
                  colSetter.name = val
                }
              }
            })
          ),
        )
        // 
        .push(
          hx('r-form-item', {
            props: {
              label: '列类型'
            }
          }).push(
            hx('r-select', {
              props: {
                value: colSetter.type
              },
              on: {
                input (val) {
                  colSetter.type = val
                }
              }
            }).push(
              ['text', 'date', 'time', 'select'].map( val => {
                return hx('r-select-option', {
                  props: {
                    label: val,
                    value: val,
                  }
                })
              } )
            )
          )
        )
        // 
        .push(
          ( colSetter.type && colSetter.type.includes('select') ) ? hx('r-form-item', {
            props: {
              label: '枚举'
            }
          }).push(
            hx('r-input', {
              props: {
                value: colSetter.enums
              },
              on: {
                input (val) {
                  colSetter.enums = val
                }
              }
            })
          ) : null
        )
      )
      //
      .push(
        hx('div', {
          slot: 'footer'
        }).push(
          hx('r-button', {
            props: {
              type: 'danger'
            },
            nativeOn: {
              click () {
                me._setCol(colSetter.idx, colSetter.width, colSetter.key, colSetter.name, colSetter.type, colSetter.enums)
                colSetter.show = false
              }
            }
          }, ['确定'])
        )
      )
    )

    return $wrapper.resolve(h)
  }
})

Vue.component('r-table-editor', RTableEditor)