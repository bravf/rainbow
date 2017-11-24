import {hx} from '../../common/_tools.js'

var RApp = Vue.extend({
  template: `
    <r-container class="r-app">
      <r-header>
        <slot name="header"></slot>
      </r-header>
      
      <r-container class="r-app-body">
        <r-aside>
          <slot name="aside"></slot>
        </r-aside>

        <r-main>
          <slot name="main"></slot>
        </r-main>
      </r-container>
    </r-container>
  `
})

Vue.component('r-app', RApp)