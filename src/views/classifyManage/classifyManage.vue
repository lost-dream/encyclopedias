<template>
	<div>
		<!--分类树-->
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
		        <el-table-column width="150px" label="编辑模式">
		          <template slot-scope="scope">
		            <el-select disabled placeholder="请选择模式" v-model="scope.row.editType">
			          <el-option v-for="(item, index) in editTypeAry" :key="item.id" :label="item.name" :value="item.id"></el-option>
			        </el-select>
		          </template>
		        </el-table-column>
		        <el-table-column width="200px" label="编辑内容来源">
		          <template slot-scope="scope">
		            <el-select disabled placeholder="请选择来源" v-model="scope.row.editSource">
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
		
		<!--根据属性动态创建form表单-->
		<ul>
			<li v-for="item in classifyData">
				<span>{{item.attributeName}}</span>
				<div>
					<!--文本-->
					<span v-if="item.attributeType===1">
						<el-input
							type="text"
						  placeholder="请输入属性内容"
						  v-model="item.val"
						  clearable>
						</el-input>
					</span>
					<!--数字-->
					<span v-if="item.attributeType===2">
						<el-input
							type="number"
							:min="item.attributeRangeBegin"
							:max="item.attributeRangeEnd"
						  placeholder="请输入属性内容"
						  v-model="item.val"
						  clearable>
						</el-input>
					</span>
					<!--枚举-->
					<span v-if="item.attributeType===3">
						<el-select v-model="item.val" placeholder="请选择">
						    <el-option
						      v-for="item1 in options"
						      :key="item1.value"
						      :label="item1.label"
						      :value="item1.value">
						    </el-option>
						  </el-select>
					</span>
					<!--时间-->
					<span v-if="item.attributeType===4||item.attributeType===5||item.attributeType===6||item.attributeType===7">
						<el-date-picker
					      v-model="item.val"
					      :type="datetimeObj[item.attributeType]"
					      placeholder="选择日期时间"
					      align="right"
					      value-format="timestamp"
					      :data-begin="item.attributeRangeBegin"
					      :data-end="item.attributeRangeEnd"
					      :picker-options="pickerOptions"
					      >
					    </el-date-picker>
					</span>
					
				</div>
			</li>
		</ul>
		
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
	    	pickerOptions: {
				disabledDate: this.disabledDate
			},
	    	options:[
	    		{value:'1',label:'没得数据1'},
	    		{value:'2',label:'没得数据2'},
	    		{value:'3',label:'没得数据3'},
	    	],
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
		disabledDate(time,now) {
			console.log(now)
           	return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e6就是不可以选择今天的
           
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
				res.data.records.map((item)=>{
					item.val = ''
				})
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

</style>