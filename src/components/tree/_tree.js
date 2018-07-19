import {hx, hasChildren, isChildren} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {div, span, ul, li, rIcon, rCheckbox} = jsx

var RTree = Vue.extend({
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    multiple: Boolean,
    showCheckbox : Boolean,
  },
  data () {
    return {
      renderHook: 0,
      currSelected: null,
    }
  },
  created () {
    this._checkExpand()
  },
  watch: {
    data () {
      this._checkExpand()
      this.currSelected = null
    }
  },
  methods: {
    // 检查展开，如果子项是展开，那么展开所有父项
    _checkExpand () {
      var _loop = function (data, parentList) {
        data.forEach(item => {
          item.__parent = parentList[0]
  
          if (item.__expand === true){
            parentList.forEach(_parent => {
              _parent.__expand = true
            })
          }
    
          var children = item.children
          if (isChildren(children)){
            _loop(children, [item].concat(parentList))
          }
        })
      }
  
      _loop(this.data, [])
    },
    // 设置所有子节点选中
    _setChildrenChecked (item) {

      var _loop = function (data) {
        if (!(isChildren(data))){
          return
        }

        data.forEach(_item => {
          _item.__checked = isChecked
          _loop(_item.children)
        })
      }

      var children = item.children
      var isChecked = item.__checked

      _loop(children)
    },

    // 设置父节点状态
    _setParentChecked (item) {

      var _loop = function (data) {
        if (!data){
          return
        }

        // parent下儿子节点是否全选中？
        var isAllChecked = true

        data.children.every(child => {
          if (child.__checked !== true){
            isAllChecked = false
            return false
          }
          else {
            return true
          }
        })

        data.__checked = isAllChecked
        _loop(data.__parent)
      }

      var parent = item.__parent
      _loop(parent)
    },

    _getAllNodeData () {
      
      var _loop = function (data) {
        if (!isChildren(data)){
          return
        }

        nodes = nodes.concat(data)

        data.forEach(node => {
          _loop(node.children)
        })
      }
      
      var nodes = []
      _loop(this.data)

      return nodes
    },

    // 获取checked节点
    getCheckeds (field) {
      var nodes = this._getAllNodeData()
      var checkeds = []

      nodes.forEach(node => {
        // 是否是最深子节点
        if (!hasChildren(node)){
          // 是否选中
          if (node.__checked === true){
            if (field){
              checkeds.push(node[field])
            }
            else {
              checkeds.push(node)
            }
          }
        }
      })

      return checkeds
    },

    // 获取selected节点
    getSelecteds (field) {
      var nodes = this._getAllNodeData()
      var checkeds = []

      nodes.some(node => {
        var isSelected = false

        // 单select模式
        if (!this.multiple){
          if ( 
              (node === this.currSelected) || 
              (node.__selected === true && this.currSelected === null) 
          ){
            isSelected = true
          }
        }
        // 多select模式
        else {
          isSelected = node.__selected === true
        }

        if (isSelected){
          if (field){
            checkeds.push(node[field])
          }
          else {
            checkeds.push(node)
          }

          // 如果单选并且找到，则退出循环
          if (!this.multiple){
            return true
          }
        }

        return false
      })

      return checkeds
    },
    // 得到所有vnodes
    _renderChildrenNodes () {
      var me = this

      var __loop = function (data) {
        return (
          ul('.r-tree-wrapper',
            ...data.map(item => {
              var children = item.children
              var hasChildren = isChildren(children)

              return (
                li('.r-tree-item', {'c_r-tree-item-open': item.__expand ? true : false},
                  // 箭头
                  span('.r-tree-item-arrowWrapper', {
                    'c_r-tree-item-no-children': hasChildren ? false : true,
                    o_click () {
                      if (!hasChildren){
                        return
                      }
        
                      if (item.__expand !== true){
                        item.__expand = true
                      }
                      else {
                        item.__expand = false
                      }
                      me.renderHook ++
                    }
                  },
                    // 箭头icon
                    rIcon({p_type: 'arrow-right-b'})
                  ),

                  // 复选框
                  rCheckbox({
                    vif: me.showCheckbox,
                    p_checkedValue: item.__checked ? true : false,
                    o_input () {
                      if (item.__checked !== true){
                        item.__checked = true
                      }
                      else {
                        item.__checked = false
                      }
    
                      me._setChildrenChecked(item)
                      me._setParentChecked(item)
    
                      me.$emit('check-change', me.getCheckeds())
                      me.renderHook ++
                    }
                  }),

                  // 文本
                  span('.r-tree-item-text', {
                    'dp_innerHTML': item.title,
                    'c_r-tree-item-selected': (item.__selected && me.currSelected === null) || (me.currSelected === item),
                    o_click () {
                      // 如果是单selected模式
                      if (!me.multiple){
                        me.currSelected = item
                      }
                      // 多selected模式
                      else {
                        if (item.__selected !== true){
                          item.__selected = true
                        }
                        else {
                          item.__selected = false
                        }
                      }
        
                      me.$emit('select-change', me.getSelecteds())
                      me.renderHook ++
                    }
                  }),

                  // 是否有子节点
                  hasChildren ? __loop(children) : null
                )
              )
            })
          )
        )
      }

      return __loop(this.data)
    },
  },
  render (h) {
    jsx.h = h
    this.renderHook

    return (
      div('.r-tree',
        this.data.length > 0 ? this._renderChildrenNodes() : null
      )
    )
  }
})

Vue.component('r-tree', RTree)