import { registerApplication, start } from 'single-spa';
import './frame/styles/style.css';
import './frame/utils';

registerApplication('nav', () => import('./src/nav/nav.app.js'), () => true);
registerApplication('home', () => import('./src/home/home.app.js'), (location) => location.pathname === "" || location.pathname === "/" || location.pathname.startsWith('/home'));

window.loadApp = (app) => {
  registerApplication(app, () => import(`./src/${app}/${app}.app.js`), pathPrefix(`/${app}`));
}

start();

function pathPrefix(prefix) {
  return function (location) {
    return location.pathname.startsWith(`${prefix}`);
  }
}
