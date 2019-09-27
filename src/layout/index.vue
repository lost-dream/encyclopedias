<template>
	<el-main class="top-wrap">
		<el-container>
			<el-aside width="200px">
			<!-- 侧边栏 -->
					<navmenu></navmenu>
			</el-aside>
			<el-main>
			<!-- Body -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-main>
</template>
<script>
import NavMenu from '@/components/NavMenu'
export default {
  name: 'layout',
  components: {
    'navmenu': NavMenu
  }
}

</script>

<style lang="scss" scoped>
.el-main{
	overflow-y: auto;
	width: 100vw;
	min-height: 70vh;
	
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
.top-wrap {
	padding: 0;
	width: 1280px;
	margin: 0 auto;

	.el-main {
		border-left: 1px solid #e6e6e6;
	}
}
</style>