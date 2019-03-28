<template>
    <div class="nav-menu" ref="nav" @mouseleave="onMouseLeave" @mouseenter="onMouseenter">
        <ul class="menu-level" v-for="(menuLevel, i) in (selectedStack.length ? selectedStack : menuStack)" :key="i">
            <li></li>
            <li class="menu-item" v-for="menu in menuLevel" :class="checkMenuStyle(i, menu.id)" @click="onClick(menu)">
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
            menuMap: {},
            menuStack: [],
            selectedStack: [],
            current: null,
            selected: null,
        };
    },
    created(){
        this.fetchMenus();
    },
    mounted(){
        setInterval(_ => {
            console.log(this.showStack === this.selectedStack, this.currentId, this.showStack)
        }, 1000);
    },
    computed: {
        currentId(){
            return this.current && this.current.id;
        },
        selectedId(){
            return this.selected && this.selected.id;
        },
        showStack(){
            return this.selectedStack.length ? this.selectedStack : this.menuStack;
        },
    },
    methods: {
        async fetchMenus(){
            let menus = await $get('/api/m/storage/list?db=manager&table=menu').loading();
            let {tree, map} = this.parseMenus(menus || []);
            this.menus = tree;
            this.menuMap = map;
            this.matchCurrent();
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
        checkMenuStyle(stackIndex, id){
            let currentLevelId = this.menuStack[stackIndex + 1] && this.menuStack[stackIndex + 1][0] && this.menuStack[stackIndex + 1][0].parentId;
            let selectedLevelId = this.selectedStack[stackIndex + 1] && this.selectedStack[stackIndex + 1][0] && this.selectedStack[stackIndex + 1][0].parentId;
            return {
                current: this.currentId === id || currentLevelId === id,
                selected: this.selectedId === id || selectedLevelId === id,
            };
        },
        setCurrent(node){
            this.current = node;
            this.menuStack = this.getMenuStack(this.current);
        },
        setSelected(node){
            this.selected = node;
            this.selectedStack = this.getMenuStack(this.selected);
        },
        getMenuStack(node){
            let rs = [];
            while(node && node.parentId){
                node.children.length && rs.unshift(node.children);
                node = this.menuMap[node.parentId];
            }
            rs.unshift(this.menus);
            return rs;
        },
        onClick(menu){
            if(!menu.children.length){
                navigateToUrl(menu.url);
                this.setCurrent(menu);
                this.$refs.nav.classList.add('hide');
            }
            else{
                this.setSelected(menu);
            }
        },
        onMouseenter(){
            clearTimeout(this.hideTimer);
            this.$refs.nav.classList.remove('hide');
        },
        onMouseLeave(){
            this.hideTimer = setTimeout(_ => {
                this.setSelected(null);
            }, 500);
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
        url: `/page_${id}`,
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
        height: 100vh;
        overflow: auto;
        border-right: 1px solid transparent;
        transition: all .3s ease 0.5s;
        box-shadow: rgba(144,144,144,.3) 0 0 8px;
        ::-webkit-scrollbar{
            display: none;
            visibility: hidden;
        }
        li:first-child{
            height: 100px;
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
    $first-nav-width: 160px;
    $common-nav-width: 100px;
    $show-nav-width: 20px;
    @while $level > 0 {
        .menu-level:nth-of-type(#{$level}){
            width: $common-nav-width;
            margin-left: #{$common-nav-width * ($level - 2) + $first-nav-width};
            background: hsl(0, 0, 95% + 1% * $level);
            border-right-color: hsl(0, 0, 85% + 1% * $level);
            transform: translate(calc(#{$level * -100%} + #{$show-nav-width - $first-nav-width + $common-nav-width}), 0);
            z-index: 11 - $level;
            .menu-item{
                border-bottom-color: hsl(0, 0, 85% + 1% * $level);
                &.selected{
                    background: rgba(144, 144, 200, .6 - 0.08 * $level);
                }
                &.current{
                    background: hsl(0, 0, 25% + 6% * $level);
                }
            }
        }

        $level: $level - 1;
    }
    .menu-level:nth-of-type(1){
        width: $first-nav-width;
        margin-left: 0;
        transform: translate(calc(-100% + #{$show-nav-width}), 0);
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
