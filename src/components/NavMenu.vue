<template>
  <el-row class="tac">
  <el-col :span="24">
    <el-menu
      class="el-menu-vertical-demo"
      router
      unique-opened
      @open="handleOpen"
      @close="handleClose"
      background-color="#fff"
      text-color="black"
      active-text-color="#F56C6C">
			<!--一级路由-->
			<el-menu-item v-if="item.componentName" v-for="item in menu" :index="item.componentName" :key="item.componentName">
        <template slot="title">
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

<style scoped>
  .over-hide{
    overflow: hidden;
  }
  .el-menu {
    border: none;
    margin-top: 20px;
  }
</style>

<script>
  import menu from '@/config/menu-config'

  export default {
    data () {
      return {
        menu: menu
      }
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