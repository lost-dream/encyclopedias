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
          <el-menu-item :key="index" :index="item.componentName">
            <!-- <el-menu-item
            :key="index"
            v-if="menuMap.includes(item.value)"
            :index="item.componentName"
          > -->
            <!-- TODO 后台管理侧边栏 -->
            <template slot="title">
              <img style="margin-right: 10px;" :src="item.icon" alt="" />
              <span v-text="item.title"></span>
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

export default {
  data() {
    return {
      menu: [
        {
          title: '词条分类维护',
          icon: require('./yingyongguanli.png'),
          value: 'citiaofenleiweihu',
          componentName: 'categoryManage'
        },
        {
          title: '属性模板管理',
          icon: require('./Management.png'),
          value: 'shuxingmubanguanli',
          componentName: 'classifyManager'
        },
        {
          title: '目录模板管理',
          icon: require('./caidanguanli.png'),
          value: 'mulumubanguanli',
          componentName: 'contentTemplate'
        },
        {
          title: '词条版本审核',
          icon: require('./bianji.png'),
          value: 'citiaobanbenshenhe',
          componentName: 'entryVersionExamine'
        },
        {
          title: '特色专题管理',
          icon: require('./dangan.png'),
          value: 'tesezhuantiguanli',
          componentName: 'specialManager'
        },
        {
          title: '提取任务管理',
          icon: require('./tiqurenwu.png'),
          value: 'tiqurenwuguanli',
          componentName: 'extractTask'
        },
        {
          title: '抽取词条审核',
          icon: require('./wangluo.png'),
          value: 'chouqucitiaoshenhe',
          componentName: 'entryExamine'
        },
        {
          title: '数据源管理',
          icon: require('./jigouguanli.png'),
          value: 'shujuyuanguanli',
          componentName: 'dataSourceList'
        },
        {
          title: '爬虫任务管理',
          icon: require('./entity.png'),
          value: 'pachongguanli',
          componentName: 'reptileData'
        }
      ],
      menuMap: JSON.parse(sessionStorage.getItem('user-menu')), // 用来存储有权限展示的 menuList
      currentIndex: ''
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created() {
    this.currentIndex = this.$route.name
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
