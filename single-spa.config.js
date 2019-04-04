import { registerApplication, start } from 'single-spa';
import './frame/styles/style.css';
import './frame/utils';

let projectConfig = [
  {
    name: 'frame',
    main: require('./src/frame/frame.app.js'),
    url: '/',
    store: null,
    base: true,
    path: '',
  },
  {
    name: 'home',
    main: require('./src/home/home.app.js'),
    url: '/',
    store: null,
    base: false,
    path: '/',
  },
  {
    name: 'mod-vue',
    main: '/mod-vue/mod-vue.js',
    url: '',
    store: null,
    base: false,
    path: '/mod-vue',
  },
];

projectConfig.forEach(app => {
  registerApp(app);
});

start();

// pushState 模式
function pathPrefix(app) {
  return typeof app.path === 'function' ? app.path : function (location) {
      let isShow = false
      //如果该模块 有多个需要匹配的路径
      if(Array.isArray(app.path)){
          app.path.forEach(path => {
              if(location.pathname.indexOf(`${path}`) === 0){
                  isShow = true
              }
          });
      }
      // 普通情况
      else if(location.pathname.indexOf(`${app.path || app.url}`) === 0){
          isShow = true
      }
      return isShow;
  }
}

// 应用注册
async function registerApp(params) {
  registerApplication(
      params.name, 
      () => typeof params.main === 'string' ? System.import(params.main) : Promise.resolve(params.main),
      params.base ? (() => true) : pathPrefix(params)
  );

}

