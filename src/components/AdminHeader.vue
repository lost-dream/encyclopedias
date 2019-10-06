<template>
  <div class="admin-header">
    <img src="" alt="LOGO.png">

    <div class="action-box">
      <a href=""><i class="el-icon-s-home"></i>首页</a>
      <a><i class="el-icon-switch-button"></i>退出</a>
    </div>
  </div>
</template>
<script>
	
	export default {
    data () {
      return {
        content: ''
      }
    },
    watch: {

		},
    created() {
    	
    },
    methods: {

    }
  }
</script>
	
<style lang="scss" scoped>
// color 33,47,84
.admin-header {
  background: rgb(33,47,84);
  height: 40px;
  color: #fff;
  margin: 0 -20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .action-box {
    height: 40px;
    line-height: 40px;
    a {
    	color: white;
    	text-decoration: none;
      text-align: center;
      cursor: pointer;
      display: inline-block;
      width: 60px;
      padding: 0 15px;
      i {
        margin-right: 5px;
      }
    }
    a:hover {
      background: rgba(255,255,255,.15);
      color: #a7d3ff;
    }
  }
}
</style>