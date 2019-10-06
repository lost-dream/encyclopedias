<template>
	<div>
		
		
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				词条版本审核列表
			</div>
			<el-row style="margin: 0 0 0 20px;">
				<span class="label">分类：</span>
				<el-input style="width: 125px;" v-model="categoryId" type="text" placeholder=""></el-input>
				<span class="label">词条名称：</span>
				<el-input style="width: 125px;" v-model="keyword" type="text" placeholder=""></el-input>
				<span class="label">标签：</span>
				<el-input style="width: 125px;" v-model="label" type="text" placeholder=""></el-input>
				<span class="label">状态：</span>
				<el-select style="width: 125px;margin-bottom: 20px;" v-model="auditState" placeholder="请选择词条状态">
			      <el-option label="待审核" value="2"></el-option>
			      <el-option label="审核通过" value="3"></el-option>
			      <el-option label="审核不通过" value="4"></el-option>
			      <el-option label="已发布" value="5"></el-option>
			      <el-option label="取消发布" value="6"></el-option>
			    </el-select>
			    
			    <el-button style="background: #587dda;margin-left: 35px;" @click="auditList" type="primary">查询</el-button>
			    
			    
			</el-row>
			<el-table
			class="departTable"
		    :data="dataSourceList"
		    border
		    :header-cell-style="{background:'#ecedf2',color:'#67686d'}"
		    style="width: 100%">
		    <el-table-column prop="ENTRY_NAME" label="名称"></el-table-column>
		    <el-table-column prop="SUMMARY" label="描述">
		    	<template v-if="scope.row.SUMMARY" slot-scope="scope">
					{{JSON.parse(scope.row.SUMMARY.summary).text}}
				</template>
		    </el-table-column>
		    <el-table-column prop="CREATOR" label="创建人员"></el-table-column>
		    <el-table-column prop="CREATE_TIME" label="创建时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.CREATE_TIME)}}
				</template>
		    </el-table-column>
		    <el-table-column prop="STATE" label="状态">
		    	<template slot-scope="scope">
					{{statusObj[scope.row.STATE]}}
				</template>
		    </el-table-column>
		    <el-table-column prop="RN" label="版本"></el-table-column>
			<el-table-column fixed="right" label="操作" width="150">
				<template slot-scope="scope">
					<el-button v-if="scope.row.STATE===2||scope.row.STATE===4" style="color: #7291e1;" @click="openDialog(scope.row,'3')" type="text" size="small">通过</el-button>
        			
        			<el-button v-if="scope.row.STATE===2||scope.row.STATE===3||scope.row.STATE===6" style="color: #e36d72;" @click="openDialog(scope.row,'4')" type="text" size="small">不通过</el-button>
        			<el-button v-if="scope.row.STATE===3||scope.row.STATE===6" style="color: #e36d72;" @click="openDialog(scope.row,'5')" type="text" size="small">发布</el-button>
        			<el-button v-if="scope.row.STATE===5" style="color: #e36d72;" @click="openDialog(scope.row,'6')" type="text" size="small">取消发布</el-button>
				</template>
			</el-table-column>
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
import {auditList,audit} from '@/api/entry/index.js'
import {parseTime} from '@/utils/commonMethod.js'
export default {
	name: 'entryVersionExamine',
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
	    	keyword:'',
	    	label:'',
	    	categoryId:'',
	    	auditState:'2',
	    	statusObj:{
	    		'2':'待审核',
	    		'3':'审核通过',
	    		'4':'审核不通过',
	    	},
	    	pagination: {
		      page: 1,
		      limit: 10,
		      count: 0
		    },
      	}
    },
	created() {
		this.auditList()
	},
	watch: {
		auditState() {
			this.auditList()
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
				this.auditList()
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
			return parseTime(str)
		},
		handleSizeChange(val) {
			this.pagination.page = 1
			this.pagination.limit = val
			this.auditList()
		},
		handleCurrentChange(val) {
			this.pagination.page = val
			this.auditList()
		},
		auditList() {
			auditList({
				pageNumber: this.pagination.page,
				pageSize: this.pagination.limit,
				auditState: parseInt(this.auditState),
				keyword:this.keyword,
				categoryId:this.categoryId,
				label:this.label
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