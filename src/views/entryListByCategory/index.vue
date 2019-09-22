<template>
	<div>
		<p>根据分类查询词条列表</p>
		<ul class="categoryList">
			<li :class="item.choosed?'highlight':''" @click="list(item)" v-for="item in categoryList"><p>{{item.name}}</p></li>
		</ul>
		<div class="noDataRemindContent" v-if="!entryList.length">当前分类暂无词条</div>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
	</div>
</template>

<script>

import {categoryTree} from '@/api/classifyManager/index.js'
export default {
	
	name: 'entryListByCategory',
	data() {
	    return {
	    	entryList:[],
	    	categoryList:[],
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
		this.getChoosedCategoryInfo()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		routeToEntry(id) {
			this.$router.push({
				name: 'entryDetail',
				params: {'id': id}
			})
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
		//根据分类id获取词条列表
		list(item) {
			this.categoryList.forEach((item)=>{
				item.choosed = false
			})
			item.choosed = true
			console.log(item.id)
			this.pagination.count = 100
		},
		//根据本地存储的首页传参高亮显示首页选中的分类
		getChoosedCategoryInfo() {
			try{
				var obj = JSON.parse(sessionStorage.getItem('choosedCategoryInfo'))
				this.categoryList = obj.thirdAry
				this.list(this.categoryList[obj.index2])
			}catch(e){
				//TODO handle the exception
			}
		},
		
	}

}
</script>

<style lang="scss" scoped>
.highlight{
	color: #338ce6;
}
.el-pagination{
	text-align: center;
}
.noDataRemindContent{
	text-align: center;
	padding: 20px 0;
}
.categoryList{
	font-size: 14px;
	color: #7b7d7f;
	background: #eaf4fe;
	list-style: none;
	margin: 0;
	padding: 0;
	
	li{
		display: inline-block;
		margin: 0;
		line-height: 40px;
		text-align: center;
		padding: 5px 0;
		border-bottom: 1px solid white;
		p{
			padding: 0 20px;
			border-right: 1px solid white;
			
		}
		
	}
}
</style>