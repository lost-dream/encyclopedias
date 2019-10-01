<template>
	<div>
		<el-row style="margin: 0 0 0 20px;">
			<span>数据源类型：</span>
			<el-select style="width: 100px;margin-bottom: 20px;" v-model="dataSourceType" placeholder="请选择数据源类别">
		      <el-option label="oracle" value="1"></el-option>
		      <el-option label="达梦" value="2"></el-option>
		      <el-option label="ftp" value="3"></el-option>
		    </el-select>
		</el-row>
		
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				数据源列表
			</div>
			<el-table
			class="departTable"
		    :data="dataSourceList"
		    border
		    style="width: 100%">
		    <el-table-column prop="dataSourceName" label="名称"></el-table-column>
		    <!--<el-table-column prop="dataSourceType" label="类型">
		    	<template slot-scope="scope">
					{{dataSourceTypeObj[scope.row.dataSourceType]}}
				</template>
		    </el-table-column>-->
		    <el-table-column prop="host" label="主机IP"></el-table-column>
		    <el-table-column prop="port" label="端口"></el-table-column>
		    <el-table-column prop="userName" label="用户名"></el-table-column>
		    <el-table-column prop="password" label="密码"></el-table-column>
		    <el-table-column prop="serverName" label="服务名"></el-table-column>
		    <el-table-column prop="filePath" label="文件路径"></el-table-column>
		    <el-table-column prop="status" label="状态">
		    	<template slot-scope="scope">
					{{statusObj[scope.row.status]}}
				</template>
		    </el-table-column>
		    <el-table-column prop="creator" label="创建人"></el-table-column>
		    <el-table-column prop="createTime" label="创建时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.createTime)}}
				</template>
		    </el-table-column>
		    <el-table-column prop="updator" label="最后编辑人"></el-table-column>
		    <el-table-column prop="updateTime" label="最后编辑时间">
		    	<template slot-scope="scope">
					{{parseTime(scope.row.updateTime)}}
				</template>
		    </el-table-column>
		    
			<el-table-column fixed="right" label="操作" width="150">
				<template slot-scope="scope">
					<el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
        			<el-button v-if="scope.row.STATE!==3" @click="deleteData(scope.row)" type="text" size="small">删除</el-button>
        			<el-button @click="see(scope.row)" type="text" size="small">查看</el-button>
				</template>
			</el-table-column>
		  </el-table>
		  
		</el-card>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
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



.leftBorder{
	display: inline-block;
	vertical-align: middle;
	background: #5d7cd8;
	width: 5px;
	height: 20px;
	margin-right: 15px;
}
</style>