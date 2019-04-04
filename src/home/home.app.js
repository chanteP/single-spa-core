import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import Home from './Home.vue';

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    el: '#app',
    render(h){return h(Home)}
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
