<template>
  <div class="pos-rltv padding-20">
    <h2>分类目录模板</h2>
    <div class="flex-box">
      <div class="left">
        <h3>词条类目</h3>
        <el-tree 
          :data="categoryTree" 
          :props="categoryProps"
          @node-click="selectCategory">
        </el-tree>
      </div>
      
      <div v-show="showContent" v-loading="isLoading" class="comp-tree">
        <h3>目录模板</h3>
        <div class="sub-box"> 
          <p>当前分类： {{currentCategory.name}}</p>
          <el-button 
              class="add-top"
              type="primary"
              size="small"
              @click="handleAddTop">添加一级目录</el-button>
        </div>
        <!-- tree -->
        <el-tree ref="SlotTree"
          :data="setTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          highlight-current
          :node-key="NODE_KEY">
          <div class="comp-tr-node" slot-scope="{ node, data }">
            <!-- 编辑状态 -->
            <template v-if="node.isEdit">
              <el-input v-model="data.contentName" 
                autofocus
                size="mini"
                :ref="'slotTreeInput'+data[NODE_KEY]"
                @blur.stop="handleInput(node, data)"
                @keyup.enter.native="handleInput(node, data)"></el-input>
            </template>

            <!-- 非编辑状态 -->
            <template v-else>
              <!-- 名称： 新增节点增加class（is-new） -->
              <span :class="[data[NODE_KEY] < NODE_ID_START ? 'is-new' : '', 'comp-tr-node--name']">
                {{ node.label }}
              </span>
              
              <!-- 按钮 -->
              <span class="comp-tr-node--btns">
                <!-- 新增 -->
                <el-button icon="el-icon-plus" 
                  size="mini"
                  circle 
                  type="primary" 
                  title="新增"
                  @click="handleAdd(node, data)"></el-button>

                <!-- 编辑 -->
                <el-button icon="el-icon-edit" 
                  size="mini"
                  circle 
                  type="info" 
                  title="修改"
                  @click="handleEdit(node, data)"></el-button>

                <!-- 删除 -->
                <el-button icon="el-icon-delete" 
                  size="mini"
                  circle 
                  type="danger" 
                  title="删除"
                  @click="handleDelete(node, data)"></el-button>
              </span>
            </template>
          </div>
        </el-tree>

        <div class="button-box" v-show="showSave">
          <el-button 
            type="success"
            :loading="saveLoading" 
            @click="saveContent">保存目录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import templateApi from '@/api/contentTemplate/index.js'
import categoryApi from '@/api/categoryManager/index.js'
import _ from 'lodash'

export default{
	name: 'contentTemplate',
	data(){
		return {
			isLoading: false,// 是否加载
      setTree: [], // 目录树
      categoryTree: [], // 
			NODE_KEY: 'categoryId',// id对应字段
			MAX_LEVEL: 3,// 设定最大层级    todo: 确认最大级别
			NODE_ID_START: 0,// 新增节点id，逐次递减
			// startId: null,
			defaultProps: {// 默认设置
				children: 'children',
				label: 'contentName'
      },
      categoryProps: {
        children: 'children',
				label: 'name'
      },
      dialogFormVisible: false, // diag可见性
      initParam: {// 新增参数
				contentName: '新增目录',
				children: []
			},
      showContent: false,
      showSave: false,
      saveLoading: false,
      currentCategory: {},

		}
	},
	created(){
		// 初始值
    this.startId = this.NODE_ID_START 
    this.getCategoryTreeData()
	},
	methods: {
    handleDelete(_node, _data){// 删除节点
			// console.log(_node, _data)
			// 判断是否存在子节点
			if(_data.children && _data.children.length !== 0){
				this.$message.error("此节点有子级，不可删除！")
				return false;
			}else{
				// 删除操作
				let DeletOprate = () => {
					this.$nextTick(() => {
						if(this.$refs.SlotTree){
							this.$refs.SlotTree.remove(_data)
							this.$message.success("删除成功！")
						}
					})
				}
				// 二次确认
				let ConfirmFun = () => {
					this.$confirm("是否删除此目录？","提示",{
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						DeletOprate()
					}).catch(() => {})
				}
				// 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
				_data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
			}
		},
		handleInput(_node, _data){// 修改节点
			// console.log(_node, _data)
			// 退出编辑状态
			if(_node.isEdit){
				this.$set(_node, 'isEdit', false)
      }
      this.showSave = true;
		},
		handleEdit(_node, _data){// 编辑节点
			// console.log(_node, _data)
			// 设置编辑状态
			if(!_node.isEdit){
				this.$set(_node, 'isEdit', true)
			}
			// 输入框聚焦
			this.$nextTick(() => {
				if(this.$refs['slotTreeInput'+_data[this.NODE_KEY]]){
					this.$refs['slotTreeInput'+_data[this.NODE_KEY]].$refs.input.focus()
				}
      })
		},
		handleAdd(_node, _data){// 新增节点
			// console.log(_node, _data)
			// 判断层级
			if(_node.level >= this.MAX_LEVEL){
				this.$message.warning("当前已达到"+ this.MAX_LEVEL + "级，无法新增！")
				return false;
			}
			// 参数修改
			let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
			// obj.pid = _data[this.NODE_KEY];// 父id
			// obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
			// 判断字段是否存在
			if(!_data.children){
				this.$set(_data, 'children', [])
			}
			// 新增数据
			_data.children.push(obj)
			// 展开节点
			if(!_node.expanded){
				_node.expanded = true
			}
		},
		handleAddTop(){// 添加顶部节点
			let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
			// obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
			this.setTree.push(obj)
		},
    // 拉取categoryTree数据，带后续处理
    getCategoryTreeData(){
      let vm = this
      vm.isLoading = true
      categoryApi.getTreeData()
      .then(res => {
        console.log('success:', res);
        // return;
        if(res.status == 'success'){
          let data = res.data && (_.cloneDeep(res.data.children) || [])
          vm.categoryTree = data;
          vm.fromData = data;
          vm.isLoading = false;
        }else{
          this.$message.error("获取分类信息失败，请稍后重试！")
        }
      })
      .catch(res => {
        // console.log('error: ', res)
        this.$message.error("请求出错，错误原因： " + res.msg ? res.msg : JSON.stringify(res));
      })
    },
    // 获取templateTree数据
    checkTemplateTreeData(id){
      templateApi.checkTemplateTreeData({
          id: id
        })
        .then(res => {
          // console.log(res);
          res.data && (this.setTree = res.data)
          this.isLoading = false;
        })
        .catch(e => {
          this.$message.error("请求出错，错误原因： " + e.msg ? e.msg : JSON.stringify(e));
          this.isLoading = false;
        })
    },
    // 处理选择分类事件
    selectCategory(data, node, component){
      // console.log(data, node, component);
      let request = !data.children.length

      if(request){
        this.showContent = true;
        this.isLoading = true;
        this.currentCategory = data;
        this.showSave= false;
        this.checkTemplateTreeData(data.id)
      }
    },
    // 保存函数
    saveContent(){
      let vm = this
      this.saveLoading = true
      console.log(this.setTree);
      templateApi.saveTemplate({
        categoryId: this.currentCategory.id,
        content: this.setTree
      })
      .then(res => {
        this.$message.success("保存成功！");
        this.saveLoading = false
        console.log(res);
      })
      .catch(e => {
        this.$message.error("请求出错，错误原因： " + e.msg ? e.msg : JSON.stringify(e));
      })
    },
  }
    

    
}
</script>

<style lang="scss" scoped>
	/* common */
	// 显示按钮
	.show-btns{
		opacity: 1;
	}
  .pos-rltv{
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
    margin:  0 auto;
  }

	/* common end */
  
	.comp-tree{
    // position: absolute;
    display: inline-block;
    vertical-align: top;
		width: 100%;
		max-width: 300px;
		max-height: 80vh;
    overflow: visible;
  
		// 顶部按钮
		.comp-tr-top{
			width: 100px;
		}
		// 自定义节点
		.comp-tr-node{
			// label
			.comp-tr-node--name{
				display: inline;
				line-height: 40px;
				min-height: 40px;
				// 新增
				&.is-new{
					font-weight: bold;
				}
			}
			// button
			.comp-tr-node--btns{
				margin-left: 10px;
				opacity: 0;
				transition: opacity .1s;
				.el-button{
					transform: scale(0.8);// 缩小按钮
					& + .el-button{
						margin-left: -1px;
					}
				}
			}
		}
		// 高亮显示按钮
		.is-current{
			&>.el-tree-node__content{
				.comp-tr-node--btns{
					@extend .show-btns;
				}
			}
		}
		// 悬浮显示按钮
		.el-tree-node__content{
			&:hover{
				.comp-tr-node--btns{
					@extend .show-btns;
				}
			}
		}
  }

.flex-box {
  display: flex;

  .el-tree-node__content {
    height: 28px;
  }
  .left {
    width: 300px;
    margin-right: 60px;
  }

  h3 {
    font-weight: 400;
    margin-top: 0;
  }

  .sub-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add-top {
      margin: 16px 0;
    }
  }

  .el-tree {
    padding: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
  }

  .button-box {
    margin-top: 1em;
    text-align: right;
    button {
      min-width: 130px;
    }
  }
}

.el-tree /deep/ .el-tree-node__content {
  height: 28px !important;
}

</style>