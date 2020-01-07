<template>
  <div class="associationDialog">
    <div class="inputButton">
      <el-button @click="multipleInputDatabase">审核入库</el-button>
    </div>

    <el-table
      class="departTable"
      :data="associationData"
      border
      fit
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#ecedf2', color: '#67686d' }"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="100"
        label="全选"
        :selectable="selectable"
      ></el-table-column>
      <el-table-column width="100" label="序号">
        <template slot-scope="scope">
          {{ (pageOption.page - 1) * pageOption.size + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="ENTRYNAME" label="词条名称"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="SOURCEVALUE"
        label="词条来源url"
      ></el-table-column>
      <el-table-column label="抓取时间">
        <template slot-scope="scope">
          {{ parseTime(scope.row.CREATETIME) }}
        </template>
      </el-table-column>
      <el-table-column prop="taskname" width="200" label="审核入库状态">
        <template slot-scope="scope">
          {{ scope.row.VERIFYSTATUS === 0 ? '未审核入库' : '已审核入库' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #5b7dd8" @click="checkDetail(scope.row)"
            >查看详情</el-button
          >
          <el-button
            :disabled="scope.row.VERIFYSTATUS !== 0"
            type="text"
            style="color: #f49b9b"
            @click="singleInputDatabase(scope.row)"
            >审核入库</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleConditionSizeChange"
      @current-change="handleConditionCurrentChange"
      :current-page="pageOption.page"
      :page-size="pageOption.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageOption.count"
    ></el-pagination>

    <!--详情弹框-->
    <el-dialog
      append-to-body
      title="查看关联词详情"
      :visible.sync="detailDialog"
      width="80%"
      :before-close="closeDetailDialog"
    >
      <check-detail :detailId="detailId"></check-detail>
    </el-dialog>
  </div>
</template>

<script>
import CheckDetail from './checkDetail'
import reptileDataApi from '@/api/reptileData/index.js'
import { parseTimeYMD } from '@/utils/commonMethod'

export default {
  name: 'associationDialog',
  components: { CheckDetail },
  data() {
    return {
      taskId: '', // 任务Id
      associationData: [], // 表格数据
      pageOption: {
        page: 1,
        size: 10,
        count: 0
      }, // 翻页
      multipleSelection: '', // 多选项
      detailDialog: false, // 弹框
      detailId: '' // 查看详情的id
    }
  },
  methods: {
    /*
     * 初始化
     * */
    init(taskId) {
      this.associationData = []
      this.multipleSelection = ''
      this.taskId = taskId
      let param = {
        taskId: taskId,
        // taskId: '201911270001',
        pageNumber: this.pageOption.page,
        pageSize: this.pageOption.size
      }
      reptileDataApi
        .listEntryAssWord(param)
        .then(res => {
          if (res.data) {
            if (res.data.records) {
              this.associationData = res.data.records
            } else {
              this.associationData = []
            }
            this.pageOption.count = res.data.total
          }
        })
        .catch(res => {
          this.$message.error('请求出错，错误原因： ' + res.msg ? res.msg : JSON.stringify(res))
        })
    },

    /*
     * 转换时间戳
     * */
    parseTime(time) {
      return parseTimeYMD(time)
    },

    /*
     * 获取抓取状态
     * */
    getStatus(status) {
      switch (status) {
        case 2: {
          return '待爬取'
        }
        case 3: {
          return '爬取中'
        }
        case 4: {
          return '成功'
        }
        case 5: {
          return '失败'
        }
        default:
          return '未知'
      }
    },

    /*
     * 是否可选
     * */
    selectable(row) {
      if (row.VERIFYSTATUS === 0) {
        return true
      }
      return false
    },

    /*
     * 单条审核入库
     * */
    singleInputDatabase(row) {
      let param = {
        idList: row.ID
      }
      reptileDataApi
        .registrySourceEntryWords(param)
        .then(res => {
          if (res.status === 'success') {
            this.$message.success('数据入库成功')
            this.init(this.taskId)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(res => {
          this.$message.error('请求出错，错误原因： ' + res.msg ? res.msg : JSON.stringify(res))
        })
    },

    /*
     * 多选
     * */
    handleSelectionChange(val) {
      /*let arr = []
      val.forEach(item => {
        arr.push(item.ID)
      })
      this.multipleSelection = arr*/

      let arr = ''
      val.forEach((item, index) => {
        if (index !== val.length - 1) {
          arr += item.ID + ','
        } else {
          arr += item.ID
        }
      })
      this.multipleSelection = arr
    },

    /*
     * 多条审核入库
     * */
    multipleInputDatabase() {
      if (this.multipleSelection !== '') {
        let param = {
          // idList: JSON.stringify(this.multipleSelection)
          idList: this.multipleSelection
        }
        reptileDataApi
          .registrySourceEntryWords(param)
          .then(res => {
            if (res.status === 'success') {
              this.$message.success('多条数据入库成功')
              this.multipleSelection = ''
              this.init(this.taskId)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(res => {
            this.$message.error('请求出错，错误原因： ' + res.msg ? res.msg : JSON.stringify(res))
          })
      } else {
        this.$message.warning('未选择任何数据')
      }
    },

    /*
     * 查看详情
     * */
    checkDetail(row) {
      this.detailId = row.ID
      this.detailDialog = true
    },

    /*
     * 改变每页容量
     * */
    handleConditionSizeChange(val) {
      this.pageOption.size = val
      this.init(this.taskId)
    },

    /*
     * 改变页数
     * */
    handleConditionCurrentChange(val) {
      this.pageOption.page = val
      this.init(this.taskId)
    },

    /*
     * 关闭弹框
     * */
    closeDetailDialog() {
      this.detailDialog = false
    }
  }
}
</script>

<style lang="scss">
.associationDialog {
  background: #f6fafb;
  .inputButton {
    width: 100%;
    padding: 0 0 24px 0;

    .el-button {
      width: 140px;
      height: 50px;
      background: #5b7dd8;
      color: #ffffff;
    }
  }

  .el-pagination {
    .el-pagination__total {
      height: 36px;
      width: 90px;
      font-size: 24px;
      color: #999999;
      background: #ffffff;
    }

    .el-pagination__sizes {
      .el-select .el-input {
        height: 36px;
        width: 90px;
        background: #ffffff;
        margin: 0;
        .el-input__inner {
          height: 36px;
          width: 90px;
          padding-right: 0;
          border: none;
          font-size: 24px;
          color: #999999;
        }
      }
    }

    .btn-prev,
    .btn-next {
      height: 36px;
      width: 36px;
      background: #ffffff;
    }

    .btn-prev .el-icon,
    .btn-next .el-icon {
      font-size: 24px;
      font-weight: normal;
      color: #999999;
    }

    .el-pager li {
      height: 36px;
      font-weight: normal;
      width: 36px;
      line-height: 36px;
      font-size: 24px;
      color: #999999;
      background: #ffffff;
    }

    .el-pager li:not(.disabled).active {
      background: #5b7dd8;
    }

    .el-pagination__jump {
      font-size: 24px;
      color: #999999;
      line-height: 36px;

      .el-pagination__editor.el-input,
      .el-pagination__editor.el-input .el-input__inner {
        width: 36px !important;
        height: 36px !important;
        font-size: 24px;
        color: #999999;
        margin-right: 10px;
      }
    }
  }

  .el-checkbox__inner {
    width: 22px;
    height: 22px;
    font-size: 16px;
  }

  .el-checkbox__inner::after {
    left: 7px;
    top: 5px;
  }

  .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    top: 9px;
  }
}
</style>
