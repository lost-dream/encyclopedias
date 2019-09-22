<template>
	<div>
		<p>专题</p>
		<p>专题详情</p>
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
		<p>专题所属词条列表</p>
		
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
	    	total:'',
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
		this.list()
	},
	mounted() {},
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
		list() {
			this.pagination.count = 100
		},
		specialInfo() {
			specialInfo({
				id: this.specialId
			}).then((res) => {
				this.info = res.data
			})
		}
	}

}</script>

<style lang="scss" scoped>
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