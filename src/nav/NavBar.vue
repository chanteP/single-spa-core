<template>
    <div class="nav-menu">
        <ul class="menu-level" v-for="(menuLevel, i) in menuStack" :key="i">
            <li class="menu-item" v-for="menu in menuLevel" :class="{current: checkIsCurrent(i, menu.id)}" @click="setCurrent(menu)">{{`${menu.id} - ${menu.parentId}(${menu.children.length})`}}</li>
        </ul>
    </div>
</template>
<script>
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
                rs.unshift(cur.children || []);
                cur = this.menuMap[cur.parentId];
            }
            rs.unshift(this.menus);
            this.menuStack = rs;
        },
        matchCurrent(){
            this.setCurrent(null);
        },
        parseMenus(menus){
            let map = {};
            // root
            map[0] = {
                id: 0,
                children: [],
            };
            menus.forEach(menu => {
                map[menu.id] = menu;
                menu.children = [];
            });
            menus.forEach(menu => {
                let parent = menu.parentId && map[menu.parentId];
                if(!parent){return;}
                parent.children.push(menu);
            });
            return {tree: map[0].children, map};
            // return {tree: getMenu(10).children, map: map};
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
        url: "http://fasdfasdfasfd",
        _id: "5c5438c1bd4c49683bb4b7db",
        children: new Array(Math.floor(Math.random() * level)).fill(1).map(_ => getMenu(level - 1, id)),
    }
}
</script>
<style lang="scss">
.nav-menu{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
    
    .menu-level{
        position: fixed;
        left: 0;
        height: 100%;
        transition: all .3s ease;
        box-shadow: rgba(144,144,144,.3) 0 0 8px;
    }
    .menu-item{
        color: #333;
        border-bottom: 1px solid #333;
        &.current{
            background: rgba(0,0,0,.02);
        }
    }
    $level: 10;
    @while $level > 0 {
        .menu-level:nth-of-type(#{$level}){
            width: 100px;
            padding-left: #{100px * ($level - 1)};
            background: hsl(0, 0, 95% - 1% * $level);
            transform: translate(calc(-100% + 20px), 0);
            z-index: 11 - $level;
        }

        $level: $level - 1;
    }
    &:hover .menu-level{
        transform: translate(0, 0);
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
