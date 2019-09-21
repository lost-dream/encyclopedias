<template>
  <el-row>
    <el-col :span="24"
    	
      <div class="head-wrap">
      	
      	信息百科
      	<el-input
      		style='width: 500px;'
			    placeholder="请输入内容"
			    prefix-icon="el-icon-search"
			    clearable
			    v-model="searchContent">
			  </el-input>
      	<el-button style='margin: 0 20px;' type="primary">进入词条</el-button>
      	<el-button type="danger">全站搜索</el-button>
      </div>
    </el-col>
  </el-row>
</template>
<script>
	export default {
    data () {
      return {
        searchContent: ''
      }
    },
    methods: {
      
    }
  }
</script>
	
<style scoped>

.head-wrap{
	color: #338ce6;
	text-align: center;
}
.el-button--primary{
	background: #6b9cec;
	border-color: #6b9cec;
}
</style>