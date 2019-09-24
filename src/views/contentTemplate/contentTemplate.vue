<template>
  <div class="pos-rltv padding-20">
    <h2>分类目录模板</h2>
    <div>
      <el-tree 
        :data="categoryTree" 
        :props="categoryProps"
        @node-click="selectCategory">
      </el-tree>
    </div>

    <hr>

    <div v-loading="isLoading" class="comp-tree">
      <el-button class="comp-tr-top" 
        type="primary" 
        size="small" 
        @click="handleAddTop">添加顶级节点</el-button>
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
			MAX_LEVEL: 3,// 设定最大层级
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
      expanded: [], // 默认展开
      dialogFormVisible: false, // diag可见性
      formLabelWidth: '80px',
      labelPos: 'right',
      diagTitle: {edit: '编辑分类', add: '添加分类', text: ''},
      initParam: {// 新增参数
				contentName: '新增节点',
				pid: 0,
				children: []
			},
      form: {
        id: undefined,
        name: '',
        parentId: '',
        grade: '',
        sort: '',
        descM: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 18, message: '长度需在 1 到 18 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请指定父级分类', trigger: 'blur' },
        ],
        grade: [
          { type: 'number', required: true, message: '排序值必须为数字', trigger: 'blur' }
        ],
        sort: [
          { type: 'number', message: '排序值必须为数字', trigger: 'blur' }
        ]
      },
      options: []
		}
	},
	created(){
		// 初始值
    this.startId = this.NODE_ID_START 
    this.getCategoryTreeData()
    this.getTemplateTreeData()
	},
	methods: {
    handleDelete(_node, _data){// 删除节点
			console.log(_node, _data)
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
					this.$confirm("是否删除此节点？","提示",{
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
			console.log(_node, _data)
			// 退出编辑状态
			if(_node.isEdit){
				this.$set(_node, 'isEdit', false)
			}
		},
		handleEdit(_node, _data){// 编辑节点
			console.log(_node, _data)
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
			console.log(_node, _data)
			// 判断层级
			if(_node.level >= this.MAX_LEVEL){
				this.$message.warning("当前已达到"+ this.MAX_LEVEL + "级，无法新增！")
				return false;
			}
			// 参数修改
			let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
			obj.pid = _data[this.NODE_KEY];// 父id
			obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
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
			obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
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
    getTemplateTreeData(){
      let vm = this
      vm.isLoading = true
      templateApi.getTreeData()
      .then(res => {
        console.log('success:', res);
        // return;
        if(res.status == 'success'){
          let data = res.data && (_.cloneDeep(res.data.children) || [])
          vm.setTree = data;
          vm.isLoading = false;
        }else{
          this.$message.error("获取目录模板信息失败，请稍后重试！")
        }
      })
      .catch(e => {
        // console.log('error: ', res)
        this.$message.error("请求出错，错误原因： " + e.msg ? e.msg : JSON.stringify(e));
      })
    },
    // 处理选择目录事件
    selectCategory(data, node, component){
      // console.log(data, node, component);
      templateApi.checkTemplateTreeData({
        id: data.id
      })
      .then(res => {
        // console.log(res);
        res.data && (this.setTree = res.data)
      })
      .catch(e => {
        this.$message.error("请求出错，错误原因： " + e.msg ? e.msg : JSON.stringify(e));
      })
    },
    // 发送保存请求操作
    doSaveAction(){
      let apiFunc = this.diagTitle.text == '编辑分类' ? api.updateCategory : api.createCategory, vm = this, expanded = ''
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          typeof(vm.form.parentId) == 'object' && (vm.form.parentId = vm.form.parentId[vm.form.parentId.length - 1]) // 默认是数组，提交时取最后一个
          expanded = [].concat(vm.form.parentId)
          apiFunc(_.merge({}, vm.form))
          .then(res => {
            if(res.status == 'success'){
              this.dialogFormVisible = false
              this.form = {}
              this.expanded = expanded
              this.getTreeData()
              this.$message.success('保存成功！')
            }else{
              this.$message.error('保存失败，请稍后重试！')
            }
          })
          .catch(e => {
            this.$message.error("请求出错，错误原因： " + e.msg ? e.msg : JSON.stringify(e));
          })
        } else {
          return false;
        }
      });
    },
    // 删除category
    doDeleteAction(id){
      api.deleteCategory({
        id: id
      })
      .then(res => {
        if(res.status == 'success'){
          this.getTreeData()
          this.$message.success('删除成功！')
        }else{
          this.$message.error('删除失败，请稍后重试！')
        }
      })
      .catch(e => {
        this.$message.error("请求出错，错误原因： " + e.msg ? e.msg : JSON.stringify(e));
      })
    },
    // 禁用某节点
    disableNode(id){
      let arr = this.options
      arr.forEach(x => {
        x.disabled = x.id == id
        x.children && x.children.forEach(y => {
          y.disabled = x.id == id || y.id == id
          y.children && y.children.forEach(z => {
            z.disabled = x.id == id || y.id == id || z.id == id
          })
        })
      })
    }
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
  .el-tree-node__content {
    height: 28px;
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
    position: absolute;
		width: 100%;
		max-width: 300px;
		max-height: 80vh;
    overflow: visible;
  
		// 顶部按钮
		.comp-tr-top{
			width: 100px;
			margin-bottom: 2em;
		}
		// 自定义节点
		.comp-tr-node{
			// label
			.comp-tr-node--name{
				display: inline-block;
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

</style>