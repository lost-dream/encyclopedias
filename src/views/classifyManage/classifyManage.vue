<template>
	<div>
		<p>属性模板管理</p>
		
		
		<!--分类树-->
		<p>分类树</p>
		<el-tree
		    :data="treeData"
		    :props="defaultProps"
		    node-key="id"
		    ref="treeForm"
		    show-checkbox
		    check-strictly
		    default-expand-all
		    check-on-click-node
		    @check-change="handleNodeClick">
		</el-tree>
		<!--展示选中的分类对应的属性模板-->
		<el-card shadow="hover">
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
		     	<el-button @click="dialogVisible = true" type="warning">取消修改</el-button>
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
import {categoryTree,info,save,attrDelete} from '@/api/classifyManager/index.js'
import {attributeTypeAry,editTypeAry,editSourceAry,} from '@/enumeration/classify.js'
export default {
	name: 'classifyManage',
	data() {
	    return {
	        checkedId: '',
	        treeData: [],
	        defaultProps: {
	            children: 'children',
	            label: 'name'
	        },
	        classifyData:[],
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
		
	},
	created() {
		this.categoryTree()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		addClassify() {
			var obj = JSON.parse(JSON.stringify(this.defaultClassifyItem))
			this.classifyData.push(obj)
		},
		deleteHandle(index) {
			this.classifyData.splice(index,1)
		},
		//撤销修改
		cancelModify() {
			this.dialogVisible = false
			info({'id':this.checkedId}).then(res =>{
                console.log(res)
                this.classifyData = [res.data]
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		save() {
			var obj = JSON.parse(JSON.stringify(this.defaultClassifyItem))
			var ary = []
			this.classifyData.map((item)=>{
				for(var i in obj){
					if(i === 'attributeRangeBegin' || i === 'attributeRangeEnd'){
						obj[i] = item[i].toString()
					}
					else{
						obj[i] = item[i]
					}		
				}
				ary.push(obj)
			})
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
		info(id) {
			info({'id':this.checkedId}).then(res =>{
                console.log(res)
                this.classifyData = [res.data]
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		attrDelete() {
			
		},
		categoryTree() {
			categoryTree({}).then(res =>{
                this.treeData = [res.data]
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
		    this.info()
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
	.departTable {
  &/deep/ .cell {
    text-align: center;
  }
}
</style>