<template>
		<el-container class="page-wrapper" >
			<el-main>
				<header v-if="showHeader">
					<vheader></vheader>
				</header>
				<!--面包屑导航-->
				<div class="breadcrumb-containerParent">
					<el-breadcrumb v-show="showBreadcrumb" class="breadcrumb-container" separator-class="el-icon-arrow-right">
						<el-breadcrumb-item v-for="item in levelList" :to="item.path" v-bind:key="item.path">{{item.meta.title}}</el-breadcrumb-item>
					</el-breadcrumb>
					<span class="backBtn" v-show="showBackBtn" @click="goBack"><i style="margin: 0;" class="el-breadcrumb__separator el-icon-arrow-left"></i>返回
					</span>
					<!--<el-button style="margin-left: 10px;" v-show="showBackBtn" type="primary" @click="goBack">返回</el-button>-->
				</div>
				
				<!-- Body -->
				<router-view :class="pageClass"></router-view>
			</el-main>
		</el-container>
</template>
<script>
import Header from '@/components/TopHeader'
export default {
  name: 'visitor',
  components: {
    'vheader': Header
  },
  data() {
	    return {
	        levelList: [],
			showBreadcrumb:false,
			pageClass: '',
			showHeader:true,
			showBackBtn:false,
	    }
	},
	watch: {
	    $route() {
	    	console.log(this.$route.path,'$route.path')
	    	if(this.$route.path === '/index'){
					this.showBreadcrumb = false
					this.pageClass = 'index-page'
	    	}
	    	else{
					this.showBreadcrumb = true
					this.pageClass = 'other-page'
	    	}
	    	if(this.$route.path === '/viewEntry'||this.$route.path === '/viewCommonEntry'){
	    		this.showBackBtn = true
	    	}
	    	else{
	    		this.showBackBtn = false
	    	}
	        this.getBreadcrumb()
	        this.showHeaderFun()
	    }
	},
	beforeRouteEnter(to, from, next){
		console.log(to);
		next(vm => {
			vm.showBreadcrumb = !(to.path === '/index'||to.path === '/viewCommonEntry');
			vm.pageClass = to.path === '/index' ? 'index-page' : 'other-page'
			vm.authFun()
			if(to.path === '/viewEntry'||to.path === '/viewCommonEntry'){
	    		vm.showBackBtn = true
	    	}
	    	else{
	    		vm.showBackBtn = false
	    	}
		})
	},
	created(){
		this.getBreadcrumb()
		this.showHeaderFun()
	},
	methods:{
		goBack(){
			this.$router.go(-1)
		},
		//权限请求函数
		authFun() {
			if(this.$route.path !== '/viewCommonEntry'){
//				Cetc10Auth().init();
			}
			
		},
		showHeaderFun() {
			if(this.$route.path === '/viewCommonEntry'){
	        	this.showHeader = false
	        	this.showBreadcrumb = false
	        	document.body.style.background = '#f0f0f0'
	        }
	        else{
	        	this.showHeader = true
	        	this.showBreadcrumb = true
	        	document.body.style.background = '#FAFAFA'
	        }
		},
	    getBreadcrumb() {//停留在首页时点击首页会报错
	        let matched = this.$route.matched.filter(item => item.name)
	        matched.splice(0,1)
	        const first = matched[0];
	        if (first && first.name.trim() !== 'index') {
	            matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
	            
	        }
	        this.levelList = matched
	    }
	}
}

</script>

<style lang="scss" scoped>
/deep/ .el-tree-node__label{
	font-size: 26px;
}


/deep/ .entry-title,/deep/ .el-card__body{
	font-size: 28px;
}
/deep/ .el-tabs__item,/deep/ .empty-list,/deep/ .el-tree-node__labe{
	font-size: 26px;
}
/deep/ .el-tree-node__labe{
	font-size: 26px;
}
/deep/ .el-input--prefix .el-input__inner{
	height: 52px;
	font-size: 26px;
}
/deep/ .el-input__inner{
	font-size: 26px;
}
/deep/ .el-button{
	background: #efefef;
	border: #D0D0D0;
	outline: none;
	color: #968d7e;
	font-size: 26px;
	&:hover{
		cursor: pointer;
		background: #e6e6e6;
		border: #c8c8c8;
		color: #868277;
	}
}

.page-wrapper{
	// width: 1280px;
	// margin: 0 auto;
	.el-main {
		padding: 0;
	}
}
.index-page {
	background: url('/static/image/index-bg.png') 0 0 no-repeat;
	background-color: #FAFAFA;
	background-size: 100% 520px;
	font-family: '仿宋';
}
.el-main{
	padding-top: 0;
	overflow-y: visible;
	// width: 1280px;
	// margin: 0 auto;
	/*height: 70vh;*/
}
.breadcrumb-containerParent{
	width: 1280px;
	margin: 0 auto;
	font-size: 26px;
	color: #606266;
}
.breadcrumb-container {
	
	font-size: 26px;
	font-family: '仿宋';
	display: inline-block;
}

.other-page {
	margin: 0px auto;
	width: 1280px;
	font-family: '仿宋';
}
.backBtn{
	margin-left: 10px;vertical-align: top;
	&:hover{
		cursor: pointer;
		color: rgb(51, 140, 230);
	}
}
</style>

<style>
*::-webkit-scrollbar {
	  width: 5px;
	  height: 5px;
	  background-color: #F5F5F5;
	}
	
	/*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
	border-radius: 10px;
	background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
	background-color: #ddd;
}
</style>