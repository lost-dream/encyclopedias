<template>
	<div>
		<el-row class="specialInfo">
			<el-col :span="18">
				<!--<img :src="info.specialCoverUrl" alt="" />-->
				<img src="https://img3.qianzhan.com/news/201909/21/20190921-68d01e93279b5b65_680x5000.jpg"/>
			</el-col>
			<el-col class="content" :span="6">
				<p class="title">{{info.specialName}}</p>
				<p>{{info.specialDesc}}</p>
			</el-col>
		</el-row>
		<ul class="entryList">
			<li @click="seeEntry(item)" v-for="item in entryList">
				<img v-if="item.entrySummarys.length&&item.entrySummarys[0].summary&&JSON.parse(item.entrySummarys[0].summary).img" :src="PREFIX.IMG_PREFIX + JSON.parse(item.entrySummarys[0].summary).img" alt="" />
				<img v-else src="/static/image/tank.png"/>
				<div>
					<p class="entry-title">{{item.entryName}}</p>
					<div v-if="item.entrySummarys.length&&item.entrySummarys[0].summary" v-html="JSON.parse(item.entrySummarys[0].summary).text"></div>
				</div>
			</li>
		</ul>
		<div class="noDataRemindContent" v-if="!entryList.length">当前专题暂无词条</div>
		<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
	</div>
</template>

<script>
import {specialInfo,} from '@/api/special/index.js'
export default {
	
	name: 'special',
	data() {
	    return {
	    	specialId:'',
	    	info:{},
	    	entryList:[],
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
		this.specialId = sessionStorage.getItem('specialId')
		this.specialInfo()
	},
	mounted() {},
	destroyed() {

	},
	methods: {
		seeEntry (hash) {
            console.log(hash)
            this.$router.push({
                name:'viewEntry',
                query:{
                    entryId:hash.id,
//                    versionId: hash.ID,
                    viewType: 'view'
                }
            })
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
			this.specialInfo()
		},
		handleCurrentChange(val) {
			this.pagination.page = val
			this.specialInfo()
		},
		specialInfo() {
			specialInfo({
				id: this.specialId,
				pageNumber:this.pagination.page,
				pageSize:this.pagination.limit,
			}).then((res) => {
				this.info = res.data.special
				this.entryList = res.data.records
				this.pagination.count = res.data.total
			})
		}
	}

}</script>

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
		font-size: 14px;
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
			font-size: 16px;
			color: black;
			text-align: center;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
		div{
			padding: 0 20px;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 8;
			overflow: hidden;
		}
	}
}
.el-pagination{
	text-align: center;
}
.noDataRemindContent{
	text-align: center;
	padding: 20px 0;
}
.specialInfo{
	background: #6d7377;
	font-size: 0;
	position: relative;
	overflow: hidden;
	margin-top: 20px;
	img{
		width: 100%;
	}
	.content{
		background: #6d7377;
		color: white;
		font-size: 14px;
		line-height: 20px;
		padding: 30px 20px 20px 50px;
		position: absolute;
		right: 0;
		top: 0;
	}
	.title{
		text-align: center;
		font-size: 16px;
	}
}
</style>