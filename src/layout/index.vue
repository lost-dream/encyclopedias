<template>
  <div>
  	<el-container>
      
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
    </el-container>
  </div>
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

<style>

</style>