<template>
	<div class="main-page">
		<div class="w1280">
			<div class="title">
				<span>最新词条</span>
			</div>
			<el-row>
				<el-col class="w800">
					<el-carousel :interval="50000" type="card" height="500px">
						<el-carousel-item v-for="item in entryListData" :key="item.id">
							<div @click="seeEntry(item)" class="entryList ">
								<img v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img" alt="" />
								<!--<img src="/static/image/tank.png"/>-->
								<div>
									<p class="entry-title">{{item.ENTRY_NAME}}</p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</el-carousel-item>
					</el-carousel>
				</el-col>
				<el-col class="w480">
					<div id="entryStatisticalData">
						<div>
							<p>
								<img src="../../assets/index/01.png"/>
								<span class="data">{{toThousands(entryStatisticalData.totalEntry)}}</span>
								<span>个词条</span>
							</p>
						</div>
						<div>
							<p>
								<img src="../../assets/index/02.png"/>
								<span class="data">{{toThousands(entryStatisticalData.totalEntryEitor)}}</span>
								<span>次编辑</span>
							</p>
						</div>
						<div>
							<p>
								<img src="../../assets/index/03.png"/>
								<span class="data">{{toThousands(entryStatisticalData.totalEditor)}}</span>
								<span>人编写</span>
							</p>
						</div>
						<div>
							<el-button type="primary" @click="gotoCreate">创建词条</el-button>
							<el-button type="danger" @click="gotoMyEntry">我的词条</el-button>
						</div>

					</div>
				</el-col>
			</el-row>




			<div class="title">
				<span>特色专题</span>
			</div>
			<el-carousel :interval="5000" type="card" height="530px">
				<el-carousel-item v-for="item in specialListData" :key="item.id">
					<div @click="routeToSpecial(item.id)" class="specialList">
						<!--<img :src="item.specialCoverUrl" alt="" />-->
						<el-image
							:fit="'cover'"
							:src="item.specialCoverUrl">
							<div slot="error" class="image-slot">
					       		<img src="/static/image/tank.png" alt="" />
					      	</div>
						</el-image>
						
						
						
						<!--<el-image
							:fit="'cover'"
							:src="'https://img3.qianzhan.com/news/201909/21/20190921-68d01e93279b5b65_680x5000.jpg'">
						</el-image>-->
						<div>
							<p>{{item.specialName}}</p>
							<div>{{item.specialDesc}}</div>
						</div>
					</div>
				</el-carousel-item>
			</el-carousel>
			<div class="bgf6fafb">
				<div class="title" >
					<span>精选分类</span>
				</div>
				<div class="category-container" style="margin: 0;">
					<!--<div :style="'background:#'+categoryBgColor[index % 5]" class="category-item" v-for="(item,index) in categoryTreeList" :key="index">-->
					<!--<div class="categoryTreeList">-->
					<!--<p :style="'background:#'+categoryTitleColor[index % 5]">{{item.name}}</p>-->
					<!--<ul>-->
					<!--<li @click="routeToEntryList(item1.id,index1,item.children)" class="secondCategory" v-for="(item1,index1) in item.children">-->
					<!--{{item1.name}}-->
					<!--&lt;!&ndash;<ul v-show="item1.showThirdCategory" v-if="item1.children.length">-->
					<!--<li @click="routeToEntryList(item2.id,index2,item1.children)" v-for="(item2,index2) in item1.children">{{item2.name}}</li>-->
					<!--</ul>&ndash;&gt;-->
					<!--</li>-->
					<!--</ul>-->

					<!--</div>-->
					<!--</div>-->
					<div class="category-item" v-for="(item,index) in categoryTreeList" :key="index">
						<div class="categoryTreeList">
							<p style="color: #000;text-align: left">{{item.name}}</p>
							<ul>
								<li @click="routeToEntryList(item1.id,index1,item.children)" class="secondCategory" v-for="(item1,index1) in item.children">
									{{item1.name}}
									<!--<ul v-show="item1.showThirdCategory" v-if="item1.children.length">
                                        <li @click="routeToEntryList(item2.id,index2,item1.children)" v-for="(item2,index2) in item1.children">{{item2.name}}</li>
                                    </ul>-->
								</li>
							</ul>

						</div>
					</div>
				</div>
			</div>

			<div class="title">
				<span>分类推荐</span>
			</div>
			<template>

				<el-tabs tab-position="left" v-model="activeName" style="height: 450px;" @tab-click="handleClick">
					<el-tab-pane label="科技" name="6">
						<div style="display: flex;flex-wrap: wrap" v-if="categoryList.length">
							<div style="width: 45%;display: flex;padding: 10px;" v-for="item in categoryList" >
								<el-image class="cat-img" style="width: 150px;height: 120px;overflow: visible;background: #eee" v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img">
									<div slot="error" class="image-slot" style="width: 150px;height: 120px">
										<i class="el-icon-picture-outline" style="margin-left: 67px;margin-top: 52px"></i>
									</div>
								</el-image>
								<!--<img src="/static/image/tank.png"/>-->
								<div style="display: flex;flex-direction: column;padding: 10px;line-height: 25px">
									<p class="entry-title"><strong>{{item.ENTRY_NAME}}</strong></p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis3">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</div>
						<h2 v-else>该分类下没有词条</h2>
					</el-tab-pane>
					<el-tab-pane label="经济" name="5">
						<div style="display: flex;flex-wrap: wrap" v-if="categoryList.length">
							<div style="width: 45%;display: flex;padding: 10px;" v-for="item in categoryList" >
								<el-image class="cat-img" style="width: 150px;height: 120px;overflow: visible;background: #eee" v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img">
									<div slot="error" class="image-slot" style="width: 150px;height: 120px">
										<i class="el-icon-picture-outline" style="margin-left: 67px;margin-top: 52px"></i>
									</div>
								</el-image>
								<!--<img src="/static/image/tank.png"/>-->
								<div style="display: flex;flex-direction: column;padding: 10px;line-height: 25px">
									<p class="entry-title"><strong>{{item.ENTRY_NAME}}</strong></p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis3">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</div>
						<h2 v-else>该分类下没有词条</h2>
					</el-tab-pane>
					<el-tab-pane label="安全" name="4">
						<div style="display: flex;flex-wrap: wrap" v-if="categoryList.length">
							<div style="width: 45%;display: flex;padding: 10px;" v-for="item in categoryList" >
								<el-image class="cat-img" style="width: 150px;height: 120px;overflow: visible;background: #eee" v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img">
									<div slot="error" class="image-slot" style="width: 150px;height: 120px">
										<i class="el-icon-picture-outline" style="margin-left: 67px;margin-top: 52px"></i>
									</div>
								</el-image>
								<!--<img src="/static/image/tank.png"/>-->
								<div style="display: flex;flex-direction: column;padding: 10px;line-height: 25px">
									<p class="entry-title"><strong>{{item.ENTRY_NAME}}</strong></p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis3">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</div>
						<h2 v-else>该分类下没有词条</h2>
					</el-tab-pane>
					<el-tab-pane label="外交" name="3">
						<div style="display: flex;flex-wrap: wrap" v-if="categoryList.length">
							<div style="width: 45%;display: flex;padding: 10px;" v-for="item in categoryList" >
								<el-image class="cat-img" style="width: 150px;height: 120px;overflow: visible;background: #eee" v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img">
									<div slot="error" class="image-slot" style="width: 150px;height: 120px">
										<i class="el-icon-picture-outline" style="margin-left: 67px;margin-top: 52px"></i>
									</div>
								</el-image>
								<!--<img src="/static/image/tank.png"/>-->
								<div style="display: flex;flex-direction: column;padding: 10px;line-height: 25px">
									<p class="entry-title"><strong>{{item.ENTRY_NAME}}</strong></p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis3">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</div>
						<h2 v-else>该分类下没有词条</h2>
					</el-tab-pane>
					<el-tab-pane label="军事" name="2">
						<div style="display: flex;flex-wrap: wrap" v-if="categoryList.length">
							<div style="width: 45%;display: flex;padding: 10px;" v-for="item in categoryList" >
								<el-image class="cat-img" style="width: 150px;height: 120px;overflow: visible;background: #eee" v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img">
									<div slot="error" class="image-slot" style="width: 150px;height: 120px">
										<i class="el-icon-picture-outline" style="margin-left: 67px;margin-top: 52px"></i>
									</div>
								</el-image>
								<!--<img src="/static/image/tank.png"/>-->
								<div style="display: flex;flex-direction: column;padding: 10px;line-height: 25px">
									<p class="entry-title"><strong>{{item.ENTRY_NAME}}</strong></p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis3">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</div>
						<h2 v-else>该分类下没有词条</h2>
					</el-tab-pane>
					<el-tab-pane label="政治" name="1">
						<div style="display: flex;flex-wrap: wrap" v-if="categoryList.length">
							<div style="width: 45%;display: flex;padding: 10px;" v-for="item in categoryList" >
								<el-image class="cat-img" style="width: 150px;height: 120px;overflow: visible;background: #eee" v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="PREFIX.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img">
									<div slot="error" class="image-slot" style="width: 150px;height: 120px">
										<i class="el-icon-picture-outline" style="margin-left: 67px;margin-top: 52px"></i>
									</div>
								</el-image>
								<!--<img src="/static/image/tank.png"/>-->
								<div style="display: flex;flex-direction: column;padding: 10px;line-height: 25px">
									<p class="entry-title"><strong>{{item.ENTRY_NAME}}</strong></p>
									<div v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" class="ellipsis3">{{JSON.parse(item.SUMMARY[0].summary).text}}</div>
								</div>
							</div>
						</div>
						<h2 v-else>该分类下没有词条</h2>
					</el-tab-pane>
				</el-tabs>
			</template>
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
            activeName: '6',
	    	entryStatisticalData:{},
	    	specialListData:[],
	    	categoryTreeList:[],
	    	entryListData:[],
            categoryList: [],
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
		this.getCategoryList(6)
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

					for(let i = 0;i<list.length;i++){
						list[i].style.width = ary[ary.length-1]+1+'px'
					}
				})

			})
		},
		getCategoryList(id){
		  let vm = this
			vm.$axios.post('/wiki-backend/api/entry/list',{
                pageNumber:1,
				pageSize:6,
                categoryIds: id
			}).then(res=>{
				console.log(res)
				vm.categoryList = res.data.records
			})
		},
        handleClick() {
            console.log(this.activeName);
            this.getCategoryList(this.activeName)
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
		},
		gotoCreate(){
			this.$router.push({
				name: 'createEntry'
			})
		},
		gotoMyEntry(){
				this.$router.push({
						name: 'myEntry'
				})
		},
		// 数字转格式
		toThousands(num){
			return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
		}
	}

}
</script>

<style lang="scss" scoped>
.main-page {
	padding-top: 30px;
	// background: url('/static/image/index-bg.png') 0 0 no-repeat;
	// background-size: 100% 550px;
	.w1280 {
		width: 1280px;
		margin: 0 auto;
	}
	.w800 {
		width: 800px;
	}
	.w480 {
		width: 480px;
		padding: 0 30px;
	}
}
.title+.el-row {
	margin-bottom: 30px
}
.category-container {
	/*display: flex;
	flex-wrap: nowrap;
	flex-direction: row;*/
	margin-bottom: 50px;
	/*overflow-x: auto;*/
	/*// justify-content: center;*/
}
.category-item {
	min-width: 400px;
	display: inline-block;
	vertical-align: top;
	margin-bottom: 20px;
	height: 240px;
	ul{
		overflow-y: scroll;
		height: 195px;
	}
	
}
.category-item ul::-webkit-scrollbar {
 width: 1px;
}
 .category-item ul::-webkit-scrollbar-track {
 background-color: none;
 -webkit-border-radius: 2em;
 -moz-border-radius: 2em;
 border-radius:2em;
}
 .category-item ul::-webkit-scrollbar-thumb {
 background-color:white;
 -webkit-border-radius: 2em;
 -moz-border-radius: 2em;
 border-radius:2em;
}
.category-item {
	margin-left: 25px;
	&:nth-child(3n){
		ul{
			border-right: 0;
		}
	}
	/*&:nth-child(5n+1){*/
		/*margin-left: 25px;*/
	/*}*/
}
.categoryTreeList{
	padding-bottom: 10px;
	font-size: 14px;
	color: #99acae;

	p{
		font-size: 16px;
		font-weight: bold;
		line-height: 40px;
		color: white;
		text-align: center;
		/*box-shadow: 0 2px 5px 1px #848484;*/
		margin-bottom: 5px;
	}
	ul{
		list-style: none;
		margin: 0;
		padding: 0;
		display: inline-block;
		min-height: 160px;
		width: 400px;
		border-right: 1px solid #ccc;
		li{
			color: #666666;
			margin: 0;
			padding: 0;
			display: inline-block;
			width: calc(25% - 1px);
			line-height: 30px;
			text-align: left;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			&:nth-child(2n+1){
				border-right: 1px solid white;
			}
			&:hover{
				color: #338ce6;
				cursor: pointer;
			}
		}
		
	}
	.secondCategory{
		position: relative;
		/*border-right: 1px solid white;*/
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

/*.entryList{*/
	/*&:hover{*/
		/*cursor: pointer;*/
		/*opacity: 0.8;*/
	/*}*/
	/*position: relative;*/
	/*width: 800px;*/
	/*height: 400px;*/

	/*image {*/
		/*width: 100%;*/
		/*height: 100%;*/
	/*}*/

	/*>div{*/
		/*position: absolute;*/
		/*left: 0;*/
		/*bottom: 0;*/
		/*background: rgba(0,0,0,0.3);*/
		/*color: white;*/
		/*width: calc(100% - 30px);*/
		/*padding: 0 15px;*/
		/*line-height: 25px;*/
		/*font-size: 16px;*/
		/*.entry-title{*/
			/*line-height: 30px;*/
			/*font-size: 14px;*/
			/*font-weight: bold;*/
		/*}*/
	/*}*/
/*}*/
.entryList{
	&:hover{
		cursor: pointer;
		opacity: 0.8;
	}
	margin-left: 65px;
	position: relative;
	width: 267px;
	height: 400px;

	image {
		width: 100%;
		height: 100%;
	}
	>img{
		width: 267px;
	}
	>div{
		position: absolute;
		left: 0;
		bottom: 0;
		background: white;
		color: black;
		width: 247px;
		padding: 0 10px;
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
	&/deep/ img{
		width: 100%;
		height: 200px;
	}
	>div:not(.el-image){
		width: 324px;
		height: 288px;
		padding: 20px 0 30px 0;
		background: white;
		border-radius: 5px;
		position: absolute;
		top: 160px;
		left: calc(50% - 162px);
		box-shadow: 0 0 8px 0 #ccc;
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
	// background: white;
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
	padding: 40px 0;
	box-sizing: border-box;
	color: #338ce6;
	font-size: 15px;
	div{
		width: 100%;
		text-align: center;
	}
	img{
		vertical-align: baseline;
	}
	p{
		// margin: 0 10%;
		// width: 90%;
		// vertical-align: middle;
    // display: flex;
    // align-items: center;
		// justify-content: space-between;
		display: inline-block;
		img {
			margin-right: 16px;
		}
		.data{
			margin-right: 16px;
			font-size: 30px;
			text-align: right;
			display: inline-block;
			// min-width: 140px;
			max-width: 320px;
			text-overflow: ellipsis;
			overflow: hidden;
			line-height: 1;
			vertical-align: bottom;
			text-align: right;
		}
		span:last-child{
			margin-left: 0px;
			color: #666666;
			line-height: 30px;
			float: right;
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
	.bgf6fafb::after{
		content: '';
		width: 20000px;
		left: 0;
		transform: translateY(-100%);
		position: absolute;
		min-height: 600px;
		z-index: -10;
		background: #f6fafb;
	}
</style>