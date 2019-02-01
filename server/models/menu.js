const CollectionExtend = require('./index');

class Menu extends CollectionExtend{
    constructor(){
        super('manager', 'menu');
        this.setModel({
            // 自增id
            id          : this.Types.Number,
            // 菜单文字
            title       : this.Types.String,
            // 菜单链接
            url         : this.Types.String,
            // 父菜单，root为0
            parentId    : this.Types.Number,
            // 顺序
            sort        : this.Types.Number,
            // 备用
            type        : this.Types.Number,
            // 最后修改日期
            modify      : this.Types.Timestamp,
        });
    }
}

module.exports = new Menu;