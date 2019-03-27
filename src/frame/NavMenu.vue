<template>
    <div class="nav-menu">
        <ul class="menu-level" v-for="(menuLevel, i) in menuStack" :key="i">
            <li class="menu-item" v-for="menu in menuLevel" :class="{current: checkIsCurrent(i, menu.id)}" @click="onClick(menu)">
                {{`${menu.id} - ${menu.parentId}(${menu.children.length})`}}
            </li>
        </ul>
    </div>
</template>
<script>
import {navigateToUrl} from 'single-spa';
export default {
    data(){
        return {
            menus: [],
            menuStack: [],
            menuMap: {},
            current: null,
        };
    },
    created(){
        this.fetchMenus();
    },
    mounted(){
    },
    methods: {
        async fetchMenus(){
            let menus = await $get('/api/m/storage/list?db=manager&table=menu').loading();
            let {tree, map} = this.parseMenus(menus || []);
            this.menus = tree;
            this.menuMap = map;
            this.matchCurrent();
        },
        checkIsCurrent(stackIndex, id){
            return this.menuStack[stackIndex + 1] && this.menuStack[stackIndex + 1][0] && this.menuStack[stackIndex + 1][0].parentId === id;
        },
        setCurrent(node){
            this.current = node;
            this.setMenuStack();
        },
        setMenuStack(){
            let rs = [];
            let cur = this.current;
            while(cur && cur.parentId){
                cur.children.length && rs.unshift(cur.children);
                cur = this.menuMap[cur.parentId];
            }
            rs.unshift(this.menus);
            this.menuStack = rs;
        },
        matchCurrent(){
            let path = location.pathname;
            let matchMenu = null;
            Object.values(this.menuMap).forEach(menu => {
                if(menu.url && path.indexOf(menu.url) === 0 && (!matchMenu || matchMenu.url.length < menu.length)){
                    matchMenu = menu;
                }
            });
            this.setCurrent(matchMenu);
        },
        onClick(menu){
            menu.url && navigateToUrl(menu.url);
            this.setCurrent(menu);
        },
        parseMenus(menus){
            // let map = {};
            // // root
            // map[0] = {
            //     id: 0,
            //     children: [],
            // };
            // menus.forEach(menu => {
            //     map[menu.id] = menu;
            //     menu.children = [];
            // });
            // menus.forEach(menu => {
            //     let parent = menu.parentId && map[menu.parentId];
            //     if(!parent){return;}
            //     parent.children.push(menu);
            // });
            // return {tree: map[0].children, map};
            return {tree: getMenu(10).children, map: map};
        },
    },
}
let i = 1;
let map = {};
function getMenu(level = 10, parentId = 0){
    let id = i++;
    return map[id] = {
        id: id,
        modify: 1549023425812,
        parentId: parentId,
        sort: 0,
        title: "测试",
        type: 1,
        url: "/fsdfsdfs",
        _id: "5c5438c1bd4c49683bb4b7db",
        children: new Array(Math.floor(Math.random() * level)).fill(1).map(_ => getMenu(level - 1, id)),
    }
}
</script>
<style lang="scss">
.nav-menu{
    .menu-level{
        box-sizing: border-box;
        position: fixed;
        left: 0;
        padding-top: 40px;
        height: 100vh;
        overflow: auto;
        border-right: 1px solid transparent;
        transition: all .3s ease 0.3s;
        box-shadow: rgba(144,144,144,.3) 0 0 8px;
        ::-webkit-scrollbar{
            display: none;
            visibility: hidden;
        }
    }
    .menu-item{
        padding: 16px 20px 16px 8px;
        color: #333;
        border-bottom: 1px solid transparent;
        transition: all .2s ease;
        font-size: 14px;
        cursor: pointer;
        &.current{
            color: #fff;
            // background: rgba(33,33,33,.8);
        }
        &:hover{
            background: rgba(33,33,33,.2);
        }
    }
    $level: 10;
    @while $level > 0 {
        .menu-level:nth-of-type(#{$level}){
            width: 100px;
            margin-left: #{100px * ($level - 1)};
            background: hsl(0, 0, 95% + 1% * $level);
            border-right-color: hsl(0, 0, 85% + 1% * $level);
            transform: translate(calc(#{$level * -100%} + 20px), 0);
            z-index: 11 - $level;
            .menu-item{
                border-bottom-color: hsl(0, 0, 85% + 1% * $level);
                &.current{
                    background: hsl(0, 0, 25% + 6% * $level);
                }
            }
        }

        $level: $level - 1;
    }
    &:not(.hide):hover .menu-level{
        transform: translate(0, 0);
        transition-delay: 0s;
    }
    
    .slide-enter-active, .slide-leave-active {
        transform: translate(0, 0);
    }
    .slide-enter, .slide-leave-to {
        transform: translate(calc(-100% + 20px), 0);
    }
}
.app-wrapper{
    margin-left: 20px;
}
</style>
