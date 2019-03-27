/**
 * get\post 请求
 *  headers：Object，其中header必须全部小写
    options：fetch的init参数https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch
    silence：Boolean 失败时不弹出toast。默认false

    预防可能单独使用的情况，不写成vue
 */

import queryString from 'query-string';
import 'fetch-detector'

class CustomRequest{
    constructor(method, url, headers = {}){
        this.method = method || 'GET';
        this.request = null;
        this.url = url;
        this.queryString = '';
        this.body = null;
        this.headers = this.parseHeader(headers);
    }
    parseHeader(headers = {}){
        let requestHeaders = {
            'content-type': 'application/json',
            ...headers,
        }
        // 删除空的header，避免不必要的坑
        Object.keys(requestHeaders).forEach(header => {
            if(requestHeaders[header] === null || requestHeaders[header] === undefined) {
                delete requestHeaders[header];
            }
        })
        return requestHeaders;
    }
    getRequestUrl(){
        return this.url;
    }
    send({options = {}, silence = false} = {}){
        let url = this.url + (this.queryString ? '?' : '') + this.queryString;
        let response = this.parseResponse(fetch(url, {
            method: this.method,
            headers: this.headers,
            body: this.body,
            credentials: 'same-origin',
            ...options,
        })).catch(err => {
            !silence && window.__defaultRequestErrorHandle && window.__defaultRequestErrorHandle(err);
            throw err;
        }).finally(_ => {
            window.__defaultRequestLoadingEndHandle && window.__defaultRequestLoadingEndHandle();
        });
        response.loading = () => {
            window.__defaultRequestLoadingStartHandle && window.__defaultRequestLoadingStartHandle();
            return response;
        };
        response.success = (text, title) => {
            window.__defaultRequestLoadingSuccessHandle && window.__defaultRequestLoadingSuccessHandle(text, title);
            return response;
        };
        return response;
    }
    parseResponse(fetchPromise){
        return fetchPromise.then(res => {
            // status判断
            if (!res.status || res.status >= 300) {
                let error = new Error(res.statusText);
                error.res = res;
                throw error;
            }
            return res;
        }).then(res => {
            // 转json
            return res.json();
        }).then(rs => {
            // code or success
            if(!rs || rs.code === 0 || rs.success || rs.isSuccess) {
                return rs.data;
            }
            throw new Error(!rs && '' || rs.msg || rs.message);
        });
    }
}
class QueryBaseRequest extends CustomRequest{
    constructor(method, url, params, headers){
        super(method, url, headers);
        this.parseUrlAndParams(url, params);
    }
    parseUrlAndParams(url, params = {}){
        let [requestPath, requestQuery = ''] = url.split('#')[0].split('?');
        this.url = requestPath;
        this.query = Object.assign({}, queryString.parse(requestQuery), params);
        this.queryString = queryString.stringify(this.query);
    }
}
class BodyBaseRequest extends CustomRequest{
    constructor(method, url, body, headers){
        super(method, url, headers);
        this.parseBodyFromHeader(body, this.headers);
    }
    parseBodyFromHeader(body, headers){
        let requestBody;
        let contentType = headers['content-type'] || '';
        switch(true) {
            // application/json
            case contentType.indexOf('application/json') >= 0:
                requestBody = JSON.stringify(body);
                break;
            // application/x-www-form-urlencoded
            case contentType.indexOf('urlencoded') >= 0:
                requestBody = queryString.stringify(body);
                break;
            // multipart/form-data
            default:
                requestBody = new FormData();
                Object.keys(body || {}).forEach(key => {
                    requestBody.append(key, body[key]);
                });
                break;
        }
        this.body = requestBody;
    }
}

export function get(url = '', params = {}, opts = {}){
    return new QueryBaseRequest('GET', url, params, opts.headers).send(opts);
}

export function post(url = '', body = {}, opts = {}){
    return new BodyBaseRequest('POST', url, body, opts.headers).send(opts);
}
