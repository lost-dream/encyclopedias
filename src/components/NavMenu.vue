<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        router
        unique-opened
        @open="handleOpen"
        @close="handleClose"
        background-color="#5b7dd8"
        text-color="white"
        active-text-color="#ffffff"
        :default-active="currentIndex"
      >
        <!--一级路由-->
        <template v-for="(item, index) in menu">
          <el-menu-item :key="index" v-if="item.componentName" :index="item.componentName">
            <template slot="title">
              <img style="margin-right: 10px;" :src="item.icon" alt="" />
              <span v-text="item.name"></span>
            </template>
          </el-menu-item>
        </template>

        <!--二级路由-->
        <template v-for="(item, index) in menu">
          <el-submenu :key="index" v-if="item.id" :index="item.id">
            <template slot="title">
              <span v-text="item.name"></span>
            </template>
            <el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.componentName">
              <el-menu-item :index="sub.componentName" v-text="sub.name"> </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import menu from '@/config/menu-config'

export default {
  data() {
    return {
      menu: menu,
      currentIndex: ''
    }
  },
  created() {
    this.currentIndex = this.$route.name
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.over-hide {
  overflow: hidden;
}
.el-menu {
  border: none;
  margin-top: 15px;
  .el-menu-item {
    border-left: 5px solid rgba(0, 0, 0, 0);
    font-size: 24px;
  }
  .el-menu-item.is-active {
    background: #2a4da9 !important;
    border-left: 5px solid #337ab7 !important;
  }
  .el-submenu__title:hover {
    background-color: #2a4da9 !important;
  }
  .el-menu-item:hover {
    background-color: #2a4da9 !important;
  }
}
</style>
