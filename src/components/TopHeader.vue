<template>
  <el-row>
    <el-col :span="24"
    	
      <div class="head-wrap">
      	<img src="../assets/logo.png"/>
      	<span class="title">信息百科</span>
      	<el-input
      		style='width: 500px;'
			    placeholder="请输入内容"
			    prefix-icon="el-icon-search"
			    clearable
			    v-model="content">
			  </el-input>
      	<el-button @click="search" style='margin: 0 20px;' type="primary">进入词条</el-button>
      	<el-button @click="searchTotalStation" type="danger">全站搜索</el-button>
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
    	
    },
    methods: {
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
      	this.content!=''?this.$message('接口开发中'):this.$message('请输入内容')
      }
    }
  }
</script>
	
<style lang="scss" scoped>

.head-wrap{
	color: #338ce6;
	text-align: center;
	margin: 15px 0;
	img{
		vertical-align: middle;
		margin-right: 5px;
	}
	.title{
		margin-right: 75px;
	}
}
.el-button--primary{
	background: #6b9cec;
	border-color: #6b9cec;
}
</style>