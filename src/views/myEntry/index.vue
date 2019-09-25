<template>
	<div>
		<ul class="statusList">
			<li :class="item.choosed?'choosed':''" @click="chooseStatus(item)" v-for="(item,index) in statusList">{{item.name}}</li>
		</ul>
		<el-table
		    :data="MyEntryList"
		    border
		    style="width: 100%">
		    <el-table-column prop="date" label="词条名称" width="180"></el-table-column>
			<el-table-column prop="name" label="保存时间" width="180"></el-table-column>
			<el-table-column prop="address" label="提交时间"></el-table-column>
			<el-table-column prop="date" label="审核时间" width="180"></el-table-column>
			<el-table-column prop="name" label="审核人员" width="180"></el-table-column>
			<el-table-column prop="address" label="审核意见"></el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">继续修改</el-button>
        			<el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
        			<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
				</template>
			</el-table-column>
		  </el-table>
		  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
	</div>
</template>

<script>
import {userEntryList} from '@/api/onlyShowData/index.js'
export default {
	
	name: 'myEntry',
	data() {
	    return {
	    	statusList:[
	    		{id:'1',name:'草稿'},
	    		{id:'2',name:'待审核'},
	    		{id:'3',name:'已通过'},
	    		{id:'4',name:'未通过'},
	    	],
	    	MyEntryList:[],
	    	status:'1',
	    	pagination: {
		      page: 1,
		      limit: 10,
		      count: 0
		    },
	    }
	},
	watch: {
		
	},
	created() {
		this.userEntryList()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		handleSizeChange(val) {
			this.pagination.page = 1
			this.pagination.limit = val
			this.userEntryList()
		},
		handleCurrentChange(val) {
			this.pagination.page = val
			this.userEntryList()
		},
		userEntryList() {
			userEntryList({
				pageNumber: this.pagination.page,
				pageSize: this.pagination.limit,
				auditState: this.status
			}).then(res =>{
				this.MyEntryList = res.data.records
				this.pagination.count = res.data.total
			})
            .catch(res=>{
            	console.log(res)
            })
		},
		chooseStatus(item) {
			this.statusList.map((item)=>{
				item.choosed = false
			})
			item.status = item.id
			item.choosed = true
		},
	}

}
</script>

<style lang="scss" scoped>
.statusList{
	li{
		display: inline-block;
		background: #e6e6e6;
		color: #adadad;
		font-weight: bold;
		font-size: 18px;
		width: 90px;
		text-align: center;
		border-right: 1px solid #d0d0d0;
		line-height: 40px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	.choosed{
		background: #337ab7;
		color: white;
	}
}	
</style>