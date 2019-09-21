<template>
  <div>
  	<el-container>
      
      <el-container>
      	
        <el-main>
        <!-- Body -->
         <router-view></router-view>
      </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>

export default {
  name: 'visitor',
  components: {
    
  }
}

</script>

<style lang="scss" scoped>
.el-main{
	overflow-y: auto;
	width: 100vh;
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