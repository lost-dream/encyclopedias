<template>
  <el-row>
    <el-col :span="24" >
      <div class="head-wrap">
      	<span>
      		<!--<img @click="gotoIndex" src="../../public/baike/static/image/logo.png" />-->
      		<span @click="gotoIndex" class="title" >情报百科</span>
      	</span>
      	
      	<el-input
      		style='width: 500px;'
			    placeholder="请输入内容"
			    prefix-icon="el-icon-search"
			    clearable
			    v-model="content">
			  </el-input>
      	<!--<el-button @click="search" style='margin: 0 20px;' type="primary">进入词条</el-button>-->
      	<el-button style='margin: 0 20px;vertical-align: top;' @click="searchTotalStation" type="danger">全站搜索</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script>
	
	export default {
    data () {
      return {
        content: ''
      }
    },
    watch: {
		  $route: {
		    handler: function(val, oldVal){
		      if(this.$route.path === '/searchResultList'){
		      	this.content = sessionStorage.getItem('searchContent')
		      }
		    	else{
		    		this.content = ''
		    	}
		    },
		    // 深度观察监听
		    deep: true
		  }
		},
    created() {
    	this.content = sessionStorage.getItem('searchContent')
    },
    
    methods: {
    	gotoIndex() {
    		this.$router.push('index')
    	},
      search() {
      	this.content = this.content.trim()
      	if(this.content!=''){
      		sessionStorage.setItem('searchContent',this.content)
      		if(this.$route.path === '/searchResultList'){
      			var url = window.location.href.split('?')[0]+'?content='+this.content
      			history.pushState("", "", url)
      			window.location.reload()
      		}
      		else{
      			this.$router.push({
		      		name:'searchResultList',
		      		query:{
		      			content:this.content
		      		}
		      	})
      		}
      		
      	}
      	else{
      		this.$message('请输入内容')
      	}
      },
      searchTotalStation() {
      	this.content = this.content.trim()
      	if(this.content!=''){
      		sessionStorage.setItem('searchContent',this.content)
      		if(this.$route.path === '/searchResultList'){
      			var url = window.location.href.split('?')[0]+'?content='+this.content+'&searchTotalStation=true'
      			history.pushState("", "", url)
      			window.location.reload()
      		}
      		else{
      			this.$router.push({
		      		name:'searchResultList',
		      		query:{
		      			content:this.content,
		      			searchTotalStation:true,
		      		}
		      	})
      		}
      		
      	}
      	else{
      		this.$message('请输入内容')
      	}
      }
    }
  }
</script>
	
<style lang="scss" scoped>
.head-wrap{
	color: #338ce6;
	text-align: center;
	margin: 15px 0;
	>span:hover{
		cursor: pointer;
		opacity: 0.8;
	}
	img{
		vertical-align: middle;
		margin-right: 5px;
	}
	.title{
		margin-right: 75px;
		display: inline-block;
		font-size: 28px;
		font-weight: bold;
		transform: translateY(4px);
		padding-top: 5px;
		color: #c6341f;
	}
}
.el-button--primary{
	background: #6b9cec;
	border-color: #6b9cec;
}
</style>