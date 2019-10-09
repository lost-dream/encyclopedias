<template>
  <el-row class="tac">
  <el-col :span="24">
    <el-menu
      router
      unique-opened
      @open="handleOpen"
      @close="handleClose"
      background-color="#212f54"
      text-color="white"
      active-text-color="#ffffff"
      :default-active="currentIndex">
			<!--一级路由-->
			<el-menu-item v-if="item.componentName" v-for="item in menu" :index="item.componentName" :key="item.componentName">
        <template slot="title">
        	<img style="margin-right: 10px;" :src="item.icon" alt="" />
          <span v-text="item.name"></span>
        </template>
      </el-menu-item>
			<!--二级路由-->
			<el-submenu v-if="item.id" v-for="item in menu" :index="item.id" :key="item.id">
        <template slot="title">
          <span v-text="item.name"></span>
        </template>
        <el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.componentName">
          <el-menu-item :index="sub.componentName" v-text="sub.name">
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
</el-row>
</template>

<style lang="scss" scoped>
  .over-hide{
    overflow: hidden;
  }
  .el-menu {
    border: none;
    margin-top: 15px;
    .el-menu-item {
      border-left: 5px solid rgba(0,0,0,0); 
    }
    .el-menu-item.is-active {
      background: rgba(0,0,0,.25) !important;
      border-left: 5px solid #337ab7 !important; 
    }
  }
  
</style>

<script>
  import menu from '@/config/menu-config'

  export default {
    data () {
      return {
        menu: menu,
        currentIndex: ''
      }
    },
    created(){
      this.currentIndex = this.$route.name;
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>