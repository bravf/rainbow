var jsx = {
  h () {},

  getProp (context, prop) {
    var props = prop.split('.'), i
    while (i = props.shift()){
      context = context[i]
    }
    return context
  },
  setProp (context, prop, value) {
    var props = prop.split('.'), i
    while (i = props.shift()){
      if (!props.length){
        break
      }
      context = context[i]
    }
    context[i] = value
  },

  _ (...params) {
    var node = {tag: 'div', props: {'class':{},style:{},attrs:{},props:{},domProps:{},on:{},nativeOn:{}}, children: []}
    var plen = params.length
    if (!plen){
      return node
    }

    if (plen > 1){
      var second = params[1]
      var i = 1

      // 如果第二个参数是 prorps
      if ( (second !== null) && (typeof second === 'object') && (!('componentInstance' in second)) ){
        // 如果有vif===false，直接返回null
        if (second['vif'] === false){
          return null
        }

        var table = {c:'class', s:'style', a:'attrs', p:'props', dp:'domProps', o:'on', no:'nativeOn'}

        for (var k in second){
          // 如果值是null，则过滤
          if (second[k] === null){
            continue
          }

          if (k.includes('_')){
            var [a, b] = k.split('_')
            var aa = table[a]

            node['props'][aa][b] = second[k]
          }
          else {
            node['props'][k] = second[k]
          }
        }
        
        i = 2
      }
      
      node.children.push(...params.slice(i))
    }

    var first = params[0]
    if (first.includes('.')){
      var [t, s] = first.split('.')
      node['tag'] = t
      
      s.split('+').forEach(i => {
        node['props']['class'][i.trim()] = true
      })
    }
    else {
      node['tag'] = first
    }

    //- 处理vmodel
    if ('vmodel' in node.props){
      var [context, model] = node.props['vmodel']
      var tag = node.tag
      var props = node.props

      var inputType = props['attrs']['type']
      var isInput = tag === 'input'
      var isText = (isInput && (inputType === 'text')) || (tag === 'textarea')
      var isRadio =  isInput && (inputType === 'radio')
      var isCheckbox = isInput && (inputType === 'checkbox')
      var isSelect = tag === 'select'
      //- 针对rainbow自定义vmodel的组件
      var isRRadio = tag === 'r-radio' || tag === 'r-checkbox'


      if (isText){
        props['domProps']['value'] = jsx.getProp(context, model)
        props['on']['input'] = e => {
          jsx.setProp(context, model, e.target.value)
        }
      }
      else if (isRadio){
        props['domProps']['checked'] = props['attrs']['value'] === jsx.getProp(context, model) ? true : false
        props['on']['change'] = e => {
          jsx.setProp(context, model, e.target.value)
        }
      }
      else if (isCheckbox){
        //- 如果model是array
        if (Array.isArray(jsx.getProp(context, model))){
          var value = props['attrs']['value']
          var isChecked = props['domProps']['checked'] = jsx.getProp(context, model).includes(value)

          props['on']['change'] = e => {
            if (isChecked){
              jsx.getProp(context, model).splice(jsx.getProp(context, model).indexOf(value), 1)
            }
            else {
              jsx.getProp(context, model).push(value)
            }
          }
        }
        else {
          props['domProps']['checked'] = jsx.getProp(context, model) === true ? true : false
          props['on']['change'] = e => {
            jsx.setProp(context, model, !props['domProps']['checked'])
          }
        }
      }
      else if (isSelect){
        //- 如果model是array
        if (Array.isArray(jsx.getProp(context, model))){
          //- 好像有点麻烦，需要反推option children
        }
        else {
          props['domProps']['value'] = jsx.getProp(context, model)
          props['on']['change'] = e => {
            jsx.setProp(context, model, e.target.value)
          }
        }
      }
      //- 假设其他都是自定义组件
      else {
        var modelProp = 'value'
        var modelEvent = 'input'

        if (isRRadio){
          modelProp = 'checkedValue'
        }

        props['props'][modelProp] = jsx.getProp(context, model)
        props['on']['input'] = val => {
          jsx.setProp(context, model, val)
        }
      }
    }

    if (!Object.keys(node.props.class).length){
      delete node.props.class
    }

    return jsx.h(node.tag, node.props, node.children)
  },

  __ (tag) {
    return (...params) => {
      if ( (typeof params[0] === 'string') && (params[0][0] === '.') ){
        params[0] = tag + params[0]
      }
      else {
        params.unshift(tag)
      }
      
      return jsx._(...params)
    }
  }
}

'a,b,button,dd,div,dl,dt,em,form,i,iframe,img,input,textarea,label,li,ol,optgroup,option,p,select,span,table,th,thead,tbody,tr,td,col,colgroup,ul,h1,h2,h3,h4,h5,h6,slot'.split(',').forEach(tag => {
  jsx[tag] = jsx.__(tag)
})

// 内置组件
'rRow,rCol,rContainer,rHeader,rAside,rMain,rIcon,rLoading,rCheckbox,rRadio,rTag,rSelectOption,rInput,rProgress,rModal,rButton,rSelect,rSelectOption'.split(',').forEach(tag => {
  jsx[tag] = jsx.__(tag.replace(/([A-Z])/g, '-$1').toLowerCase())
})

window.jsx = jsx
export default jsx