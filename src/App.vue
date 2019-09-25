<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <vheader />
      </el-header>
      <!-- Body -->
      <router-view></router-view>
    </el-container>
  </div>
</template>
<script>
import Header from '@/components/TopHeader'

export default {
  name: 'app',
  components: {
    'vheader': Header
  }
}

</script>

<style>
.header {
  line-height: 60px;
  height: auto !important;
  margin-bottom: 15px;
  box-shadow: 0 0 5px 0 #8e8e8e;
}
html,body,#app{
	height: 100vh;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
h2 {
  font-weight: 400;
  color: #1f2f3d;
  margin: 0 0 40px;
}
.u-clear {
  color: #409EFF !important;
}
</style>