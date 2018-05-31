import jsx from '../../common/_jsx'

var {div, span, a} = jsx

var RBreadcrumb = Vue.extend({
  props: {
    separator: {
      type: String,
      default: '/'
    }
  },
  render (h) {
    jsx.h = h
    
    var nodes = []
    this.$slots.default.forEach(node => {
      if (node.componentOptions && node.componentOptions.tag === 'r-breadcrumb-item'){
        if (nodes.length){
          nodes.push(
            span('.r-breadcrumb-separator', this.separator)
          )
        }
        nodes.push(node)
      }
    })

    return div('.r-breadcrumb', ...nodes)
  }
})

var RBreadcrumbItem = Vue.extend({
  props: {
    href: String,
    target: String,
  },
  render (h) {
    jsx.h = h
    return this.href ?
      a('.r-breadcrumb-item-a', { a_href: this.href, a_target: this.target,}, ...this.$slots.default) :
      span('.r-breadcrumb-item-span', ...this.$slots.default)
  }
})

Vue.component('r-breadcrumb', RBreadcrumb)
Vue.component('r-breadcrumb-item', RBreadcrumbItem)