import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import NavBar from './NavBar.vue';

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    el: '#nav',
    render(h){return h(NavBar)}
  }  
});

export const bootstrap = [
  vueLifecycles.bootstrap,
];

export const mount = [
  vueLifecycles.mount,
];

export const unmount = [
  vueLifecycles.unmount,
];
