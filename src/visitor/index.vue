<template>
		<el-container class="page-wrapper">
			<el-main>
				<!--面包屑导航-->
				<el-breadcrumb v-show="showBreadcrumb" class="breadcrumb-container" separator-class="el-icon-arrow-right">
						<el-breadcrumb-item v-for="item in levelList" :to="item.path" v-bind:key="item.path">{{item.meta.title}}</el-breadcrumb-item>
				</el-breadcrumb>
			<!-- Body -->
				<router-view></router-view>
		</el-main>
		</el-container>
</template>
<script>

export default {
  name: 'visitor',
  components: {
    
  },
  data() {
	    return {
	        levelList: [],
	        showBreadcrumb:false,
	    }
	},
	watch: {
	    $route() {
	    	console.log(this.$route.path)
	    	if(this.$route.path === '/index'){
	    		this.showBreadcrumb = false
	    	}
	    	else{
	    		this.showBreadcrumb = true
	    	}
	        this.getBreadcrumb()
	    }
	},
	created(){
	    this.getBreadcrumb()
	},
	methods:{
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
.page-wrapper{
	// width: 1280px;
	// margin: 0 auto;
	.el-main {
		padding: 0;
	}
}
.el-main{
	padding-top: 0;
	overflow-y: auto;
	// width: 1280px;
	// margin: 0 auto;
	/*height: 70vh;*/
	
	&::-webkit-scrollbar {
	  width: 5px;
	  height: 4px;
	  background-color: #F5F5F5;
	}
	
	/*定义滚动条轨道 内阴影+圆角*/
	&::-webkit-scrollbar-track {
	  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
	  border-radius: 10px;
	  background-color: #F5F5F5;
	}
	
	/*定义滑块 内阴影+圆角*/
	&::-webkit-scrollbar-thumb {
	  border-radius: 10px;
	  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
	  background-color: #ddd;
	}
}
</style>