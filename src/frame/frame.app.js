import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import Frame from './Frame.vue';

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    el: '#nav',
    render(h){return h(Frame)}
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
