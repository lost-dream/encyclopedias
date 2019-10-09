<template>
	<el-container>
		<el-header height="40px">
			<vheader></vheader>
		</el-header>
		<el-aside width="200px" class="left-menu">
		<!-- 侧边栏 -->
				<navmenu></navmenu>
		</el-aside>
		<el-main>
		<!-- Body -->
			<router-view></router-view>
		</el-main>
	</el-container>
</template>
<script>
import Header from '@/components/AdminHeader'
import NavMenu from '@/components/NavMenu'
export default {
  name: 'layout',
  components: {
		'navmenu': NavMenu,
		'vheader': Header
  }
}

</script>

<style lang="scss" scoped>
.el-container {
	position: relative;
}

.el-main{
	overflow-y: auto;
	margin-left: 200px;
	width: calc(100vw - 200px);
	height: calc(100vh - 40px);
	// border-left: 1px solid #e6e6e6;
	background: #f5f5f5;
	
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

.left-menu {
	width: 200px;
	position: absolute;
	top: 40px;
	height: calc(100vh - 40px);
	background: rgb(33,47,84);
}
// .top-wrap {
// 	padding: 0;
// 	width: 1280px;
// 	margin: 0 auto;

// 	.el-main {
// 		border-left: 1px solid #e6e6e6;
// 	}
// }
</style>