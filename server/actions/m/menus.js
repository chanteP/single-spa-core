const menu = require('../models/menu');



setTimeout(async _ => {

    await menu.insert({
        // // 菜单文字
        title       : '测试',
        // // 菜单链接
        url         : 'http://fasdfasdfasfd',
        type: 1,
        // // 父菜单，root为0
    }).catch(e => {
        debugger
        console.log(e)
    });    

    let arr = await menu.find();
    console.log(arr);

    console.log(await menu.count({type: 1}))
    
    // await menu.update({type: 1}, {type: 2}, {});

    // await menu.delete({}, {multiple: true});
    menu.client.close();
}, 0);