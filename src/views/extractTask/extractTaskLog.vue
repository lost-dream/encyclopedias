<template>
	<div>
		
		
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				提取日志
			</div>
			
			<el-table
			class="departTable"
		    :data="dataSourceList"
		    border
		    :header-cell-style="{background:'#ecedf2',color:'#67686d'}"
		    style="width: 100%">
		    <el-table-column label="任务名称">{{taskName}}</el-table-column>
		    <el-table-column prop="startTime" label="开始时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.startTime)}}
				</template>
		    </el-table-column>
		    <el-table-column prop="endTime" label="结束时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.endTime)}}
				</template>
		    </el-table-column>
		    <el-table-column prop="status" label="运行状态">
		    	<template slot-scope="scope">
					{{statusObj[scope.row.runStatus]}}
				</template>
		    </el-table-column>
		    
		    
		    
		    <el-table-column prop="processedTotalNum" label="处理条数"></el-table-column>
		    <el-table-column prop="processedSuccessNum" label="成功条数"> </el-table-column>
		    <el-table-column prop="processedFailNum" label="失败条数"></el-table-column>
			
		  </el-table>
		  
		</el-card>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
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
import {extractTaskLog} from '@/api/extractTask/index.js'
import {parseTimeYMD} from '@/utils/commonMethod.js'
export default {
	name: 'extractTaskLog',
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
	    		'-1':'删除',
	    		'0':'停止',
	    		'1':'待运行',
	    		'2':'运行中',
	    		'3':'运行完成',
	    		'4':'运行失败',
	    	},
	    	pagination: {
		      page: 1,
		      limit: 10,
		      count: 0
		    },
		    extractTaskId:''
      	}
    },
	created() {
		this.extractTaskId = this.$route.query.id
		this.taskName = this.$route.query.taskName
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
		see(item) {
			console.log(item)
			this.$router.push({
				name:'dataSourceManager',
				query:{
					id:item.id,
					type:'see'
				}
			})
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
			extractTaskLog({
				pageNumber: this.pagination.page,
				pageSize: this.pagination.limit,
				extractTaskId: this.extractTaskId,
			}).then(res =>{
				this.dataSourceList = res.data.records
				this.pagination.count = res.data.total
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