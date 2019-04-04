import { start } from 'single-spa';
import './frame/styles/style.css';
import './frame/utils';
import { registerApp } from './register';

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
    main: '/home/home.js',
    url: '',
    store: null,
    base: true,
    path: (location) => location.pathname === "" || location.pathname === "/" || location.pathname.startsWith('/home'),
  },
];

projectConfig.forEach(app => {
  registerApp(app);
});

start();
