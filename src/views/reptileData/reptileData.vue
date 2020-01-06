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
        <el-table-column width="220px" label="序号">
          <template slot-scope="scope">
            {{ (pagination.pageNumber - 1) * pagination.pageSize + (scope.$index + 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="createTime" label="生成时间">
          <template slot-scope="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" style="color: #f49b9b" size="small" @click="freshGet(scope.row)"
              >重新抓取</el-button
            >
            <el-button
              type="text"
              style="color: #5b7dd8"
              @click="checkLaunch(scope.row)"
              size="small"
              >查看启动词条</el-button
            >
            <el-button
              type="text"
              style="color: #53bb9a"
              @click="associationLaunch(scope.row)"
              size="small"
              >查看关联词条</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNumber"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
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
    <el-dialog
      title="手动导入任务"
      :visible.sync="importTaskDialog"
      width="40%"
      :before-close="CloseImportTaskDialog"
    >
      <span slot="title">
        <span class="leftBorder"></span>
        <span class="titleWord">手动导入任务</span>
      </span>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="baseUrlConfig.UPLOAD_URL1"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importTaskDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import associationDialog from './associationDialog'
import launchDialog from './launchDialog'
import { taskList, reCrawl } from '@/api/reptileData/index.js'
import { parseTimeYMD } from '@/utils/commonMethod.js'
export default {
  name: 'reptileData',
  components: {
    associationDialog: associationDialog,
    launchDialog: launchDialog
  },
  data() {
    return {
      reptileData: [{}],
      fileList: [],
      associationDialog: false,
      launchDialog: false,
      importTaskDialog: false,
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    /*
     * 获取爬虫任务列表
     * */
    taskList() {
      taskList({ pageNumber: this.pagination.pageNumber, pageSize: this.pagination.pageSize }).then(
        res => {
          this.reptileData = res.data.records
          this.pagination.total = res.data.total
        }
      )
    },
    parseTime(str) {
      return parseTimeYMD(str)
    },
    /*
     * 打开弹窗
     * */
    checkLaunch(row) {
      this.launchDialog = true
      this.$nextTick(() => {
        this.$refs.launchDialog.init(row.id)
      })
    },
    associationLaunch(row) {
      this.associationDialog = true
      this.$nextTick(() => {
        this.$refs.associationDialog.init(row.id)
      })
    },
    /*
     * 关闭弹窗
     * */
    CloseAssociationDialog() {
      this.associationDialog = false
    },
    CloseLaunchDialog() {
      this.launchDialog = false
    },
    CloseImportTaskDialog() {
      this.importTaskDialog = false
    },
    /*
     * 手动导入任务
     * */
    importTask() {
      this.importTaskDialog = true
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件上传`);
    },
    handleSuccess(res) {
      this.taskList();
      if (res.status = 'success') {
        this.$message('导入成功');
      }
    },
    /*
     * 重新抓取
     * */
    freshGet(row) {
      reCrawl(row.id).then(res => {
        if (res.status === 'success') {
          this.$message('重新抓取成功')
        }
      })
    },
    /*
     * 分页
     * */
    handleSizeChange(val) {
      this.pagination.pageNumber = 1
      this.pagination.pageSize = val
      this.taskList()
    },
    handleCurrentChange(val) {
      this.pagination.pageNumber = val
      this.taskList()
    }
  },
  mounted() {
    this.taskList()
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
  .titleWord {
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
