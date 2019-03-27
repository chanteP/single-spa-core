const koa = require('koa');
const fs = require('fs');

const app = new koa;

app.use((ctx, next) => {
    console.log(ctx.path);
    if(ctx.path === '/'){
        ctx.body = fs.readFileSync('./index.html', 'utf-8');
    }
    else{
        ctx.body = fs.readFileSync(`.${ctx.path}`, 'utf-8');
    }
});

app.listen(9999);

