import { registerApplication, start } from 'single-spa';
import './frame/styles/style.css';
import './frame/utils';
import './frame/libs/system';

let baseModule = [
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
    path: (location) => location.pathname === '/',
  },
];

[...baseModule, 
  {
    name: 'mod-vue',
    main: '/mod-vue/mod-vue.js',
    url: '',
    store: null,
    base: false,
    path: '/mod-vue',
  }
].forEach(app => {
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
  let mod = typeof params.main === 'string' ? System.import('/static' + params.main).then(mod => mod && mod['default'] || mod) : Promise.resolve(params.main);
  mod.then(d => console.log('load module', d))
  registerApplication(
      params.name, 
      () => mod,
      params.base ? (() => true) : pathPrefix(params)
  );

}

