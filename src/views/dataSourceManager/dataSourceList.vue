<template>
	<div>
		
		
		
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				数据源管理列表
			</div>
			
			<el-row>
				<span>名称：</span>
				<el-input style="width: 125px;" v-model="keyword" type="text" placeholder=""></el-input>
				<span class="label">类型：</span>
				<el-select style="width: 100px;margin-bottom: 20px;" v-model="dataSourceType" placeholder="请选择数据源类别">
			      <el-option label="oracle" value="1"></el-option>
			      <el-option label="达梦" value="2"></el-option>
			      <el-option label="ftp" value="3"></el-option>
			    </el-select>
			    
			    <el-button style="background: #587dda;margin-left: 35px;" @click="auditList" type="primary">查询</el-button>
			    <el-button style="background: #56bd9d;margin-left: 35px;" @click="add" type="primary">新增</el-button>
			</el-row>
			
			<el-table
			class="departTable"
		    :data="dataSourceList"
		    border
		    :header-cell-style="{background:'#ecedf2',color:'#67686d'}"
		    style="width: 100%">
		    <el-table-column prop="dataSourceName" label="数据源名称"></el-table-column>
		    <el-table-column prop="dataSourceType" label="数据源类别">
		    	<template slot-scope="scope">
					{{dataSourceTypeObj[scope.row.dataSourceType]}}
				</template>
		    </el-table-column>
		    <el-table-column prop="creator" label="创建人员"></el-table-column>
		    <el-table-column prop="createTime" label="创建时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.createTime)}}
				</template>
		    </el-table-column>
		    
		    
			<el-table-column fixed="right" label="操作" width="200">
				<template slot-scope="scope">
					<el-button @click="modify(scope.row)" type="text" size="small">编辑</el-button>
        			<el-button style="margin-left: 50px;color: #f7b2ad;" @click="deleteData(scope.row)" type="text" size="small">删除</el-button>
        			<!--<el-button @click="see(scope.row)" type="text" size="small">查看</el-button>-->
				</template>
			</el-table-column>
		  </el-table>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
		</el-card>
	</div>
</template>

<script>
import {list,deleteSource} from '@/api/dataSource/index.js'
import {parseTime} from '@/utils/commonMethod.js'
export default {
	name: 'dataSourceList',
	data() {
	    return {
	    	dataSourceList:[],
	    	dataSourceType:'1',
	    	keyword:'',
	    	dataSourceTypeObj:{
	    		'1':'oracle',
	    		'2':'达梦',
	    		'3':'ftp',
	    	},
	    	statusObj:{
	    		'1':'成功',
	    		'2':'失败'
	    	},
	    	pagination: {
		      page: 1,
		      limit: 10,
		      count: 0
		    },
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
				name:'dataSourceManager',
			})
		},
		modify(item) {
			this.$router.push({
				name:'dataSourceManager',
				query:{
					id:item.id,
					type:'modify'
				}
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
				dataSourceType: this.dataSourceType
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