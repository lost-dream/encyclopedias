<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { userLogin, getMenuTree } from '@/api/user'

export default {
  name: 'app',
  methods: {
    isLogin() {
      const DURATION_TIME = 2500
      const $this = this
      if (!sessionStorage.getItem('token')) {
        this.$message.error('你还没有登录')
        setTimeout(() => {
          window.location.href = baseUrlConfig.LOGIN_URL
        }, DURATION_TIME)
      } else {
        const token = sessionStorage.getItem('token')
        ;(async function getUserInfo() {
          // 保存登录用户信息
          await userLogin({
            Authorization: token
          }).then(res => {
            if (res.status === 'success') {
              sessionStorage.setItem('user', JSON.stringify(res.data))
            }
          })
          // 获取后台管理页可用的目录列表
          await getMenuTree({
            Authorization: token
          }).then(res => {
            if (res.status === 0) {
              const data = res.data
              if (!(data.authTree && data.authTree.menu)) {
                // empty data
                $this.$message({
                  message: '目录列表暂无数据',
                  type: 'warning'
                })
              } else {
                // 取用来判断目录权限的字段值（example:value）插入 map 中，用来判断本地 menu 是否有权限显示出来；取判断读取内部词条权限的字段，判断用户是否有资格操作内部词条（有：nbtc: 0;无：nbtc: 1）
                const backendData = data.authTree.menu
                let backendMenu,
                  backendEntry = '1'
                backendData.map(value => {
                  if (value.name === '后台') {
                    backendMenu = value.childrenMenu

                    const menuMap = backendMenu.reduce((arr, menuItem) => {
                      arr.push(menuItem.value)
                      return arr
                    }, [])

                    sessionStorage.setItem('user-menu', JSON.stringify(menuMap))
                  }
                  if (value.name.includes('内部词条')) {
                    backendEntry = '0'
                  }
                })

                sessionStorage.setItem('nbct', backendEntry)
              }
            } else {
              this.$message.error(res.msg)
            }
          })
        })()
      }
    }
  },
  mounted() {
    Cetc10Auth().init(() => {
      // TODO 手动添加 token，部署删掉
      sessionStorage.setItem('token', 'bbb')

      this.isLogin()
    })
  }
}
</script>

<style lang="scss">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: none !important;
}
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before {
  display: none;
}

.el-pagination {
  .el-input__inner {
    height: 28px !important;
    line-height: 28px !important;
  }
}
.el-input__inner {
  height: 50px !important;
  line-height: 50px !important;
}
.el-table {
  font-size: 26px !important;
}
.address-list-li,
/deep/ .transfer-title {
  font-size: 26px !important;
}
.el-cascader-panel {
  .el-cascader-node__label {
    font-size: 26px !important;
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    font-size: 26px !important;
    line-height: 50px !important;
    height: 50px !important;
  }
}

.el-tabs--left .el-tabs__active-bar.is-left {
  left: 0 !important;
  right: auto !important;
  width: 4px !important;
}
.ck-content .table table {
  border-collapse: collapse;
  margin-bottom: 10px;
  td {
    border: 1px solid #e2e5f3;
    padding: 9px 15px 7px;
    text-align: left;
    word-wrap: break-word;
    word-break: break-all;
    font-weight: normal;
    font-size: 13px;
    line-height: 1.5;
    b {
      font-weight: normal;
    }
  }
  th {
    background: #f7fbff;
    border-bottom-width: 2px;
    font-weight: 400;
    font-size: 15px;
    font-family: arial, 'pingfang sc', stheiti, 'microsoft yahei', sans-serif;
  }
}
.el-card.is-always-shadow {
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.1) !important;
}
.el-card__body {
  padding: 15px !important;
  background: #f6fafb;
  position: relative;
}
.ck-editor__editable {
  min-height: 100px;
  width: 700px;
}
#editor {
  min-height: 200px;
  width: 880px;
}
/*--------------------全局样式-------------------------------------------*/
/*分页居中*/
.el-pagination {
  margin-top: 40px;
  text-align: center;
}
/*表格文字居中*/
.departTable {
  &/deep/ .cell {
    text-align: center;
  }
}
/*列表暂无数据*/
.noDataRemindContent {
  text-align: center;
  padding: 20px 0;
}
/*我的表单*/
.myForm {
  .el-form-item__label {
    padding: 0;
  }
}

/*我的分类树*/
.myTree {
  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  .el-tree-node__content {
    padding-left: 4px !important;
  }
  .el-tree-node__children {
    padding-left: 16px;
  }
  .el-tree-node__label {
    padding-left: 4px;
  }
  .el-tree-node :last-child:before {
    height: 38px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node:before,
  .el-tree-node:after {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  .el-tree-node:before {
    border-left: 1px solid #459df6;
    bottom: 0;
    height: 100%;
    top: -20px;
    width: 1px;
  }
  .el-icon-caret-right:before {
    content: '\e6d9';
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    border: 1px solid #459df6;
    padding: 1px;
    color: #459df6;
  }
  .el-tree-node__content > .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    border: none;
    padding: 0;
    display: none;
  }
  .el-tree-node:after {
    border-top: 1px solid #459df6;
    height: 20px;
    top: 17px;
    width: 24px;
  }
}
/*--------------------全局样式-------------------------------------------*/
.header {
  line-height: 60px;
  height: auto !important;
  box-shadow: 0 0 5px 0 #8e8e8e;
}
html,
body,
#app {
  font-family: '仿宋', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
h2 {
  font-weight: 400;
  color: #1f2f3d;
}

ul,
ol,
li,
p {
  list-style: none;
  margin: 0;
  padding: 0;
}

.height-100 {
  height: 100%;
}
.bg-fff {
  background: #ffffff;
}

.ck-summary .image-style-align-center:not(.image_resized),
.ck-summary .image-style-align-left:not(.image_resized),
.ck-summary .image-style-align-right:not(.image_resized),
.ck-summary .image-style-side:not(.image_resized) {
  max-width: 35% !important;
}

// 词条详情里正文的样式
.ck-content p {
  line-height: 1.6;
  font-size: 26px;
  text-indent: 2em;
  margin-bottom: 0.5em;
}

.ck-content .para {
  line-height: 1.5;
  font-size: 26px;
  text-indent: 2em;
  margin-bottom: 0.5em;
}

// 词条详情里正文的样式结束

.el-collapse-item__header {
  /*background: #eeeeee !important;*/
  display: block !important;
  text-align: right;
  color: rgb(51, 140, 230) !important;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-wrap: break-word;
}
.ellipsis1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  word-wrap: break-word;
}
.ellipsis3 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  word-wrap: break-word;
}
.main-content {
  line-height: 1.5;
}
.w800 .el-carousel__item--card.is-active {
  transform: translateX(200px) scale(0.83) !important;
}
.cat-img > img {
  width: 150px;
}
.el-carousel__indicators--horizontal > .is-active > button {
  background: #4c83c9;
}
.el-carousel__indicators--horizontal > li > button {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #c5c9ca;
  margin-top: 10px;
}
#special-carousel ul {
  display: none !important;
}
.category-container .el-loading-mask {
  background: none !important;
}
</style>
