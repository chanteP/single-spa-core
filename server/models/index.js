const {MONGO_URL} = require('../config');
const {Client, Collection, Types, ObjectId} = require('../utils/mongo');

const client = new Client(MONGO_URL);

class CollectionExtend extends Collection{
    constructor(...args){
        super(...args);
        this.init(client);
    }
}

module.exports = CollectionExtend;
