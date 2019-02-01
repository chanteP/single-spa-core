/**
 * const client = new Client(MONGO_URL);
 * const collection = new Collection(db, table);
 * collection.init(client);
 */
const {MongoClient, ObjectId, Long} = require('mongodb');

/* 连接相关
-------------------------------------------------------------------------------- */
const STATUS = {
    PENDING: 0,
    CONNECTING: 1,
    CONNECT_FAIL: 2,
    CONNECTED: 3,
}

class Client{
    constructor(url = 'mongodb://127.0.0.1:27017', {
        config,                                 // connect config
    } = {}){
        this.url = url;
        this.client = null;

        this.status = this.STATUS.PENDING;
        this.connection = null;

        this.config = config;
        this.db = {};
    }
    async init(documents = []){
        await this.connect(this.url, this.config);
        await Promise.all(documents.map(this.use));
        return this;
    }
    async connect(url, config = {}){
        if(this.connection){
            return this.connection;
        }
        this.status = this.STATUS.CONNECTING;

        return this.connection = new Promise((res, rej) => {
            MongoClient.connect(url, Object.assign({useNewUrlParser: true}, config), (err, client) => {
                if(err){
                    this.status = this.STATUS.CONNECT_FAIL;
                    console.err("connection err:" , url, err);
                    return rej(err);
                }
                this.status = this.STATUS.CONNECTED;
                console.log("Connected successfully to server", url);
                this.client = client;
                res();
            });
        });
    }
    async use(dbName){
        await this.connect();
        return this.db[dbName] = this.db[dbName] || this.client.db(dbName);        
    }
    close(){
        this.client.close();
    }
}

Client.prototype.STATUS = STATUS;


/* 表相关
-------------------------------------------------------------------------------- */
class Collection{
    constructor(dbName, collectionName){
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.enableModel = false;
        this.model = null;
    }
    async init(client){
        this._client = client || this._client;
        this.client = await this._client.init();
        this.db = await this.client.use(this.dbName);
        this.collection = this.db.collection(this.collectionName);
    }
    async createIndex(...args){
        await this.init();
        this.collection.createIndex(...args);
    }
    setModel(model = {}){
        this.enableModel = true;
        this.model = model;
    }
    checkData(data = {}, cover = false){
        if(!this.enableModel){
            return data;
        }
        let rs = {};
        let model = this.model;
        let checkObj = cover ? model : data;
        Object.keys(checkObj).forEach(key => {
            if(Array.isArray(model[key])){
                // 枚举
                return rs[key] = model[key].contains(data[key]) ? data[key] : model[key][0];
            }
            if(typeof model[key] === 'function'){
                // 枚举
                return rs[key] = model[key](data[key]);
            }
            // 自由
            return rs[key] = data[key] || null;
        });
        return rs;
    }
    async count(filter = {}, options = {}){
        await this.init();
        return this.collection.countDocuments(filter, Object.assign({
            limit: 10000,
        }, options));
    }
    async find(filter = {}, options = {}){
        await this.init();
        return this.collection.find(filter, Object.assign({
            limit: 100,
        }, options)).toArray();
    }
    async insert(data, options = {}){
        if(!data){throw `insert data is required`;}
        await this.init();
        let method = Array.isArray(data) ? 'insertMany' : 'insertOne';
        data = Array.isArray(data) ? data.map(d => this.checkData(d, true)) : this.checkData(data, true);
        return this.collection[method](data, Object.assign({
        }, options));
    }
    async update(filter, data, options = {}){
        if(!filter){throw `update filter is required`;}
        if(!data){throw `update data is required`;}
        await this.init();
        let method = options.multiple ? 'updateMany' : 'updateOne';
        data = this.checkData(data, false);
        return this.collection[method](filter, {$set: data}, Object.assign({
        }, options));
    }
    async delete(filter, options = {}){
        if(!filter){throw `delete filter is required`;}
        await this.init();
        let method = options.multiple ? 'deleteMany' : 'deleteOne';
        return this.collection[method](filter, options);
    }
     
}



const Types = {
    String      : (value = '') => {return String(value)}, //字符串。存储数据常用的数据类型。在 MongoDB 中，UTF-8 编码的字符串才是合法的。
    Number      : (value = 0) => {return Number(value)}, //整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。
    Integer     : (value = 0) => {return Long(value)}, //整型数值。用于存储数值。根据你所采用的服务器，可分为 32 位或 64 位。
    Boolean     : (value = false) => {return Boolean(value)}, //布尔值。用于存储布尔值（真/假）。
    Double      : (value = 0) => {return Number(value)}, //双精度浮点值。用于存储浮点值。
    // Array       : (value = []) => {return Array.isArray(value) ? value : [value]}, //用于将数组或列表或多个值存储为一个键。
    Timestamp   : (value = Date.now()) => {return new Date(+value).getTime()}, //时间戳。记录文档修改或添加的具体时间。
    // Object      : (value) => {}, //用于内嵌文档。
    // Null        : (value) => {}, //用于创建空值。
    // Symbol      : (value) => {}, //符号。该数据类型基本上等同于字符串类型，但不同的是，它一般用于采用特殊符号类型的语言。
    Date        : (value = new Date()) => {return new Date(+value)}, //日期时间。用 UNIX 时间格式来存储当前日期或时间。你可以指定自己的日期时间,创建 Date 对象，传入年月日信息。
    // ObjectId    : (value) => {}, //对象 ID。用于创建文档的 ID。
    // Binary      : (value) => {}, //二进制数据。用于存储二进制数据。
    // Code        : (value) => {}, //代码类型。用于在文档中存储 JavaScript 代码。
    // Regular     : (value) => {}, //正则表达式类型。用于存储正则表达式。
    // Min/Max keys:将一个值与 BSON（二进制的 JSON）元素的最低值和最高值相对比。
}

Collection.prototype.Types = Types;

module.exports = {
    Client,
    Collection,
    ObjectId,
}

function wrapArray(data){
    if(!Array.isArray(data)){
        data = [data];
    }
    return data;
}

function wrapPromise(func, ...args){
    return new Promise((res, rej) => {
        func(...args, handleResult(res, rej));
    });
}

function handleResult(res, rej){
    return (err, rs) => {
        return err ? rej(err) : res(rs);
    }
} 
