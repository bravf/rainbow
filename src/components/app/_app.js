import {hx} from '../../common/_tools'
import jsx from '../../common/_jsx'

var {rContainer, rHeader, rAside, rMain} = jsx

var RApp = Vue.extend({
  render (h) {
    jsx.h = h
    return (
      rContainer('.r-app',
        rHeader(
          ...this.$slots.header
        ),
        rContainer('.r-app-body',
          rAside(
            ...this.$slots.aside
          ),
          rMain(
            ...this.$slots.main
          )
        )
      )
    )
  }
})

Vue.component('r-app', RApp)