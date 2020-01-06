<template>
  <div class="reptileData">
    <el-card class="myForm" shadow="hover">
      <div style="font-weight: bold;font-size: 28px;" slot="header" class="clearfix">
        <span class="leftBorder"></span>
        爬虫任务管理
      </div>
      <el-button
        style="background: #587dda !important;color: white;margin-bottom: 20px;"
        @click="importTask"
        type="primary"
        >手动导入任务</el-button
      >
      <el-table
        class="departTable"
        :data="reptileData"
        border
        :header-cell-style="{ background: '#ecedf2', color: '#67686d' }"
        style="width: 100%"
      >
        <el-table-column width="220px" prop="number" label="序号"></el-table-column>
        <el-table-column prop="taskname" label="任务名称"></el-table-column>
        <el-table-column prop="addtime" label="生成时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" style="color: #f49b9b" size="small">重新抓取</el-button>
            <el-button type="text" style="color: #5b7dd8" @click="checkLaunch(scope.row)" size="small"
              >查看启动词条</el-button
            >
            <el-button type="text" style="color: #53bb9a" @click="associationLaunch(scope.row)" size="small"
              >查看关联词条</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next"
        :total="pagination.count"
      ></el-pagination>
    </el-card>

    <!--弹框-->
    <el-dialog
      title="关联词列表"
      :visible.sync="associationDialog"
      width="80%"
      :before-close="CloseAssociationDialog"
    >
      <span slot="title">
         <span class="leftBorder"></span>
         <span class="titleWord">关联词列表</span>
      </span>
      <associationDialog ref="associationDialog"></associationDialog>
    </el-dialog>
    <el-dialog
      title="启动词列表"
      :visible.sync="launchDialog"
      width="80%"
      :before-close="CloseLaunchDialog"
    >
      <span slot="title">
         <span class="leftBorder"></span>
         <span class="titleWord">启动词列表</span>
      </span>
      <launchDialog ref="launchDialog"></launchDialog>
    </el-dialog>
  </div>
</template>

<script>
import associationDialog from './associationDialog'
import launchDialog from './launchDialog'
export default {
  name: 'reptileData',
  components: {
    associationDialog: associationDialog,
    launchDialog: launchDialog
  },
  data() {
    return {
      reptileData: [
        {
          number: 1,
          taskname: 'abc',
          addtime: '2020-01-02'
        }
      ],
      associationDialog: false,
      launchDialog: false,
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      }
    }
  },
  methods: {
    // 打开弹窗
    checkLaunch(row) {
      this.$nextTick(() => {
        this.$refs.launchDialog.init(row.taskId);
      });
      this.launchDialog = true
    },
    associationLaunch(row) {
      this.$nextTick(() => {
        this.$refs.associationDialog.init(row.taskId);
      });
      this.associationDialog = true
    },
    // 关闭弹窗
    CloseAssociationDialog() {
      this.associationDialog = false
    },
    CloseLaunchDialog() {
      this.launchDialog = false
    },
    // 手动导入任务
    importTask() {},
    // 分页
    handleSizeChange(val) {
      this.pagination.page = 1
      this.pagination.limit = val
    },
    handleCurrentChange(val) {
      this.pagination.page = val
    }
  }
}
</script>

<style lang="scss">
.reptileData {
  .leftBorder {
    display: inline-block;
    vertical-align: middle;
    background: #5d7cd8;
    width: 5px;
    height: 20px;
    margin-right: 15px;
  }
  .titleWord{
    font-size: 28px;
    vertical-align: middle;
  }
  .el-card {
    overflow: visible;
  }
  .el-dialog__body {
    background-color: #f6fafb;
  }
}
</style>
