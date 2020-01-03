<template>
    <div>
        <el-card class="myForm" shadow="hover">
            <div style="font-weight: bold;font-size: 28px;" slot="header" class="clearfix">
                <span class="leftBorder"></span>
                爬虫数据管理
            </div>

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
                    <template>
                        <el-button type="text" style="color: #f49b9b">重新抓取</el-button>
                        <el-button type="text" style="color: #5b7dd8" @click="checkLaunch" ：launchDialog="launchDialog">查看启动词条</el-button>
                        <el-button type="text" style="color: #53bb9a" @click="associationLaunch" ：associationDialog="associationDialog">查看关联词条</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--弹框-->
        <el-dialog title="关联词列表" :visible.sync="associationDialog" width="60%">
            <associationDialog></associationDialog>
        </el-dialog>
        <el-dialog title="启动词列表" :visible.sync="launchDialog" width="60%">
            <launchDialog></launchDialog>
        </el-dialog>
    </div>
</template>

<script>
    import associationDialog from './associationDialog'
    import launchDialog from './launchDialog'
  export default {
    name: 'reptileData',
    components: {
      'associationDialog': associationDialog,
      'launchDialog': launchDialog
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
        launchDialog: false
      }
    },
    methods: {
      checkLaunch() {
        this.launchDialog = true
      },
      associationLaunch() {
        this.associationDialog = true
      }
    }

  }
</script>

<style lang="scss" scoped>
    .leftBorder {
        display: inline-block;
        vertical-align: middle;
        background: #5d7cd8;
        width: 5px;
        height: 20px;
        margin-right: 15px;
    }
    .el-card {
        overflow: visible;
    }
</style>