<template>
	<div>
		<el-row>
			<el-col :span="4">
				<div class="myTree">
					<el-tree
			        ref="tree"
			        :props="defaultProps"
			        current-node-key="1"
			        :data="treeData"
			        node-key="space_id"
			        @node-click="handleNodeClick"
			        :expand-on-click-node="true"
			        highlight-current
			      >
			        <!--<div class="custom-tree-node" slot-scope="{ node, data}">
			          <div>
			            <span @click.stop="chooseItem(data)">{{ data.name }}</span>
			          </div>
			          <span class="el-ic"></span>
			        </div>-->
			      </el-tree>
				</div>
			</el-col>
			<el-col :span="20">
				<!--展示选中的分类对应的属性模板（只读）-->
				<el-card v-show="checkedParentId" shadow="hover">
					<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
						<span class="leftBorder"></span>
						继承属性
					</div>
					<el-table
						:header-cell-style="{background:'#ecedf2',color:'#67686d'}"
						  ref="table" :data="parentClassifyData" class="departTable" border stripe>
				        <el-table-column prop="attributeName" label="属性名称" />
				        <el-table-column prop="attributeTypeName" label="属性值类型" />
				        <el-table-column width="250px" label="约束值">
				          <template slot-scope="scope">
				          	<span v-if="scope.row.attributeType===4||scope.row.attributeType===5||scope.row.attributeType===6||scope.row.attributeType===7">{{parseTime(scope.row.attributeRangeBegin)}}~{{parseTime(scope.row.attributeRangeEnd)}}</span>
				          	<span v-else>{{scope.row.attributeRangeBegin}}~{{scope.row.attributeRangeEnd}}</span>
				          </template>
				        </el-table-column>
				        <el-table-column prop="editType" label="编辑模式" />
				        <el-table-column prop="editSource" label="编辑内容来源" />
				    </el-table>
			    </el-card>
				<!--展示选中的分类对应的属性模板（编辑）-->
				<el-card v-show="checkedId" shadow="hover">
					<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
						<span class="leftBorder"></span>
						自身属性
						<el-button style="float: right;margin-top: -10px;background: #56bd9d;" @click="addClassify" type="success">添加</el-button>
					</div>
					
					<el-table 
						:header-cell-style="{background:'#ecedf2',color:'#67686d'}"
						 ref="table" :data="classifyData" class="departTable" border stripe>
						<el-table-column width="200px" label="属性名称">
				          <template slot-scope="scope">
				            <el-input v-model="scope.row.attributeName" placeholder="请输入属性名称"></el-input>
				          </template>
				        </el-table-column>
				        
				        
				        <el-table-column width="150px" label="属性值类型">
				          <template slot-scope="scope">
				          	<el-select @change="attributeTypeChange($event,scope.row)" placeholder="请选择类型" v-model="scope.row.attributeType">
					          <el-option v-for="(item, index) in attributeTypeAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
					        </el-select>
				          </template>
				        </el-table-column>
				        <el-table-column width="250px" label="约束值">
				        	<template slot-scope="scope">
				        		<!--数字范围-->
				        		<el-row v-if="scope.row.attributeType===2">
				        			<el-col :span="11">
										<el-input type="number" placeholder="请输入约束值" style="width: 100px;display: inline-block;" v-model="scope.row.attributeRangeBegin"></el-input>
									</el-col>
									<el-col style="line-height: 40px;" :span="1">-</el-col>
									<el-col :span="11">
										<el-input type="number" placeholder="请输入约束值" style="width: 100px;display: inline-block;" v-model="scope.row.attributeRangeEnd"></el-input>
									</el-col>
				        		</el-row>
				        		
				        		<!--时间范围-->
				        		<el-row v-if="scope.row.attributeType===7||scope.row.attributeType===6||scope.row.attributeType===5||scope.row.attributeType===4">
				        			<el-col :span="11">
										<el-date-picker
									      v-model="scope.row.attributeRangeBegin"
									      :type="datetimeObj[scope.row.attributeType]"
									      placeholder="选择日期时间"
									      align="right"
									      value-format="timestamp"
									      >
									    </el-date-picker>
						          	</el-col>
									<el-col style="line-height: 40px;" :span="1">-</el-col>
									<el-col :span="11">
										<el-date-picker
									      v-model="scope.row.attributeRangeEnd"
									      :type="datetimeObj[scope.row.attributeType]"
									      placeholder="选择日期时间"
									      align="right"
									      value-format="timestamp"
									      >
									    </el-date-picker>
									</el-col>
				        		</el-row>
				        		
				        		
				        	</template>
				        	
				        </el-table-column>
				        <el-table-column width="200" label="编辑模式">
				          <template slot-scope="scope">
				            <el-select disabled placeholder="请选择模式" v-model="scope.row.editType">
					          <el-option v-for="(item, index) in editTypeAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
					        </el-select>
				          </template>
				        </el-table-column>
				        <el-table-column width="150" label="编辑内容来源">
				          <template slot-scope="scope">
				            <el-select disabled placeholder="请选择来源" v-model="scope.row.editSource">
					          <el-option v-for="(item, index) in editSourceAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
					        </el-select>
				          </template>
				        </el-table-column>
				        <el-table-column fixed="right" label="操作" width="50">
							<template slot-scope="scope">
								<el-button @click="deleteHandle(scope.$index)" type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
				     </el-table>
				     <el-row style="text-align: center;margin-top: 20px;">
				     	<el-button style="background: #cccccc;color: black;border: none;margin-right: 60px;" @click="dialogVisible = true" type="primary">取消</el-button>
					  	<el-button style="background: #5b7dd7;" @click="save" type="primary">保存</el-button>
					</el-row>
			    </el-card>
			</el-col>
		</el-row>
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
import {parseTime} from '@/utils/commonMethod.js'
export default {
	name: 'classifyManage',
	components:{
		treemenu
	},
	data() {
	    return {
	    	
	    	datetimeObj:{
	    		7:'datetime',
	    		6:'date',
	    		5:'month',
	    		4:'year'
	    	},
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
							item.attributeTypeName = item1.name
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
		parseTime(str) {
			return parseTime(str)
		},
		//根据属性值类型变化改变约束值和编辑模式
		attributeTypeChange(ev,row) {
			this.$set(row,'attributeType',ev)
			this.$set(row,'attributeRangeBegin','')
			this.$set(row,'attributeRangeEnd','')
			this.$set(row,'editType',ev)
			this.$set(row,'editSource','')
			if(ev === 3){
				this.$set(row,'editSource','1')
			}
			if(ev === 1||ev === 3){
				this.$set(row,'attributeRangeBegin',0)
			this.$set(row,'attributeRangeEnd',0)
			}
		},
		
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
				
				if(item['attributeType']===1){
					if(item['attributeName'].trim()===''){
						flag = false
					}
				}
				else if(item['attributeType']===2){
					if(item['attributeRangeBegin']===''||item['attributeRangeEnd']===''
					|| (item['attributeRangeBegin']>=item['attributeRangeEnd'])
					){
						flag = false
					}
					
				}
				else if(item['attributeType']===3){
					
				}
				else{//日期
					if(item['attributeRangeBegin']===''||item['attributeRangeEnd']===''
					|| (item['attributeRangeBegin']>=item['attributeRangeEnd'])
					){
						flag = false
					}
				}
				
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
			console.log(ary,'ary')
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
				res.data.children.map((item)=>{
					if(!item.children.length){
						delete item.children
					}
					else{
						item.children.map((item1)=>{
							if(!item1.children.length){
								delete item1.children
							}
							else{
								item1.children.map((item2)=>{
									if(!item2.children.length){
										delete item2.children
									}
								})
							}
						})
					}
				})
				console.log(res.data.children,'111')
                this.treeData = res.data.children
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		handleNodeClick(data, checked, node) {
		    this.checkedId = data.id;
		    //获取选中分类的父级分类id，查询回父级分类的属性模板展示出来
		    this.checkedParentId = data.parentId
		    this.list()
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
.leftBorder{
	display: inline-block;
	vertical-align: middle;
	background: #5d7cd8;
	width: 5px;
	height: 20px;
	margin-right: 15px;
}
.classifyForm{
	font-size: 0;
	li{
		display: inline-block;
		width: 50%;
		font-size: 14px;
		color: black;
		line-height: 30px;
		margin-top: 20px;
		.name{
			margin-right: 15px;
			display: inline-block;
			width: 200px;
			text-align: right;
			vertical-align: middle;
			max-height: 60px;
			overflow: hidden;
		}
		div{
			display: inline-block;
			
		}
	}
}







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

</style>