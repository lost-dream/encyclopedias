<template>
	<div class="main-page">
		<div class="w1280">
			<div class="title">
				<span>最新词条</span>
			</div>
			<el-row>
				<el-col class="w800">
					<el-carousel :interval="2000000">
						<el-carousel-item v-for="item in entryListData" :key="item.id">
							<div @click="seeEntry(item)" class="entryList">
								<!--<img :src="item.specialCoverUrl" alt="" />-->
								<img src="/static/image/tank.png"/>
								<div>
									<p class="entry-title">{{item.ENTRY_NAME}}</p>
									<div v-if="item.SUMMARY.length">{{item.SUMMARY[0].summary}}</div>
								</div>
							</div>
						</el-carousel-item>
					</el-carousel>
				</el-col>
				<el-col class="w480">
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

						<el-button type="primary">创建词条</el-button>
						
					</div>
				</el-col>
			</el-row>
			
			
			
			
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
			<el-row>
				<el-col :span="24/categoryTreeList.length" v-for="(item,index) in categoryTreeList" :key="index">
					<el-card>
						<div :style="'background:#'+categoryBgColor[index]" class="categoryTreeList">
							<p :style="'background:#'+categoryTitleColor[index]">{{item.name}}</p>
							<ul>
								<li @click="showThirdCategory(index1,index)" class="secondCategory" v-for="(item1,index1) in item.children">
									{{item1.name}}
									<ul v-show="item1.showThirdCategory" v-if="item1.children.length">
										<li @click="routeToEntryList(item2.id,index2,item1.children)" v-for="(item2,index2) in item1.children">{{item2.name}}</li>
									</ul>
								</li>
							</ul>
							
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import {entryStatistical,entryList} from '@/api/onlyShowData/index.js'
import {specialList,} from '@/api/special/index.js'
import {categoryTree} from '@/api/classifyManager/index.js'
export default {
	
	name: 'index',
	data() {
	    return {
	    	entryStatisticalData:{},
	    	specialListData:[],
	    	categoryTreeList:[],
	    	entryListData:[],
	    	categoryTitleColor:['e9b937','6d56fb','079ea9','ec6b6b','199df2'],
	    	categoryBgColor:['f3ebd1','d9d4f5','c1dfe2','f7dee0','c6e3f5'],
	    }
	},
	watch: {
		
	},
	created() {
		this.entryStatistical()
		this.specialList()
		this.categoryTree()
		this.entryList()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		entryList() {
			entryList({
				"pageNumber": "1",
				"pageSize": "4",
				"categoryId": "",
				"keyword": ""
			}).then((res)=>{
				this.entryListData = res.data.records
			})
		},
		
		routeToEntryList(id2,index2,thirdAry) {
			var choosedCategoryInfo = {
				'id2':id2,
				'index2':index2,
				'thirdAry':thirdAry
			}
			sessionStorage.setItem('choosedCategoryInfo',JSON.stringify(choosedCategoryInfo))
			this.$router.push('entryListByCategory')
		},
		showThirdCategory(index1,index) {
			this.categoryTreeList[index].children.map((item)=>{
				item.showThirdCategory = false
			})
			this.categoryTreeList[index].children[index1].showThirdCategory = true
		},
		categoryTree() {
			categoryTree({}).then(res =>{
				res.data.children.map((item)=>{
					item.children.map((item1,index)=>{
						if(index === 0){
							item1.showThirdCategory = true
						}
						else{
							item1.showThirdCategory = false
						}
					})
				})
				this.categoryTreeList = res.data.children
            })
            .catch(res=>{
            	console.log(res)
            })
		},
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
				this.$nextTick(()=>{
					var list = document.querySelectorAll('.data')
					var ary = []
					for(let i = 0;i<list.length;i++){
						ary.push(list[i].offsetWidth)
					}
					ary.sort(function (a, b) {
					  return a-b;
					})
					
					// for(let i = 0;i<list.length;i++){
					// 	list[i].style.width = ary[ary.length-1]+'px'
					// }
				})
				
			})
		},

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
		}
	}

}
</script>

<style lang="scss" scoped>
.main-page {
	padding-top: 30px;
	background: url('/static/image/index-bg.png') 0 0 no-repeat;
	background-size: 100% 550px;
	.w1280 {
		width: 1280px;
		margin: 0 auto;
	}
	.w800 {
		width: 800px;
	}
	.w480 {
		width: 480px;
	}
}
.categoryTreeList{
	padding-bottom: 10px;
	font-size: 14px;
	color: #99acae;
	p{
		font-size: 16px;
		font-size: 16px;
		font-weight: bold;
		line-height: 40px;
		color: white;
		text-align: center;
	}
	ul{
		list-style: none;
		margin: 0;
		padding: 0;
		width: 50%;
		display: inline-block;
		li{
			margin: 0;
			padding: 0;
			line-height: 30px;
			text-align: center;
		}
	}
	.secondCategory{
		position: relative;
		border-right: 1px solid white;
		ul{
			position: absolute;
			right: -100%;
			top: 0;
			width: 100%;
		}
	}
}

.el-carousel {
	&/deep/ .el-carousel__container{
		height: 400px;
	}
}

.entryList{
	position: relative;
	width: 800px;
	height: 400px;

	image {
		width: 100%;
		height: 100%;
	}

	>div{
		position: absolute;
		left: 0;
		bottom: 0;
		background: rgba(0,0,0,0.3);
		color: white;
		width: calc(100% - 30px);
		padding: 0 15px;
		line-height: 25px;
		font-size: 16px;
		.entry-title{
			line-height: 30px;
			font-size: 14px;
			font-weight: bold;
		}
	}
}
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
	margin: 15px 0;
	padding-left: 90px;
	color: #338ce6;
	font-weight: bold;
	font-size: 20px;
	line-height: 55px;
	background: url('/static/image/title.png') no-repeat;
}
#entryStatisticalData{
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	height: 400px;
	padding: 40px 50px;
	box-sizing: border-box;
	color: #338ce6;
	font-size: 15px;
	img{
		vertical-align: sub;
	}
	p{
		width: 100%;
		vertical-align: middle;
    display: flex;
    align-items: center;
		justify-content: space-between;
		// line-height: 35px;
		img {
			margin-right: 16px;
		}
		.data{
			font-size: 30px;
			text-align: center;
			display: inline-block;
			min-width: 100px;
			max-width: 270px;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		span:last-child{
			margin-left: 20px;
			color: #666666;
		}
	}
}

.el-row+.title{
	margin-top: 60px;
}


.page-index {
	width: 1280px; 
	margin: 0 auto;
}
	
</style>