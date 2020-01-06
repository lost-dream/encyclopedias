<template>
  <div>
    <el-row class="versionHistory" style="max-width: 1680px;margin: 40px auto">
      <el-col :span="6">{{ info.entryName }}</el-col>
      <el-col :span="6">编辑次数：{{ info.versionApprovingCount }}次</el-col>
      <el-col :span="6">创建者：{{ info.creator }}</el-col>
      <el-col :span="6">创建时间：{{ parseTime(info.createTime) }}</el-col>
    </el-row>
    <el-table
      class="departTable"
      :data="MyEntryList"
      border
      style="max-width: 1280px;margin: 0 auto"
    >
      <el-table-column label="版本时间" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="版本详情" width="180">
        <template slot-scope="scope">
          <el-button @click="seeEntry(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="贡献者" width="180"></el-table-column>
      <el-table-column prop="editReason" label="编辑原因"></el-table-column>
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
  </div>
</template>

<script>
import { entryVersionList, entryInfo } from '@/api/entry/index.js'
import { parseTimeYMD } from '@/utils/commonMethod.js'
export default {
  name: 'entryVersionList',
  data() {
    return {
      entryId: '',
      MyEntryList: [],
      info: {},
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      }
    }
  },
  watch: {},
  created() {
    let vm = this
    Cetc10Auth().init(function() {
      vm.entryId = vm.$route.query.entryId
      vm.entryVersionList()
      vm.entryInfo()
    })
  },
  mounted() {},
  destroyed() {},
  methods: {
    modifyEntry(item) {
      this.$router.push({
        name: 'editEntry',
        query: {
          entryId: item.ENTRY_ID,
          versionId: item.ID,
          viewType: 'preview'
        }
      })
    },
    deleteEntry(item) {
      this.$confirm('确认删除当前词条？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$message('删除成功')
          this.pagination.page = 1
          this.entryVersionList()
        })
        .catch(() => {})
    },
    seeEntry(item) {
      console.log(item)
      this.$router.push({
        name: 'viewEntry',
        query: {
          entryId: this.entryId,
          versionId: item.id,
          viewType: 'preview'
        }
      })
    },

    parseTime(str) {
      return parseTimeYMD(str)
    },
    handleSizeChange(val) {
      this.pagination.page = 1
      this.pagination.limit = val
      this.entryVersionList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.entryVersionList()
    },
    entryInfo() {
      entryInfo({ id: this.entryId }).then(res => {
        this.info = res.data
      })
    },
    entryVersionList() {
      entryVersionList({
        pageNumber: this.pagination.page,
        pageSize: this.pagination.limit,
        entryId: this.entryId
      })
        .then(res => {
          this.MyEntryList = res.data.records
          this.pagination.count = res.data.total
        })
        .catch(res => {
          console.log(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table {
  thead {
    font-size: 28px;
    .cell {
      text-align: left; // table 表头 左对齐
    }
    th,
    tr,
    td {
      background: #f2f2f2;
    }
  }
  .cell {
    text-align: left;
  }
  .delete-row {
    color: #d8d8d8;
  }

  .el-table__expand-icon {
    //修改 el-tabel 折叠按钮的位置
    float: right;
  }

  // 去掉table的border start----------------------------
  border: 0;
  th,
  tr,
  td {
    font-size: 26px;
    background: #fbfbfb;
    border: 0;
  }
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }
  &:hover {
    cursor: pointer;
    background: #e6e6e6;
  }

  .el-table__fixed:before {
    height: 0;
  }
  // 去掉table的border end----------------------------
}
.versionHistory {
  background: #f6fafb;
  color: black;
  line-height: 60px;
  .el-col-6 {
    text-align: center;
    font-size: 26px;
    line-height: 1.5;
  }
}
.statusList {
  li {
    display: inline-block;
    background: #e6e6e6;
    color: #adadad;
    font-weight: bold;
    font-size: 26px;
    width: 90px;
    text-align: center;
    border-right: 1px solid #d0d0d0;
    line-height: 1.5;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .choosed {
    background: #337ab7;
    color: white;
  }
}
</style>
