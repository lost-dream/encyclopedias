<template>
	<div>
		<p>首页</p>
		<div class="title">
			<span>最新词条</span>
		</div>
		<div id="entryStatisticalData">
			<p>
				<img src="../../assets/index/01.png"/>
				<span class="data">{{entryStatisticalData.totalEntry}}</span>
				<span>个词条</span>
			</p>
			<p>
				<img src="../../assets/index/02.png"/>
				<span class="data">{{entryStatisticalData.totalEntryEitor}}</span>
				<span>次编辑</span>
			</p>
			<p>
				<img src="../../assets/index/03.png"/>
				<span class="data">{{entryStatisticalData.totalEditor}}</span>
				<span>人编写</span>
			</p>
			
		</div>
		<div class="title">
			<span>特色专题</span>
		</div>
		<el-carousel :interval="2000000" type="card" height="530px">
			<el-carousel-item v-for="item in specialListData" :key="item.id">
				<div @click="routeToSpecial(item.id)" class="specialList">
					<!--<img :src="item.specialCoverUrl" alt="" />-->
					<img src="https://img3.qianzhan.com/news/201909/21/20190921-68d01e93279b5b65_680x5000.jpg"/>
					<div>
						<p>{{item.specialName}}</p>
						<div>{{item.specialDesc}}</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
		
		<div class="title">
			<span>精选分类</span>
		</div>
	</div>
</template>

<script>
import {entryStatistical,} from '@/api/onlyShowData/index.js'
import {specialList,} from '@/api/special/index.js'
export default {
	
	name: 'index',
	data() {
	    return {
	    	entryStatisticalData:{},
	    	specialListData:[],
	    }
	},
	watch: {
		
	},
	created() {
		this.entryStatistical()
		this.specialList()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		routeToSpecial(id) {
			sessionStorage.setItem('specialId',id)
			this.$router.push('special')
		},
		specialList() {
			specialList({
				"pageNumber": 1,
				"pageSize": 10,
				"keyword": ''
			}).then((res)=>{
				this.specialListData = res.data.records
			})
		},
		entryStatistical() {
			entryStatistical({}).then((res)=>{
				this.entryStatisticalData = res.data
				var list = document.querySelectorAll('.data')
				var ary = []
				for(let i = 0;i<list.length;i++){
					ary.push(list[i].offsetWidth)
				}
				ary.sort(function (a, b) {
				  return a-b;
				})
				for(let i = 0;i<list.length;i++){
					list[i].style.width = ary[ary.length-1]+'px'
				}
			})
		},
		
	}

}
</script>

<style lang="scss" scoped>
.specialList{
	width: 360px;
	height: 530px;
	background: #f6fafb;
	margin: auto;
	position: relative;
	img{
		width: 100%;
	}
	>div{
		width: 324px;
		height: 288px;
		padding: 20px 0 30px 0;
		background: white;
		border-radius: 5px;
		position: absolute;
		top: 160px;
		left: calc(50% - 162px);
		p{
			text-align: center;
			font-size: 16px;
			font-weight: bold;
		}
		div{
			font-size: 14px;
			padding: 0 30px;
		}
	}
}
.el-carousel__item{
	background: white;
}
.title{
	color: #338ce6;
	font-weight: bold;
	font-size: 20px;
	line-height: 55px;
}
#entryStatisticalData{
	color: #338ce6;
	font-size: 15px;
	img{
		vertical-align: sub;
	}
	p{
		line-height: 35px;
		.data{
			font-size: 30px;
			text-align: right;
			display: inline-block;
		}
		span:last-child{
			margin-left: 20px;
			color: #666666;
		}
	}
}
	
</style>