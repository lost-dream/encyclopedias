<template>
	<div >
		<el-row class="versionHistory" style="max-width:1080px;margin: 40px auto 20px">
			<el-col :span="4">
				<el-image src="" style="width: 160px;height: 160px;padding:10px"></el-image>
			</el-col>
			<el-col :span="20" style="margin-top: 10px;">
				<el-row style="padding: 20px 40px;font-size: 20px;font-weight: bold;color:rgb(51, 140, 230);border-bottom: 1px solid #eee">Creator</el-row>
				<el-row>
					<el-col :span="4" style="border-right: 1px solid #eee;">
						<el-row style="text-align: center;padding: 15px 0;font-weight: bold;color:#444">提交版本</el-row>
						<el-row style="text-align: center;padding: 15px 0;color:#444">13</el-row>
					</el-col>
					<el-col :span="4" style="border-right: 1px solid #eee;">
						<el-row style="text-align: center;padding: 15px 0;font-weight: bold;color:#444">通过版本</el-row>
						<el-row style="text-align: center;padding: 15px 0;color:#444">6</el-row>
					</el-col>
					<el-col :span="4">
						<el-row style="text-align: center;padding: 15px 0;font-weight: bold;color:#444">通过率</el-row>
						<el-row style="text-align: center;padding: 15px 0;color:#444">46.15%</el-row>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<div style="max-width: 1280px;margin: 0 auto">

			<ul class="statusList" style="margin-left: 40px;margin-top: 40px;">
				<li :class="item.choosed?'choosed':''" @click="chooseStatus(item)" v-for="(item,index) in statusList">{{item.name}}</li>
			</ul>
			<el-table
					class="departTable"
					:data="MyEntryList"
					border
					style="width: 100%">
				<el-table-column prop="ENTRY_NAME" label="词条名称" width="180"></el-table-column>
				<el-table-column label="保存时间" width="180">
					<template slot-scope="scope">
						{{parseTime(scope.row.CREATE_TIME)}}
					</template>
				</el-table-column>
				<el-table-column label="提交时间" width="180">
					<template slot-scope="scope">
						{{parseTime(scope.row.CREATE_TIME)}}
					</template>
				</el-table-column>
				<el-table-column label="审核时间" width="180">
					<template slot-scope="scope">
						{{parseTime(scope.row.AUDIT_TIME)}}
					</template>
				</el-table-column>
				<el-table-column prop="AUDITOR" label="审核人员" width="180"></el-table-column>
				<el-table-column prop="AUDIT_CONTENT" label="审核意见"></el-table-column>
				<el-table-column fixed="right" label="操作" width="150">
					<template slot-scope="scope">
						<el-button v-if="scope.row.STATE!==3" @click="modifyEntry(scope.row)" type="text" size="small">继续修改</el-button>
						<el-button v-if="scope.row.STATE!==3" @click="deleteEntry(scope.row)" type="text" size="small">删除</el-button>
						<el-button @click="seeEntry(scope.row)" type="text" size="small">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>

		</div>
	</div>
</template>

<script>
import {userEntryList} from '@/api/onlyShowData/index.js'
import {deleteEntry} from '@/api/entry/index.js'
import {parseTime} from '@/utils/commonMethod.js'
import ElImage from "../../../node_modules/element-ui/packages/image/src/main.vue";
export default {

    components: {ElImage},
    name: 'myEntry',
	data() {
	    return {
	    	statusList:[
	    		{id:'1',name:'草稿',choosed:true},
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
		status() {
			this.pagination.page = 1
			this.userEntryList()
		}
	},
	created() {
		this.userEntryList()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		modifyEntry(item) {
			this.$router.push({
				name:'editEntry',
				query:{
					entryId:item.ENTRY_ID,
					versionId: item.ID,
					viewType: 'preview'
				}
			})
		},
		deleteEntry(item) {
			this.$confirm('确认删除当前词条？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning',
	          center: true
	        }).then(() => {
	        	deleteEntry({
	        		entryId:item.ENTRY_ID,
	        		versionId:item.ID,
	        	}).then((res)=>{
	        		this.$message('删除成功');
	        		this.pagination.page = 1
					this.userEntryList()
	        	})
	        	
	        }).catch(() => {
	          
	        });
			
		},
		seeEntry(item) {
			console.log(item)
			this.$router.push({
				name:'viewEntry',
				query:{
					entryId:item.ENTRY_ID,
					versionId: item.ID,
					viewType: 'preview'
				}
			})
		},
		
		parseTime(str) {
			return parseTime(str)
		},
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
			this.status = item.id
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
		cursor: pointer;
	}
	.choosed{
		background: #337ab7;
		color: white;
	}
}	
</style>