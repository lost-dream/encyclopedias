<template>
	<div>
		<el-row>
			<treemenu @parentMethod="chooseItem" :list="treeData"></treemenu>
		</el-row>
		
		
		<!--展示选中的分类对应的属性模板（只读）-->
		<el-card v-show="checkedParentId" shadow="hover">
			<div slot="header" class="clearfix">继承属性</div>
			<el-table ref="table" :data="parentClassifyData" class="departTable" border stripe>
		        <el-table-column prop="attributeName" label="属性名称" />
		        <el-table-column prop="attributeType" label="属性值类型" />
		        <el-table-column width="250px" label="约束值">
		          <template slot-scope="scope">
		          	{{scope.row.attributeRangeBegin}}~{{scope.row.attributeRangeEnd}}
		          </template>
		        </el-table-column>
		        <el-table-column prop="editType" label="编辑模式" />
		        <el-table-column prop="editSource" label="编辑内容来源" />
		    </el-table>
	    </el-card>
		<!--展示选中的分类对应的属性模板（编辑）-->
		<el-card v-show="checkedId" shadow="hover">
			<div slot="header" class="clearfix">自身属性</div>
			<el-row style="text-align: right;">
				<el-button @click="addClassify" type="success">新增属性</el-button>
			</el-row>
			<el-table ref="table" :data="classifyData" class="departTable" border stripe>
				<el-table-column width="200px" label="属性名称">
		          <template slot-scope="scope">
		            <el-input v-model="scope.row.attributeName" placeholder="请输入属性名称"></el-input>
		          </template>
		        </el-table-column>
		        
		        
		        <el-table-column width="150px" label="属性值类型">
		          <template slot-scope="scope">
		          	<el-select placeholder="请选择类型" v-model="scope.row.attributeType">
			          <el-option v-for="(item, index) in attributeTypeAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
			        </el-select>
		          </template>
		        </el-table-column>
		        <el-table-column width="250px" label="约束值">
		          <template slot-scope="scope">
		          	<el-col :span="11">
						<el-input placeholder="请输入约束值" style="width: 100px;display: inline-block;" v-model="scope.row.attributeRangeBegin"></el-input>
					</el-col>
					<el-col style="line-height: 40px;" :span="1">-</el-col>
					<el-col :span="11">
						<el-input placeholder="请输入约束值" style="width: 100px;display: inline-block;" v-model="scope.row.attributeRangeEnd"></el-input>
					</el-col>
		          </template>
		        </el-table-column>
		        <el-table-column width="150px" label="编辑模式">
		          <template slot-scope="scope">
		            <el-select placeholder="请选择模式" v-model="scope.row.editType">
			          <el-option v-for="(item, index) in editTypeAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
			        </el-select>
		          </template>
		        </el-table-column>
		        <el-table-column width="200px" label="编辑内容来源">
		          <template slot-scope="scope">
		            <el-select placeholder="请选择来源" v-model="scope.row.editSource">
			          <el-option v-for="(item, index) in editSourceAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
			        </el-select>
		          </template>
		        </el-table-column>
		        <el-table-column fixed="right" label="操作" width="100">
					<template slot-scope="scope">
						<el-button @click="deleteHandle(scope.$index)" type="danger" size="small">删除</el-button>
					</template>
				</el-table-column>
		     </el-table>
		     <el-row style="text-align: center;margin-top: 20px;">
		     	<!--<el-button @click="dialogVisible = true" type="warning">取消修改</el-button>-->
			  	<el-button @click="save" type="primary">保存</el-button>
			</el-row>
	    </el-card>
	    <!--是否取消修改弹窗-->
	    <el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  <span>确定取消修改？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="cancelModify">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
import {categoryTree,save,list} from '@/api/classifyManager/index.js'
import {attributeTypeAry,editTypeAry,editSourceAry,} from '@/enumeration/classify.js'
import treemenu from '@/components/treeMenu'
export default {
	name: 'classifyManage',
	components:{
		treemenu
	},
	data() {
	    return {
	        checkedId: '',
	        checkedParentId:'',
	        checkedParentItem:{},
	        treeData: [],
	        defaultProps: {
	            children: 'children',
	            label: 'name'
	        },
	        props:{
	        	expandTrigger:'hover',
	        	checkStrictly: true,
	        	value:'id',
	        	label:'name',
	        	children:'children',
	        },
	        classifyData:[],
	        parentClassifyData:[],
	        attributeTypeAry:attributeTypeAry,
	        editTypeAry:editTypeAry,
	        editSourceAry:editSourceAry,
	        dialogVisible:false,
	        defaultClassifyItem:{
				"attributeName": "",
				"attributeType": "",
				"attributeRangeBegin": "",
				"attributeRangeEnd": "",
				"editType": "",
				"editSource": ""
			},
			
	    }
	},
	watch: {
		checkedParentId() {
			list({
				categoryId:this.checkedParentId,
				pageNumber: 1,
				pageSize: 100,
			}).then(res =>{
				res.data.records.map((item)=>{
					this.attributeTypeAry.map((item1)=>{
						if(item1.id === item.attributeType){
							item.attributeType = item1.name
						}
					})
					this.editTypeAry.map((item1)=>{
						if(item1.id === item.editType){
							item.editType = item1.name
						}
					})
					this.editSourceAry.map((item1)=>{
						if(item1.id === item.editSource){
							item.editSource = item1.name
						}
					})
				})
                this.parentClassifyData = res.data.records
            })
            .catch(res=>{
            	console.log(res)
            })
		}
		
	},
	created() {
		this.categoryTree()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		chooseItem(item,parentItem) {
			parentItem?this.checkedParentId = parentItem.id:this.checkedParentId = ''
			this.checkedId = item.id
			this.list()
		},
		//选中分类事件
		changeCascader(item) {
			this.checkedId = item[item.length - 1];
			 //获取选中分类的父级分类id，查询回父级分类的属性模板展示出来
			 if(item.length>1){
			 	this.checkedParentId = item[item.length - 2]
			 }
			 else{
			 	this.checkedParentId = this.checkedParentItem.id
			 }
		    this.list()
		    
		},
		addClassify() {//属性条数最多50条
			if(this.classifyData.length == 50){
				this.$message('属性条数最多50条')
				return
			}
			var obj = JSON.parse(JSON.stringify(this.defaultClassifyItem))
			this.classifyData.push(obj)
		},
		deleteHandle(index) {
			this.classifyData.splice(index,1)
		},
		//撤销修改
		cancelModify() {
			this.dialogVisible = false
			list({'id':this.checkedId}).then(res =>{
                console.log(res)
                this.classifyData = [res.data]
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		save() {
			var ary = []
			var flag = true
			this.classifyData.map((item)=>{
				var obj = JSON.parse(JSON.stringify(this.defaultClassifyItem))
				for(var i in obj){
					if(item[i].toString().trim() === ''){
						flag = false
					}
					if(i === 'attributeRangeBegin' || i === 'attributeRangeEnd'){
						obj[i] = item[i].toString()
					}
					else{
						obj[i] = item[i]
					}		
				}
				ary.push(obj)
			})
			if(!flag){
				this.$message('请先完善属性');
				return
			}
			save({
				categoryId:this.checkedId,
				categoryAttributeTemplates:ary
			}).then(res =>{
                this.$message('保存成功');
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		list() {
			list({
				categoryId:this.checkedId,
				pageNumber: 1,
				pageSize: 100,
			}).then(res =>{
                this.classifyData = res.data.records
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		
		categoryTree() {
			categoryTree({}).then(res =>{
				//从第一级开始取
				res.data.children.forEach((item)=>{
					if(!item.children.length){
						delete item.children
					}
					else{
						item.children.forEach((item1)=>{
							if(!item1.children.length){
								delete item1.children
							}
							else{
								item1.children.forEach((item2)=>{
									if(!item2.children.length){
										delete item2.children
									}
								})
							}
						})	
					}
				})
				console.log(res.data.children)
                this.treeData = res.data.children
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		handleNodeClick(data, checked, node) {
		    if(checked === true) {
		        this.checkedId = data.id;
		        this.$refs.treeForm.setCheckedKeys([data.id]);
		    } else {
		        if (this.checkedId == data.id) {
		            this.$refs.treeForm.setCheckedKeys([data.id]);
		        }
		    }
		    //获取选中分类的父级分类id，查询回父级分类的属性模板展示出来
		    this.checkedParentId = data.parentId
		    this.list()
		},
		
		
	}
}
</script>

<style lang="scss">
.classifyList{
	background: #459df5;
	color: white;
	font-size: 16px;
	line-height: 40px;
	>span{
		display: inline-block;
		position: relative;
		span{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			display: block;
			text-align: center;
		}
		.el-cascader{
			opacity: 0;
		}
		.el-cascader .el-input .el-input__inner{
			opacity: 0;
			text-align: center;
			background: #459df5 !important;
			color: white !important;
			border: none;
			padding: 0;
			&::placeholder{
				color: white;
			}
		}
		.el-icon-arrow-down:before{
			content: '' !important;
		}
		.el-cascader-menu__list{
			background: #97c8f9 !important;
			color: white !important;
		}
	}
}

.departTable {
  &/deep/ .cell {
    text-align: center;
  }
}
</style>