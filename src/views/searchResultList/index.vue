<template>
	<div>
		
		<div class="entryListData">
			<div v-for="item in entryListData">
				<!--<img src="../../assets/index/03.png" alt="" />
				<div>
					<p>{{item.ENTRY_NAME}}</p>
					<p class="desc">111122222</p>
				</div>-->
				<img v-if="item.SUMMARY.length" :src="JSON.parse(item.SUMMARY[0]).img" alt="" />
				<img v-else src="../../assets/index/03.png" alt="" />
				<div>
					<p>{{item.ENTRY_NAME}}</p>
					<p class="desc" v-if="item.SUMMARY.length">{{JSON.parse(item.SUMMARY[0]).text}}</p>
					<p class="desc" v-else>暂无描述</p>
				</div>
			</div>
		</div>
		
		<div class="noDataRemindContent" v-if="!entryListData.length">当前搜索词暂无词条，请换一个试试</div>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
	
	</div>
</template>

<script>
import {entryList} from '@/api/onlyShowData/index.js'
export default {
	
	name: 'searchResultList',
	data() {
	    return {
	    	keyword:'',
	    	pagination: {
		      page: 1,
		      limit: 10,
		      count: 0
		    },
		    entryListData:[]
	    }
	},
	watch: {
		
	},
	created() {
		this.keyword = this.$route.query.content
		this.entryList()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		handleSizeChange(val) {
			this.pagination.page = 1
			this.pagination.limit = val
			this.entryList()
		},
		handleCurrentChange(val) {
			this.pagination.page = val
			this.entryList()
		},
		entryList(){
			entryList({
				pageNumber: this.pagination.page,
				pageSize: this.pagination.limit,
				"categoryId": "",
				"keyword": this.keyword
			}).then((res)=>{
				this.entryListData = res.data.records
				this.pagination.count = res.data.total
			})
		}
	}

}
</script>

<style lang="scss" scoped>
	.entryListData{
		>div{
			line-height: 36px;
			font-size: 16px;
			font-weight: bold;
			display: flex;
			img{
				width: 160px;
				height: 120px;
				margin-right: 20px;
			}
			.desc{
				line-height: 20px;
				font-weight: normal;
				font-size: 14px;
			}
		}
	}
</style>