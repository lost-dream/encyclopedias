<template>
  <div class="pos-rltv  bg-fff">
    <h2 class="page-title">
      <span>词条分类维护</span>
    </h2>
    <div v-loading="isLoading" class="comp-tree myTree">
      <div>
        <el-button class="comp-tr-top" 
        type="primary" 
        size="small" 
        @click="handleAddTop">新增分类</el-button>
      </div>
      <!-- tree -->
		  <el-tree
        ref="SlotTree"
        :data="setTree"
        :props="defaultProps"
        :expand-on-click-node="false"
        highlight-current
        :node-key="NODE_KEY"
        :default-expanded-keys="expanded">
        	<div class="comp-tr-node" slot-scope="{ node, data }">
					<!-- 编辑状态 -->
					<template v-if="node.isEdit">
						<el-input v-model="data.name" 
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
    
    <div class="right-form">
      <el-form :disabled="formDisabled" :model="form" :rules="rules" ref="ruleForm" :label-position="labelPos" label-width="200px">
        <el-form-item label="上级目录" :label-width="formLabelWidth" prop="parentId">
          <el-cascader
            v-model="form.parentId"
            :options="options"
            :props="cascaderProps"
            @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input resize='none' rows=4 type='textarea' v-model="form.descM" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input style="width: 200px;" v-model.number="form.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;padding-bottom: 100px;">
          <el-button style="background: #cccccc !important;color: black;border: none;" @click="form = {}; formDisabled = true;">取 消</el-button>
          <el-button style="background: #5b7dd7 !important;color: white;margin-left: 50px;" type="primary" @click="doSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api/categoryManager/index.js'
import _ from 'lodash'

export default{
	name: 'categoryManager',
	data(){
		return {
			isLoading: false,// 是否加载
			setTree: [],
			NODE_KEY: 'id',// id对应字段
			MAX_LEVEL: 3,// 设定最大层级
			NODE_ID_START: 0,// 新增节点id，逐次递减
			// startId: null,
			defaultProps: {// 默认设置
				children: 'children',
				label: 'name'
      },
      expanded: [], // 默认展开
			// initParam: {// 新增参数
			// 	name: '新增节点',
			// 	parentId: 0,
			// 	children: []
      // },
      dialogFormVisible: false, // diag可见性
      formLabelWidth: '150px',
      labelPos: 'right',
      diagTitle: {edit: '编辑分类', add: '添加分类', text: ''},
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
      cascaderProps: {
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      options: [],
      formDisabled: true, 
		}
	},
	created(){
		// 初始值
    // this.startId = this.NODE_ID_START 
    this.getTreeData()
	},
	methods: {
    goBack(){
      console.log('back!')
    },
    // 删除category
		handleDelete(_node, _data){
      let vm = this;
			console.log(_node, _data)
			// 判断是否存在子category
			if(_data.children && _data.children.length !== 0){
				this.$message.error("此分类有子级，不可删除！", 5000)
				return false;
			}else{
				// // 删除操作
				// let DeletOprate = () => {
				// 	this.$nextTick(() => {
				// 		if(this.$refs.SlotTree){
				// 			this.$refs.SlotTree.remove(_data)
				// 			this.$message.success("删除成功！")
				// 		}
				// 	})
				// }

				// 二次确认
				let ConfirmFun = () => {
					this.$confirm("是否删除此分类？","提示",{
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
            // DeletOprate()
            vm.expanded = [].concat(_data.parentId)
            vm.doDeleteAction(_data.id)
					}).catch(() => {})
				}

				// 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
        // _data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
        ConfirmFun()
			}
    },
    // 修改category
		handleInput(_node, _data){
			console.log(_node, _data)
			// 退出编辑状态
			if(_node.isEdit){
				this.$set(_node, 'isEdit', false)
			}
    },
    // 编辑category
		handleEdit(_node, _data){
      console.log(_node, _data)

      // 判断层级
			if(_node.level > this.MAX_LEVEL){
				this.$message.warning("第3级以上数据暂时不作修改，以免影响数据结构")
				return false;
      }

      this.clickSlot('edit', _data);
      return ;

			// // 设置编辑状态
			// if(!_node.isEdit){
			// 	this.$set(_node, 'isEdit', true)
			// }

			// // 输入框聚焦
			// this.$nextTick(() => {
			// 	if(this.$refs['slotTreeInput'+_data[this.NODE_KEY]]){
			// 		this.$refs['slotTreeInput'+_data[this.NODE_KEY]].$refs.input.focus()
			// 	}
			// })
    },
    // 新增category
		handleAdd(_node, _data){
			console.log('add: ', _node, _data)
			// 判断层级
			if(_node.level >= this.MAX_LEVEL){
				this.$message.warning("当前暂只支持"+ this.MAX_LEVEL + "级，无法继续新增！")
				return false;
      }


      this.clickSlot('add', _data)
      return ;

			// // 参数修改
			// let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
			// obj.parentId = _data[this.NODE_KEY];// 父id
			// obj[this.NODE_KEY] = --this.startId;// 节点id：逐次递减id
			// // 判断字段是否存在
			// if(!_data.children){
			// 	this.$set(_data, 'children', [])
			// }
			// // 新增数据
			// _data.children.push(obj)

			// // 展开节点
			// if(!_node.expanded){
			// 	_node.expanded = true
			// }
    },
    // 添加一级category
		handleAddTop(){
			// let obj = JSON.parse(JSON.stringify(this.initParam));// copy参数
			// obj[this.NODE_KEY] = --this.startId;// categoryid：逐次递减id
      // this.setTree.push(obj)
      this.form = {}
      this.clickSlot('add', {id: '', grade: 0})
    },
    // 拉取树形数据，带后续处理
    getTreeData(){
      let vm = this
      vm.isLoading = true
      api.getTreeData()
      .then(res => {
        // console.log('success:', res);
        if(res.status == 'success'){
          let data = res.data && (_.cloneDeep(res.data.children) || [])

          if(data.length){
            data.forEach(x => {
              // 第一级
              x.disabled = false;
              if(x.children && x.children.length){
                x.children.forEach(y => {
                  // 第二级
                  // if(y.children && y.children.length){
                  //   y.children.forEach(z => {
                  //     // 第三级
                  //     z.children  && (delete z.children)
                  //   })
                  // }
                  // else{
                  //   y.children && (delete y.children)
                  // }
                  y.disabled = false
                  y.children && (delete y.children)
                });
              }else{
                x.children && (delete x.children)
              }
            });

            this.setTree = res.data.children
          }

          this.options = [{children: data || [], id: 'ROOT', name: '根目录', disabled: false}]
        
          vm.isLoading = false
        }else{
          this.$message.error("获取分类信息失败，请稍后重试！")
        }
      })
      .catch(res => {
        // console.log('error: ', res)
        this.$message.error("请求出错，错误原因： " + res.msg ? res.msg : JSON.stringify(res));
      })
    },
    // 级联选择父级category
    handleChange(e){
      console.log(e)
    },
    // 处理category事件
    clickSlot(type, _data){

      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
      this.diagTitle.text = this.diagTitle[type]

      switch(type){
        case 'edit': {
          _.merge(this.form, _data)
          this.form =  _.pick(this.form, ['id', 'parentId', 'code', 'name', 'grade', 'sort', 'descM'])

          this.disableNode(_data.id)

          this.formDisabled = false;

          break;
        }
        case 'add': {
          this.form = {}
          _.merge(this.form, {
            parentId: _data.id,
            grade: _data.grade + 1
          })
          this.disableNode()

          this.formDisabled = false;

          break;
        }
        default: break;
      }
      
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
/deep/ .comp-tr-node--name{
	font-size: 26px !important;
}


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
	
  .page-title {
    margin: 0;
    padding: 10px 10px 10px 0;
    border-bottom: 10px solid #F6FAFB;
    font-size: 20px;
    font-weight: bold;
    span {
      border-left: 5px solid #007fff;
      padding-left: 15px;
    }
  }

  .right-form {
    margin-left: 300px;
    padding-top: 40px;
    border-left: 10px solid #F6FAFB;
    height: calc(100% - 90px);
  }

	/* common end */
  
	.comp-tree{
		width: 100%;
		max-width: 300px;
		height: calc(100% - 52px);
    overflow: visible;
    position: absolute;

    &/deep/ .el-tree-node {
      padding: 2px 16px;
      .el-tree-node {
        padding-right: 0;
      }
    }

    .el-tree {
      height: calc(100% - 64px);
      overflow: auto;
    }

    .el-tree::-webkit-scrollbar {
      width: 3px;
      height: 5px;
      background-color: #fff;
    }

    .el-tree::-webkit-scrollbar-track{
      background-color: #fff;
    }
  
		// 顶部按钮
		.comp-tr-top{
			width: 200px;
			margin: 16px ;
		}
		// 自定义节点
		.comp-tr-node{
			// label
			.comp-tr-node--name{
				display: inline-block;
				line-height: 40px;
				min-height: 40px;
        padding-left: 4px;
        font-size: 14px;
				// 新增
				&.is-new{
					font-weight: bold;
				}
			}
			// button
			.comp-tr-node--btns{
        position: relative;
        top: -5px;
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