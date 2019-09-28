<template>
	<div>
		
		<div>
			<div v-for="item in entryListData">
				
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
		$route(){
	       console.log(this.$route.query.content)
	    },
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
	
</style>