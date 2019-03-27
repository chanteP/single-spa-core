<template>
    <div class="nav-wrap">
        <NavMenu />
    </div>
</template>
<script>
import NavMenu from './NavMenu.vue';
export default {
    components: {
        NavMenu,
    },
    data(){
        return {
        };
    },
    created(){
    },
    mounted(){
    },
    methods: {
    },
}
</script>
<style lang="scss">
.nav-wrap{
    position: relative;
    z-index: 99;
}
</style>
