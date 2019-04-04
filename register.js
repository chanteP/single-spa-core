import * as singleSpa from 'single-spa';

// pushState 模式
export function pathPrefix(app) {
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
export async function registerApp(params) {
    singleSpa.registerApplication(
        params.name, 
        () => typeof params.main === 'string' ? System.import(params.main) : Promise.resolve(params.main),
        params.base ? (() => true) : pathPrefix(params)
    );

}
