<template>
  <div>
    <el-card class="myForm" shadow="hover">
      <div style="font-weight: bold;font-size: 28px;" slot="header" class="clearfix">
        <span class="leftBorder"></span>
        抽取词条审核列表
      </div>
      <el-row style="margin: 0 0 0 20px;">
        <div class="categoryChoose">
          <span class="label">分类</span>
          <el-input
            @focus="changeTreeShow"
            @blur="hideTree"
            clearable
            class="changeTreeShow"
            v-model="checkedCategoryName"
          ></el-input>
          <div v-show="showTree" class="myTree">
            <el-tree
              ref="tree"
              :props="defaultProps"
              :default-expand-all="true"
              current-node-key="1"
              :data="treeData"
              node-key="space_id"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              highlight-current
            >
              <!--<div class="custom-tree-node" slot-scope="{ node, data}">
				          <div>
				            <span @click.stop="chooseItem(data)">{{ data.name }}</span>
				          </div>
				          <span class="el-ic"></span>
				        </div>-->
            </el-tree>
          </div>
        </div>
        <span class="label">词条名称</span>
        <el-input style="width: 400px;" v-model="keyword" type="text" placeholder=""></el-input>

        <span class="label">数据源</span>
        <el-select
          style="width: 220px;margin-bottom: 20px;"
          v-model="dataSourceId"
          placeholder="请选择数据源"
        >
          <el-option
            :label="item.dataSourceName"
            :value="item.id"
            v-for="(item, index) in sourceList"
            :key="index"
          ></el-option>
        </el-select>

        <el-button
          style="background: #587dda !important;color: white;margin-left: 35px;"
          @click="auditList"
          type="primary"
          >查询</el-button
        >
      </el-row>
      <el-table
        class="departTable"
        :data="dataSourceList"
        border
        :header-cell-style="{ background: '#ecedf2', color: '#67686d' }"
        style="width: 100%"
        @row-click="modifyEntry"
      >
        <el-table-column prop="entryName" label="名称"></el-table-column>
        <el-table-column prop="categories" label="预分类">
          <template v-if="scope.row.categories" slot-scope="scope">
            {{ scope.row.categories.join(',') ? scope.row.categories.join(',') : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="dataSourceName" label="数据源"></el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ statusObj[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 2 || scope.row.status === 4"
              style="color: #7291e1;"
              @click="openDialog(scope.row, '3')"
              type="text"
              size="small"
              >通过</el-button
            >

            <el-button
              v-if="scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 6"
              style="color: #e36d72;"
              @click="openDialog(scope.row, '4')"
              type="text"
              size="small"
              >不通过</el-button
            >
            <el-button
              v-if="scope.row.status === 3 || scope.row.status === 6"
              style="color: #e36d72;"
              @click="openDialog(scope.row, '5')"
              type="text"
              size="small"
              >发布</el-button
            >
            <el-button
              v-if="scope.row.status === 5"
              style="color: #e36d72;"
              @click="openDialog(scope.row, '6')"
              type="text"
              size="small"
              >取消发布</el-button
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
    <el-dialog title="审核意见" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="审核意见">
          <el-input v-model="modifyReason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modify">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { auditTaskList, audit } from '@/api/entry/index.js'
import { allList } from '@/api/dataSource/index.js'
import { parseTimeYMD } from '@/utils/commonMethod.js'
import { categoryTree } from '@/api/classifyManager/index.js'
export default {
  name: 'entryExamine',
  data() {
    return {
      dataSourceList: [],
      dialogFormVisible: false,
      modifyCode: '',
      modifyID: '',
      modifyReason: '',
      dataSourceType: '1',
      dataSourceTypeObj: {
        '1': 'oracle',
        '2': '达梦',
        '3': 'ftp'
      },
      keyword: '',
      label: '',
      categoryId: '',
      dataSourceId: '',
      sourceList: [],
      auditState: '2',
      statusObj: {
        '2': '待审核',
        '3': '审核通过',
        '4': '审核不通过'
      },
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      },
      checkedCategoryName: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showTree: false
    }
  },
  created() {
    this.auditList()
    this.allList()
    this.categoryTree()
  },
  watch: {
    auditState() {
      this.auditList()
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    modifyEntry(item) {
      //编辑爬虫的词条，没有versionId
      this.$router.push({
        name: 'editOthersEntry',
        query: {
          entryId: item.id,
          versionId: item.versionId
        }
      })
    },
    allList() {
      allList({})
        .then(res => {
          this.sourceList = res.data
        })
        .catch(res => {
          console.log(res)
        })
    },

    changeTreeShow() {
      this.showTree = !this.showTree
    },
    hideTree() {
      setTimeout(() => {
        this.showTree = false
      }, 200)
    },
    handleNodeClick(data, checked, node) {
      console.log(data)
      this.categoryId = data.id
      this.checkedCategoryName = data.name
      this.showTree = false
    },
    openDialog(item, code) {
      this.modifyCode = code
      this.modifyID = item.ID
      this.modifyReason = ''
      this.dialogFormVisible = true
    },
    modify() {
      if (this.modifyReason.trim() === '') {
        this.$message('请输入审核意见')
        return
      }
      this.dialogFormVisible = false
      audit({
        versionId: this.modifyID,
        auditContent: this.modifyReason,
        state: this.modifyCode
      }).then(res => {
        this.$message('词条状态修改成功')
        this.auditList()
      })
    },
    deleteData(item) {
      this.$confirm('确认删除当前数据源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          deleteSource({
            id: item.id
          }).then(res => {
            this.$message('删除成功')
            this.pagination.page = 1
            this.list()
          })
        })
        .catch(() => {})
    },
    see(item) {
      console.log(item)
      this.$router.push({
        name: 'dataSourceManager',
        query: {
          id: item.id,
          type: 'see'
        }
      })
    },

    parseTime(str) {
      return parseTimeYMD(str)
    },
    handleSizeChange(val) {
      this.pagination.page = 1
      this.pagination.limit = val
      this.auditList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.auditList()
    },
    auditList() {
      auditTaskList({
        pageNumber: this.pagination.page,
        pageSize: this.pagination.limit,
        auditState: parseInt(this.auditState),
        keyword: this.keyword,
        categoryIds: this.categoryId,
        entryName: this.label,
        dataSourceId: this.dataSourceId
      })
        .then(res => {
          this.dataSourceList = res.data.records
          this.pagination.count = res.data.total
        })
        .catch(res => {
          console.log(res)
        })
    },
    categoryTree() {
      categoryTree({})
        .then(res => {
          res.data.children.map(item => {
            if (!item.children.length) {
              delete item.children
            } else {
              item.children.map(item1 => {
                if (!item1.children.length) {
                  delete item1.children
                } else {
                  item1.children.map(item2 => {
                    if (!item2.children.length) {
                      delete item2.children
                    }
                  })
                }
              })
            }
          })
          console.log(res.data.children, '111')
          this.treeData = res.data.children
        })
        .catch(res => {
          console.log(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  margin-left: 30px;
}
.categoryChoose {
  display: inline-block;
  position: relative;
  .myTree {
    background: white;
    position: absolute;
    left: 78px;
    top: 40px;
    z-index: 999;
    padding: 5px 5px 5px 0;
    border: 1px solid #ebebeb;
  }
  .changeTreeShow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    display: inline-block;
    vertical-align: middle;
  }
}

.leftBorder {
  display: inline-block;
  vertical-align: middle;
  background: #5d7cd8;
  width: 5px;
  height: 20px;
  margin-right: 15px;
}
</style>
