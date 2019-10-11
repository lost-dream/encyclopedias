<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: 'app',
}

</script>

<style lang="scss">
	
/*--------------------全局样式-------------------------------------------*/
	/*分页居中*/
.el-pagination{
	margin-top: 40px;
	text-align: center;
}
/*表格文字居中*/
.departTable {
  &/deep/ .cell {
    text-align: center;
  }
}
/*列表暂无数据*/
.noDataRemindContent{
	text-align: center;
	padding: 20px 0;
}
/*我的表单*/
.myForm{
	.el-form-item__label{
		padding: 0;
	}
}

/*我的分类树*/
.myTree{
	.el-tree-node{
  position: relative;
  padding-left: 16px;
}
.el-tree-node__content{
	padding-left: 4px !important;
}
.el-tree-node__children{
  padding-left: 16px;
}
.el-tree-node__label{
	padding-left: 4px;
}
.el-tree-node :last-child:before {
  height: 38px;
}
.el-tree>.el-tree-node:before{
  border-left: none;
}
.el-tree>.el-tree-node:after{
  border-top: none;
}
.el-tree-node:before,.el-tree-node:after{
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.tree :first-child .el-tree-node:before{
  border-left: none;
}
.el-tree-node:before {
  border-left: 1px solid #459DF6;
  bottom: 0px;
  height: 100%;
  top: -20px;
  width: 1px;
}
.el-icon-caret-right:before{
	content: '\e6d9';
}
.el-tree-node__content > .el-tree-node__expand-icon{
	border: 1px solid #459DF6;
	padding:1px;
	color: #459DF6;
}
.el-tree-node__content > .el-tree-node__expand-icon.is-leaf{
	color: transparent;
	border: none;
	padding: 0;
	display: none;
}
.el-tree-node:after {
  border-top: 1px solid #459DF6;
  height: 20px;
  top: 17px;
  width: 24px;
  }
}
/*--------------------全局样式-------------------------------------------*/
.header {
  line-height: 60px;
  height: auto !important;
  // margin-bottom: 15px;
  box-shadow: 0 0 5px 0 #8e8e8e;
}
html,body,#app{
	height: 100vh;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
h2 {
  font-weight: 400;
  color: #1f2f3d;
}

ul,li,p{
	list-style: none;
	margin: 0;
	padding: 0;
}

.height-100 {
  height: 100%;
}
.bg-fff {
  background: #ffffff;
}

.ck-summary .image-style-align-center:not(.image_resized), .ck-summary .image-style-align-left:not(.image_resized), .ck-summary .image-style-align-right:not(.image_resized), .ck-summary .image-style-side:not(.image_resized) {
    max-width: 35% !important;
}
.ck-content p{
    line-height: 25px;
    text-indent: 2em;
}
.el-collapse-item__header{
    background: #eeeeee !important;
    display: block !important;
    text-align: right;
    color: rgb(51, 140, 230) !important;
}
.ellipsis {
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    line-clamp:2;
    word-wrap: break-word;
}
    .main-content{
        line-height: 25px;
    }
</style>