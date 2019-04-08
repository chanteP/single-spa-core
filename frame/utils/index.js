import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import {get, post} from './request';

Vue.use(ElementUI);
window.Vue = Vue

window.$ui = {
    loading: Vue.prototype.$loading,
    message: Vue.prototype.$message,
    alert: Vue.prototype.$alert,
    confirm: Vue.prototype.$confirm,
    notify: Vue.prototype.$notify,
    prompt: Vue.prototype.$prompt,
};

window.$get = get;
window.$post = post;

// request 设置
window.__defaultRequestLoadingStartHandle = () => {window.$ui.loading({lock: true})}
window.__defaultRequestLoadingEndHandle = () => {window.$ui.loading().close()}
window.__defaultRequestErrorHandle = (err) => {window.$ui.notify.error({
    title: '请求失败',
    message: err
})}
window.__defaultRequestLoadingSuccessHandle = (text, title) => {window.$ui.notify.success({
    title: title || '请求成功',
    message: text || '',
})}

