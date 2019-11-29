<template>
	<div style="margin-bottom: 20px">
		<ul class="categoryList">
			<li :class="item.choosed?'highlight':''" @click="choose(item)" v-for="item in categoryList"><p>{{item.name}}</p></li>
		</ul>
		<ul class="entryList">
			<li @click="seeEntry(item)" v-for="item in entryListData">
				<img v-if="item.SUMMARY.length&&item.SUMMARY[0].summary&&JSON.parse(item.SUMMARY[0].summary).img" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img" alt="" />
				<img v-else src="/static/image/tank.png"/>
				<div>
					<p class="entry-title">{{item.ENTRY_NAME}}</p>
					<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
				</div>
			</li>
		</ul>
		<div class="noDataRemindContent" v-if="!entryListData.length">当前分类暂无词条</div>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
	</div>
</template>

<script>
import {entryList} from '@/api/onlyShowData/index.js'
export default {
	
	name: 'entryListByCategory',
	data() {
	    return {
	    	entryListData:[],
	    	categoryList:[],
	    	pagination: {
		      page: 1,
		      limit: 12,
		      count: 0
		    },
		    categoryId:'',
		    
	    }
	},
	watch: {
		categoryId() {
			this.pagination.page = 1
			this.list()
		}
	},
	created() {
		this.getChoosedCategoryInfo()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		seeEntry (hash) {
            console.log(hash)
            this.$router.push({
                name:'viewEntry',
                query:{
                    entryId:hash.ENTRY_ID,
//                    versionId: hash.ID,
                    viewType: 'view'
                }
            })
		},
		choose(item) {
			this.categoryList.map((item)=>{
				item.choosed = false
			})
			item.choosed = true
			this.categoryId = item.id
		},
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
			entryList({
				"pageNumber": this.pagination.page,
				"pageSize": this.pagination.limit,
				"categoryIds": this.categoryId,
				"keyword": ""
			}).then((res)=>{
				this.entryListData = res.data.records
				this.pagination.count = res.data.total
			})
			
		},
		//根据本地存储的首页传参高亮显示首页选中的分类
		getChoosedCategoryInfo() {
			try{
				var obj = JSON.parse(sessionStorage.getItem('choosedCategoryInfo'))
				obj.thirdAry.map((item)=>{
					item.choosed = false
				})
				this.categoryList = obj.thirdAry
				this.categoryId = this.categoryList[obj.index2].id
				this.categoryList[obj.index2].choosed = true
			}catch(e){
				//TODO handle the exception
			}
		},
		
	}

}
</script>

<style lang="scss" scoped>
.entryList{
	
	width: 1210px;
	margin: auto;
	margin-top: 20px;
	li{
		display:inline-block;
		vertical-align: top;
		width: 280px;
		height: 430px;
		background: #f6fafb;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		line-height: 25px;
		margin-right: 30px;
		margin-bottom: 30px;
		font-size: 26px;
		color: #666666;
		
		
		&:nth-child(4n+4){
			margin-right: 0;
		}
		&:hover{
			cursor: pointer;
			opacity: 0.8;
		}
		img{
			width: 100%;
			height: 120px;
			border-radius: 5px;
			margin-bottom: 10px;
		}
		.entry-title{
			line-height: 45px;
			font-weight: bold;
			font-size: 28px;
			color: black;
			text-align: center;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
		div{
			font-size: 26px;
			padding: 0 20px;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 8;
			overflow: hidden;
		}
	}
}



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
	font-size: 26px;
	color: #7b7d7f;
	background: #eaf4fe;
	list-style: none;
	margin: 0;
	padding: 0;
	margin-top: 20px;
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
			cursor: pointer;
		}
		p:hover{
			color: #338ce6;
		}
		
	}
}
</style>