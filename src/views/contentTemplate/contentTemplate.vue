<template>
  <div class="pos-rltv  bg-fff">
    <h2 class="page-title">
      <span>目录模板管理</span>
    </h2>
    <div class="flex-box">
      <div class="left myTree1" v-loading="isLoading">
        <h3>外部词条</h3>
        <el-tree :data="categoryTree" :props="categoryProps" @node-click="selectCategory"></el-tree>
        <h3 v-if="permission === '0'">内部词条</h3>
        <el-tree v-if="permission === '0'" :data="innerTree" :props="categoryProps" @node-click="selectCategory"></el-tree>
      </div>

      <div v-show="showContent" v-loading="rightLoading" class="comp-tree">
        <h3>目录模板</h3>
        <div class="sub-box">
          <p>当前分类： {{ currentCategory.name }}</p>
          <el-button
            style="background: #ef5d5d !important;color: white;"
            class="add-top"
            type="primary"
            size="small"
            @click="handleAddTop"
            >添加一级目录<i class="el-icon-plus el-icon--right"></i
          ></el-button>
        </div>
        <!-- tree -->
        <div class="myTree">
          <el-tree
            ref="SlotTree"
            :data="setTree"
            :props="defaultProps"
            :expand-on-click-node="false"
            highlight-current
            :node-key="NODE_KEY"
            @node-click="selectTreeNode"
          >
            <div class="comp-tr-node" slot-scope="{ node, data }">
              <!-- 编辑状态 -->
              <template v-if="node.isEdit">
                <el-input
                  v-model="data.contentName"
                  autofocus
                  size="mini"
                  :ref="'slotTreeInput' + data[NODE_KEY]"
                  @blur.stop="handleInput(node, data)"
                  @keyup.enter.native="handleInput(node, data)"
                ></el-input>
              </template>

              <!-- 非编辑状态 -->
              <template v-else>
                <!-- 名称： 新增节点增加class（is-new） -->
                <span
                  :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']"
                >
                  <i class="el-icon-folder el-icon--left"></i>
                  {{ node.label }}
                </span>

                <!-- 按钮 -->
                <!--<span class="comp-tr-node--btns">
	                <el-button icon="el-icon-plus" 
	                  size="mini"
	                  circle 
	                  type="primary" 
	                  title="新增"
	                  @click="handleAdd(node, data)"></el-button>
	                <el-button icon="el-icon-edit" 
	                  size="mini"
	                  circle 
	                  type="info" 
	                  title="修改"
	                  @click="handleEdit(node, data)"></el-button>
	                <el-button icon="el-icon-delete" 
	                  size="mini"
	                  circle 
	                  type="danger" 
	                  title="删除"
	                  @click="handleDelete(node, data)"></el-button>
	              </span>-->
                <!--换成弹窗形式-->
                <span class="comp-tr-node--btns" v-show="currentNode == data.id">
                  <i class="el-icon-caret-left el-icon--left"></i>
                  <span class="btn" @click="handleAdd(node, data)">添加子目录</span>
                  <span class="btn" @click="handleEdit(node, data)">修改目录</span>
                  <span class="btn" @click="handleDelete(node, data)">删除目录</span>
                </span>
              </template>
            </div>
          </el-tree>
        </div>
        <div style="text-align: center;padding-bottom: 100px;" class="button-box">
          <el-button
            style="background: #cccccc !important;color: black;border: none;margin-right: 40px;"
            @click="dialogVisible = true"
            type="primary"
            >取消</el-button
          >
          <el-button
            style="background: #587dda !important;color: white;"
            type="success"
            :loading="saveLoading"
            @click="saveContent"
            >保存</el-button
          >
        </div>
      </div>
    </div>
    <!--是否取消修改弹窗-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定取消修改？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancelModify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import templateApi from '@/api/contentTemplate'
import categoryApi from '@/api/categoryManager'
import { getInternalEntryList } from '@/api/classifyManager'
import _ from 'lodash'

export default {
  name: 'contentTemplate',
  data() {
    return {
      permission: sessionStorage.getItem('nbct'), // 判断权限   0 -- 内部人员  1 -- 外部人员
      dialogVisible: false,
      indexOfNew: 0, // 未命名新增文件夹个数
      isLoading: false, // 是否加载
      rightLoading: false,
      setTree: [], // 目录树
      categoryTree: [], // 外部词条目录
      innerTree: [], // 内部词条目录
      NODE_KEY: 'categoryId', // id对应字段
      MAX_LEVEL: 3, // 设定最大层级    todo: 确认最大级别
      NODE_ID_START: 0, // 新增节点id，逐次递减
      // startId: null,
      defaultProps: {
        // 默认设置
        children: 'children',
        label: 'contentName'
      },
      categoryProps: {
        children: 'children',
        label: 'name'
      },
      dialogFormVisible: false, // diag可见性
      initParam: {
        // 新增参数
        id: '',
        contentName: '新增目录',
        children: []
      },
      showContent: false,
      saveLoading: false,
      currentCategory: {},
      currentNode: ''
    }
  },
  created() {
    // 初始值
    this.startId = this.NODE_ID_START
    this.indexOfNew = 0
    this.getCategoryTreeData()
  },
  methods: {
    //撤销修改(重新请求数据，不清空已保存数据)
    cancelModify() {
      this.dialogVisible = false
      this.checkTemplateTreeData(this.currentCategory.id)
    },
    handleDelete(_node, _data) {
      // 删除节点
      console.log(_node, _data)
      // 判断是否存在子节点
      if (_data.children && _data.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 删除操作
        let DeletOprate = () => {
          this.$nextTick(() => {
            if (this.$refs.SlotTree) {
              this.$refs.SlotTree.remove(_node)
              // this.$message.success("删除成功！")
            }
          })
        }
        // 二次确认
        let ConfirmFun = () => {
          this.$confirm('是否删除此目录？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              DeletOprate()
            })
            .catch(() => {})
        }
        // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        _data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
      }
    },
    handleInput(_node, _data) {
      // 修改节点
      // console.log(_node, _data)
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },
    handleEdit(_node, _data) {
      // 编辑节点
      // console.log(_node, _data)
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs['slotTreeInput' + _data[this.NODE_KEY]].$refs.input.focus()
        }
      })
    },
    handleAdd(_node, _data) {
      // 新增节点
      // console.log(_node, _data)
      // 判断层级
      if (_node.level >= this.MAX_LEVEL) {
        this.$message.warning('当前已达到' + this.MAX_LEVEL + '级，无法新增！')
        return false
      }
      // 参数修改
      this.indexOfNew += 1
      this.initParam.id = this.indexOfNew
      let obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      // obj.pid = _data[this.NODE_KEY];// 父id
      // obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
      // 判断字段是否存在
      if (!_data.children) {
        this.$set(_data, 'children', [])
      }
      // 新增数据
      _data.children.push(obj)
      // 展开节点
      if (!_node.expanded) {
        _node.expanded = true
      }
    },
    handleAddTop() {
      // 添加顶部节点
      this.indexOfNew += 1
      this.initParam.id = this.indexOfNew
      let obj = JSON.parse(JSON.stringify(this.initParam)) // copy参数
      // obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
      this.setTree.push(obj)
    },
    // 获取外部词条目录
    getCategoryTreeData() {
      this.isLoading = true
      categoryApi
        .getTreeData()
        .then(res => {
          if (res.status === 'success') {
            let data = res.data && (_.cloneDeep(res.data.children) || [])
            this.categoryTree = data
            this.fromData = data

            let first = data[0].children.length
              ? data[0].children[0].children.length
                ? data[0].children[0].children[0]
                : data[0].children[0]
              : data[0]
            this.selectCategory(first)

            if (this.permission === '0') {
              this.getInnerTreeData()
            } else {
              this.isLoading = false
            }
          } else {
            this.$message.error('获取分类信息失败，请稍后重试！')
          }
        })
        .catch(err => {
          this.$message.error(`请求出错，错误原因: ${err.msg ? err.msg : JSON.stringify(err)}`)
        })
    },
    // 获取内部词条目录
    getInnerTreeData() {
      getInternalEntryList().then(res => {
          if (res.status === 'success') {
            let data = res.data && (_.cloneDeep(res.data.children) || [])
            this.innerTree = data
            // this.fromData = data
            this.isLoading = false

            // let first = data[0].children.length
            //   ? data[0].children[0].children.length
            //     ? data[0].children[0].children[0]
            //     : data[0].children[0]
            //   : data[0]
            // this.selectCategory(first)
          } else {
            this.$message.error('获取分类信息失败，请稍后重试！')
          }
        })
        .catch(error => {
          this.$message.error(`请求出错，错误原因: ${error.msg ? error.msg : JSON.stringify(error)}`)
        })
    },
    // 获取templateTree数据
    checkTemplateTreeData(id) {
      this.rightLoading = true
      templateApi
        .checkTemplateTreeData({
          id: id
        })
        .then(res => {
          // console.log(res);
         if (res.data ) {
           this.setTree = res.data
         } else {
           this.setTree = []
         }
          this.rightLoading = false
        })
        .catch(e => {
          this.$message.error('请求出错，错误原因： ' + e.msg ? e.msg : JSON.stringify(e))
          this.rightLoading = false
        })
    },
    // 处理选择分类事件
    selectCategory(data) {
      // console.log(data, node, component);
      let request = !data.children.length

      if (request) {
        this.showContent = true
        this.rightLoading = true
        this.currentCategory = data
        this.checkTemplateTreeData(data.id)
      }
    },
    // 保存函数
    saveContent() {
      let vm = this
      this.saveLoading = true
      console.log(this.setTree)
      templateApi
        .saveTemplate({
          categoryId: this.currentCategory.id,
          content: this.setTree
        })
        .then(res => {
          this.$message.success('保存成功！')
          this.saveLoading = false
          console.log(res)
        })
        .catch(e => {
          this.$message.error('请求出错，错误原因： ' + e.msg ? e.msg : JSON.stringify(e))
        })
    },
    selectTreeNode(obj) {
      // console.log('test',obj,node,vue_comp);
      this.currentNode = this.currentNode == obj.id ? '' : obj.id
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-icon-folder {
  font-size: 16px;
  margin-right: -10px;
  margin-left: 5px;
  vertical-align: top;
  margin-top: 12px;
}
/* common */
// 显示按钮
.show-btns {
  opacity: 1;
}
.pos-rltv {
    height: 100%;
  position: relative;
}
.padding-20 {
  padding: 20px;
}
.diag-btn {
  margin-left: 300px;
}
.el-cascader {
  display: block;
}
.el-form {
  width: 85%;
  margin: 0 auto;
}
.page-title {
  margin: 0;
  padding: 10px 10px 10px 0;
  border-bottom: 10px solid #f6fafb;
  font-size: 20px;
  font-weight: bold;
  span {
    border-left: 5px solid #007fff;
    padding-left: 15px;
  }
}
/* common end */

.comp-tree {
  // position: absolute;
  display: inline-block;
  vertical-align: top;
  width: 100%;
  max-width: 300px;
  /*max-height: 80vh;*/
  overflow: visible;

  // 顶部按钮
  .comp-tr-top {
    width: 100px;
  }
  // 自定义节点
  .comp-tr-node {
    // label
    .comp-tr-node--name {
      display: inline;
      line-height: 40px;
      min-height: 40px;
      // 新增
      &.is-new {
        font-weight: bold;
      }
    }
    // button
    .comp-tr-node--btns {
      position: absolute;
      /*right: 0;*/
      top: 0;
      z-index: 999;
      background: #5b7dd7;
      padding: 0 20px;
      margin-left: 20px;
      // opacity: 0;
      transition: opacity 0.1s;
      .el-button {
        transform: scale(0.8); // 缩小按钮
        & + .el-button {
          margin-left: -1px;
        }
      }
      /deep/ .el-icon-caret-left {
        color: #5b7dd7;
        position: absolute;
        left: -16px;
        top: 5px;
      }
      .btn {
        display: block;
        color: white;
        line-height: 50px;
      }
    }
  }
}

.flex-box {
  display: flex;
  height: calc(100% - 80px);

  .el-tree-node__content {
    height: 28px;
  }
  .left {
    width: 300px;
    height: calc(100% - 52px);
    background: #fff;
    overflow: auto;
    padding: 0 16px;
    position: absolute;
    box-sizing: border-box;
    border-right: 10px solid #f6fafb;
  }

  h3 {
    font-weight: 400;
    font-size: 26px;
    margin: 0;
    padding: 24px 0 10px;
    border-bottom: 1px solid #e4e4e4;
  }

  &/deep/ .el-tree-node {
    padding: 2px 0;
    .el-tree-node {
      padding-left: 16px;
    }
  }

  .sub-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add-top {
      margin: 5px 0;
    }
  }

  .comp-tree {
    max-width: unset;
    max-height: unset;
    margin-left: 310px;
    // border-left: 10px solid #F6FAFB;
    height: 100%;
    padding: 0 16px;
    font-size: 26px;

    .el-tree {
      padding: 0 20%;
      height: max-content;
      /*height: calc(100% - 160px);
      overflow: auto;*/
    }
  }

  .button-box {
    margin-top: 1em;
    text-align: right;
    button {
      min-width: 130px;
    }
  }
}
/deep/ .comp-tr-node {
  position: relative;
}
.myTree {
  height: 600px;
  overflow: auto;
/*  min-height: 200px !important;
  max-height: 600px !important;*/
}

.el-tree /deep/ .el-tree-node__content {
  height: 28px !important;
}

.el-tree /deep/ .el-tree-node__children {
  overflow: visible !important;
}

.el-tree /deep/ .el-input--mini .el-input__inner {
  padding-left: 4px 15px !important;
  height: 32px !important;
  line-height: 32px !important;
}

.el-tree::-webkit-scrollbar {
  width: 3px;
  height: 5px;
  background-color: #fff;
}

.el-tree::-webkit-scrollbar-track {
  background-color: #fff;
}
</style>
