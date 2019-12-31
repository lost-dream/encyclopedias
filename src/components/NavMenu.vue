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
          <el-menu-item
            :key="index"
            v-if="menuMap.includes(item.value)"
            :index="item.componentName"
          >
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
import { getMenuTree } from '@/api/user'

export default {
  data() {
    return {
      menu: [
        {
          title: '属性模板管理',
          icon: require('./Management.png'),
          value: 'shuxingmubanguanli',
          componentName: 'classifyManager'
        },
        {
          title: '词条版本审核',
          icon: require('./bianji.png'),
          value: 'citiaobanbenshenhe',
          componentName: 'entryVersionExamine'
        },
        {
          title: '数据源管理',
          icon: require('./jigouguanli.png'),
          value: 'shujuyuanguanli',
          componentName: 'dataSourceList'
        },
        {
          title: '抽取词条审核',
          icon: require('./wangluo.png'),
          value: 'chouqucitiaoshenhe',
          componentName: 'entryExamine'
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
          title: '目录模板管理',
          icon: require('./caidanguanli.png'),
          value: 'mulumubanguanli',
          componentName: 'contentTemplate'
        },
        {
          title: '词条分类维护',
          icon: require('./yingyongguanli.png'),
          value: 'citiaofenleiweihu',
          componentName: 'categoryManage'
        }
      ],
      menuMap: [], // 用来存储有权限展示的 menuList
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
    getMenuTree({
      Authorization: sessionStorage.getItem('token')
    }).then(res => {
      if (res.status === 0) {
        const data = res.data
        if (!(data.authTree && data.authTree.menu)) {
          // empty data
          this.$message({
            message: '目录列表暂无数据',
            type: 'warning'
          })
        } else {
          // 获取后台返回数据，只取用来判断权限的字段值（example:value）插入 map 中，用来判断本地 menu 是否有权限显示出来
          const backendData = data.authTree.menu
          let backendMenu
          backendData.map(value => {
            if (value.name === '后台') {
              backendMenu = value.childrenMenu
            }
          })

          this.menuMap = backendMenu.reduce((arr, menuItem) => {
            arr.push(menuItem.value)
            return arr
          }, [])
        }
      } else {
        this.$message.error(res.msg)
      }
    })
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
