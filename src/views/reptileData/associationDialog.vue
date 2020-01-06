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
      <el-table-column type="selection" width="100" label="全选"></el-table-column>
      <el-table-column width="100" label="序号">
        <template slot-scope="scope">
            {{ (pageOption.page - 1) * pageOption.size + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="taskname" label="词条名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="addtime" label="词条来源url"></el-table-column>
      <el-table-column prop="addtime" label="抓取时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #5b7dd8" @click="checkDetail(scope.row)"
            >查看详情</el-button
          >
          <el-button type="text" style="color: #f49b9b" @click="singleInputDatabase(scope.row)"
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

export default {
  name: 'associationDialog',
  components: { CheckDetail },
  data() {
    return {
      associationData: [
        {
          number: 1,
          taskname: 'abc',
          addtime: '2020-01-02'
        }
      ], // 表格数据
      pageOption: {
        page: 1,
        size: 10,
        count: 20
      }, // 翻页
      multipleSelection: [], // 多选项
      detailDialog: false, // 弹框
      detailId: '' // 查看详情的id
    }
  },
  methods: {
    /*
    * 初始化
    * */
    init(taskId) {
        alert(taskId);
    },

    /*
     * 单条审核入库
     * */
    singleInputDatabase(row) {},

    /*
     * 多选
     * */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /*
     * 多条审核入库
     * */
    multipleInputDatabase() {},

    /*
     * 查看详情
     * */
    checkDetail(row) {
      // this.detailId = row.ENTRY_ID;
      this.detailId = '204e57e6-2448-11ea-a0f7-0242ac120005'
      this.detailDialog = true
    },

    /*
     * 改变每页容量
     * */
    handleConditionSizeChange(val) {
      this.pageOption.size = val;
    },

    /*
     * 改变页数
     * */
    handleConditionCurrentChange(val) {
      this.pageOption.page = val;
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
}
</style>
