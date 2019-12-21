<template>
	<div>
		
		
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 28px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				提取任务列表
			</div>
			<el-row style="margin: 0 0 0 20px;">
				<span class="label">名称</span>
				<el-input style="width: 260px;" v-model="taskName" type="text" placeholder=""></el-input>
				<span class="label">类型</span>
				<el-select style="width: 150px;margin-bottom: 20px;" v-model="dataSourceType" placeholder="请选择数据源类别">
			      <el-option label="oracle" value="1"></el-option>
			      <el-option label="达梦" value="2"></el-option>
			      <el-option label="ftp" value="3"></el-option>
			   </el-select>
			    
			    <el-button style="background: #587dda !important;color: white;margin-left: 130px;" @click="list" type="primary">查询</el-button>
			    
			    <el-button style="background: #55BA9A !important;color: white;margin-left: 35px;" @click="add" type="primary">新增</el-button>
			</el-row>
			<el-table
			class="departTable"
		    :data="dataSourceList"
		    border
		    :header-cell-style="{background:'#ecedf2',color:'#67686d'}"
		    style="width: 100%">
		    <el-table-column prop="taskName" label="任务名称"></el-table-column>
		    <el-table-column prop="dataSourceName" label="数据源名称"></el-table-column>
		    <el-table-column prop="dataSourceId" label="数据源类别">
		    	<template slot-scope="scope">
					{{dataSourceTypeObj[dataSourceType]}}
				</template>
		    </el-table-column>
		    <el-table-column prop="creator" label="创建人员"></el-table-column>
		    <el-table-column prop="createTime" label="创建时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.createTime)}}
				</template>
		    </el-table-column>
		    <el-table-column prop="status" label="运行状态">
		    	<template slot-scope="scope">
		    		<span :style="'color:'+statusColorObj[scope.row.status]">{{statusObj[scope.row.status]}}</span>
				</template>
		    </el-table-column>
			<el-table-column fixed="right" label="操作" width="380">
				<template slot-scope="scope">
					<el-button v-if="scope.row.status!==2&&scope.row.status!==3" style="color: #9aa6e1;" @click="start(scope.row)" type="text" size="small">启动</el-button>
        			<el-button v-if="scope.row.status!==0&&scope.row.status!==3" style="color: #fac2a9;" @click="stop(scope.row)" type="text" size="small">停止</el-button>
        			<el-button v-if="scope.row.status!==3" style="color: #a0d6c4;" @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        			<el-button style="color: #f7b2ad;" @click="deleteTask(scope.row)" type="text" size="small">删除</el-button>
        			<el-button style="color: #95cfde;" @click="see(scope.row)" type="text" size="small">查看日志</el-button>
				</template>
			</el-table-column>
		  </el-table>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
		</el-card>
		<el-dialog title="审核意见" :visible.sync="dialogFormVisible">
		  <el-form>
		    <el-form-item label="审核意见">
		      <el-input v-model="modifyReason" autocomplete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="modify">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
import {list,save,info,update,deleteTask,updateStatus} from '@/api/extractTask/index.js'
import {parseTimeYMD} from '@/utils/commonMethod.js'
export default {
	name: 'extractTask',
	data() {
	    return {
	    	dataSourceList:[],
	    	dialogFormVisible:false,
	    	modifyCode:'',
	    	modifyID:'',
	    	modifyReason:'',
	    	dataSourceType:'1',
	    	dataSourceTypeObj:{
	    		'1':'oracle',
	    		'2':'达梦',
	    		'3':'ftp',
	    	},
	    	taskName:'',
	    	auditState:'2',
	    	statusObj:{
	    		'-1':'已删除',
	    		'0':'已停止',
	    		'1':'待运行',
	    		'2':'运行中',
	    		'3':'运行完成',
	    		'4':'运行失败',
	    	},
	    	statusColorObj:{
	    		'-1':'#f7b2ad',
	    		'0':'#fac2a9',
	    		'1':'#9aa6e1',
	    		'2':'green',
	    		'3':'blue',
	    		'4':'red',
	    	},
	    	pagination: {
		      page: 1,
		      limit: 10,
		      count: 0
		    },
		    dataSourceObj:'',
      	}
    },
	created() {
		this.list()
	},
	watch: {
		dataSourceType() {
			this.list()
		}
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		add() {
			this.$router.push({
				name:'extractTaskManager'
			})
		},
		start(item) {
			this.updateStatus(item.id,'1')
		},
		stop(item) {
			this.updateStatus(item.id,'0')
		},
		edit(item) {
			this.$router.push({
				name:'extractTaskManager',
				query:{
					id:item.id,
					type:'modify'
				}
			})
		},
		deleteTask(item) {
			this.$confirm('确认删除该任务？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning',
	          center: true
	        }).then(() => {
	        	deleteTask({
	        		id:item.id
	        	}).then((res)=>{
	        		this.$message('删除成功');
	        		this.pagination.page = 1
					this.list()
	        	})
	        	
	        }).catch(() => {
	          
	        });
		},
		updateStatus(id,status) {
			updateStatus({
				'id':id,
				'status':status
			}).then((res)=>{
				this.list()
				this.$message(status==='1'?'任务启动成功':'任务停止成功');
			})
		},
		see(item) {
			this.$router.push({
				name:'extractTaskLog',
				query:{
					id:item.id,
					taskName:item.taskName
				}
			})
		},
		
		
		
		
		
		
		
		
		
		
		openDialog(item,code) {
			this.modifyCode = code
	    	this.modifyID = item.ID
	    	this.modifyReason = ''
	    	this.dialogFormVisible = true
		},
		modify() {
			if(this.modifyReason.trim() === ''){
				this.$message('请输入审核意见');
				return
			}
			this.dialogFormVisible = false
			audit({
				versionId:this.modifyID,
				auditContent:this.modifyReason,
				state:this.modifyCode,
			}).then((res)=>{
				this.$message('词条状态修改成功');
				this.list()
			})
		},
		deleteData(item) {
			this.$confirm('确认删除当前数据源？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning',
	          center: true
	        }).then(() => {
	        	deleteSource({
	        		id:item.id
	        	}).then((res)=>{
	        		this.$message('删除成功');
	        		this.pagination.page = 1
					this.list()
	        	})
	        	
	        }).catch(() => {
	          
	        });
			
		},
		
		
		
		parseTime(str) {
			return parseTimeYMD(str)
		},
		handleSizeChange(val) {
			this.pagination.page = 1
			this.pagination.limit = val
			this.list()
		},
		handleCurrentChange(val) {
			this.pagination.page = val
			this.list()
		},
		list() {
			list({
				pageNumber: this.pagination.page,
				pageSize: this.pagination.limit,
				taskName: this.taskName,
				dataSourceType:parseInt(this.dataSourceType)
			}).then(res =>{
				if(!this.dataSourceObj){
					let dataSource = res.data.dataSource
					let obj = {}
					dataSource.map((item)=>{
						obj[item.id] = item.dataSourceName
					})
					this.dataSourceObj = obj
				}
				res.data.task.records.map((item)=>{
					item.dataSourceName = this.dataSourceObj[item.dataSourceId]
				})
				this.dataSourceList = res.data.task.records
				this.pagination.count = res.data.task.total
			})
            .catch(res=>{
            	console.log(res)
            })
		},
	}
}
</script>

<style lang="scss" scoped>
.label{
    margin-left: 30px;
}


.leftBorder{
	display: inline-block;
	vertical-align: middle;
	background: #5d7cd8;
	width: 5px;
	height: 20px;
	margin-right: 15px;
}
</style>