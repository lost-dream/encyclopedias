<template>
	<el-container>
		<el-header height="64px">
			<vheader></vheader>
		</el-header>
		<el-aside width="210px" class="left-menu">
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
/deep/ .el-form-item__label,/deep/ .el-tag,/deep/ .el-textarea__inner{
	font-size: 26px;
}
/deep/ .page-title{
	font-size: 28px !important;
}
/deep/ .leftBorder{
	height: 28px !important;
}
/deep/ .el-button{
	
}
/deep/ .el-table {
     thead {
     	font-size: 28px;
        .cell {
           text-align: center;  // table 表头 左对齐
           
        }
        th,tr,td{
        	background: linear-gradient(to bottom,#ededed,#ffffff,#ededed) !important;
        }
        
    }
    .cell{
    	text-align: center;
    	
    }
     .delete-row {
         color: #d8d8d8;
     }

     .el-table__expand-icon { //修改 el-tabel 折叠按钮的位置
         float:right;
     }

     // 去掉table的border start----------------------------
     border: 0;
     th,
     tr,
     td{
     	font-size: 26px;
     	background: #fbfbfb;
        border-color: #e6e6e6;
     }
     &::before {
         height: 0px;
     }
     &::after {
         width: 0;
     }
     &:hover{
     	cursor: pointer;
     	background: #e6e6e6;
     }

     .el-table__fixed:before {
         height: 0;
     }
        // 去掉table的border end----------------------------
 }
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
/deep/ .el-button:not(.is-circle){
	font-size: 26px !important;
	border: none;
}
/deep/ .el-button:not(.el-button--default,.el-button--primary){
	background: #efefef;
	border: #D0D0D0;
	outline: none;
	color: #968d7e;
	font-size: 26px;
	background: none !important;
	
	
	&:not(.el-button--default,.el-button--primary):hover{
		/*cursor: pointer;
		background: #e6e6e6;
		border: #c8c8c8;
		color: #868277;*/
	}
}





.el-container {
	position: relative;
	font-family: '仿宋';
}

.el-main{
	overflow-y: auto;
	margin-left: 200px;
	width: calc(100vw - 200px);
	height: calc(100vh - 64px);
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
	top: 64px;
	height: calc(100vh - 64px);
	background: #5b7dd8;
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