<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <vheader />
      </el-header>
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
}
html,body,#app{
	height: 100vh;
}
.el-container{
	height: calc(100vh - 60px);
}
</style>