<template>
  <div class="pos-rltv height-100 bg-fff">
    <h2 class="page-title">
      <span>属性模板管理</span>
    </h2>
    <div class="flex-box">
      <div class="left myTree" v-loading="isLoading">
        <h3>外部词条</h3>
        <el-tree
          ref="tree"
          :props="defaultProps"
          current-node-key="1"
          :data="treeData"
          node-key="space_id"
          @node-click="handleNodeClick"
          :expand-on-click-node="true"
          highlight-current
        >
        </el-tree>
        <h3 v-if="permission === '0'">内部词条</h3>
        <el-tree
            v-if="permission === '0'"
            ref="tree"
            :props="defaultProps"
            current-node-key="1"
            :data="innerTree"
            node-key="space_id"
            @node-click="handleNodeClick"
            :expand-on-click-node="true"
            highlight-current
        >
        </el-tree>
      </div>
      <div class="right-box" v-loading="isLoading">
        <h3>属性模板</h3>
        <div class="sub-box">
          <p class="add-top">当前分类： {{ checkedParentItem.name || '暂无' }}</p>
        </div>
        <!--展示选中的分类对应的属性模板（只读）-->
        <el-card v-show="checkedParentId" shadow="never">
          <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
            <span class="leftBorder"></span>
            继承属性
          </div>
          <el-table
            :header-cell-style="{ background: '#ecedf2', color: '#67686d' }"
            ref="table"
            :data="parentClassifyData"
            class="departTable"
            border
            stripe
          >
            <el-table-column prop="attributeName" label="属性名称" />
            <el-table-column prop="attributeTypeName" label="属性值类型" />
            <el-table-column width="250px" label="约束值">
              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.attributeType === 4 ||
                      scope.row.attributeType === 5 ||
                      scope.row.attributeType === 6 ||
                      scope.row.attributeType === 7
                  "
                >
                  {{ parseTime(scope.row.attributeRangeBegin) }}~{{
                    parseTime(scope.row.attributeRangeEnd)
                  }}
                </span>
                <span v-else>
                  {{ scope.row.attributeRangeBegin }}~{{ scope.row.attributeRangeEnd }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="editType" label="编辑模式" />
            <el-table-column prop="editSource" label="编辑内容来源" />
          </el-table>
        </el-card>
        <!--展示选中的分类对应的属性模板（编辑）-->
        <el-card v-show="checkedId" shadow="never" class="mg-t-15">
          <div style="font-weight: bold;font-size: 16px;" slot="header" class="clearfix">
            <span class="leftBorder"></span>
            自身属性
            <el-button
              style="float: right;margin-top: -10px;background: #ef5d5d !important;color: white;"
              @click="addClassify"
              type="success"
            >
              添加<i class="el-icon-plus el-icon--right"></i>
            </el-button>
          </div>
          <el-table
            :header-cell-style="{ background: '#ecedf2', color: '#67686d' }"
            ref="table"
            :data="classifyData"
            class="departTable"
            border
            stripe
          >
            <el-table-column label="属性名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.attributeName" placeholder="请输入属性名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="属性值类型">
              <template slot-scope="scope">
                <el-select
                  @change="attributeTypeChange($event, scope.row)"
                  placeholder="请选择类型"
                  v-model="scope.row.attributeType"
                >
                  <el-option
                    v-for="item in attributeTypeAry"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="约束值">
              <template slot-scope="scope">
                <!--数字范围-->
                <el-row v-if="scope.row.attributeType === 2">
                  <el-col :span="11">
                    <el-input
                      type="number"
                      placeholder="请输入约束值"
                      style="width: 100px;display: inline-block;"
                      v-model="scope.row.attributeRangeBegin"
                    ></el-input>
                  </el-col>
                  <el-col style="line-height: 40px;" :span="1">-</el-col>
                  <el-col :span="11">
                    <el-input
                      type="number"
                      placeholder="请输入约束值"
                      style="width: 100px;display: inline-block;"
                      v-model="scope.row.attributeRangeEnd"
                    ></el-input>
                  </el-col>
                </el-row>

                <!--时间范围-->
                <el-row
                  v-if="
                    scope.row.attributeType === 7 ||
                      scope.row.attributeType === 6 ||
                      scope.row.attributeType === 5 ||
                      scope.row.attributeType === 4
                  "
                >
                  <el-col :span="11">
                    <el-date-picker
                      v-model="scope.row.attributeRangeBegin"
                      :type="datetimeObj[scope.row.attributeType]"
                      placeholder="选择日期时间"
                      align="right"
                      value-format="timestamp"
                    >
                    </el-date-picker>
                  </el-col>
                  <el-col style="line-height: 40px;" :span="1">-</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="scope.row.attributeRangeEnd"
                      :type="datetimeObj[scope.row.attributeType]"
                      placeholder="选择日期时间"
                      align="right"
                      value-format="timestamp"
                    >
                    </el-date-picker>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="编辑模式">
              <template slot-scope="scope">
                <el-select disabled placeholder="请选择模式" v-model="scope.row.editType">
                  <el-option
                    v-for="item in editTypeAry"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="编辑内容来源">
              <template slot-scope="scope">
                <el-select disabled placeholder="请选择来源" v-model="scope.row.editSource">
                  <el-option
                    v-for="item in editSourceAry"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteHandle(scope.$index)" type="text" size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="text-align: center;margin-top: 20px;">
            <el-button
              style="background: #cccccc !important;color: black;border: none;margin-right: 60px;"
              @click="dialogVisible = true"
              type="primary"
            >
              取消
            </el-button>
            <el-button
              style="background: #5b7dd7 !important;color: white;"
              @click="save"
              type="primary"
            >
              保存
            </el-button>
          </el-row>
        </el-card>
      </div>
    </div>

    <!--是否取消修改弹窗-->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定取消修改？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancelModify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { categoryTree, save, list, getInternalEntryList } from '@/api/classifyManager'
import { attributeTypeAry, editTypeAry, editSourceAry } from '@/enumeration/classify'
import { parseTime } from '@/utils/commonMethod'

export default {
  name: 'classifyManage',
  data() {
    return {
      permission: sessionStorage.getItem('nbct'), // 判断权限   0 -- 内部人员  1 -- 外部人员
      datetimeObj: {
        7: 'datetime',
        6: 'date',
        5: 'month',
        4: 'year'
      },
      checkedId: '',
      checkedParentId: '',
      checkedParentItem: {},
      treeData: [], // 外部词条
      innerTree: [], // 内部词条
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'children'
      },
      classifyData: [],
      parentClassifyData: [],
      attributeTypeAry: attributeTypeAry,
      editTypeAry: editTypeAry,
      editSourceAry: editSourceAry,
      dialogVisible: false,
      defaultClassifyItem: {
        attributeName: '',
        attributeType: '',
        attributeRangeBegin: '',
        attributeRangeEnd: '',
        editType: '',
        editSource: ''
      },
      isLoading: false
    }
  },
  watch: {
    checkedParentId() {
      list({
        categoryId: this.checkedParentId,
        pageNumber: 1,
        pageSize: 100
      })
        .then(res => {
          if (res.data.records) {
            res.data.records.map(item => {
              this.attributeTypeAry.map(item1 => {
                if (item1.id === item.attributeType) {
                  item.attributeTypeName = item1.name
                }
              })
              this.editTypeAry.map(item1 => {
                if (item1.id === item.editType) {
                  item.editType = item1.name
                }
              })
              this.editSourceAry.map(item1 => {
                if (item1.id === item.editSource) {
                  item.editSource = item1.name
                }
              })
            })
            this.parentClassifyData = res.data.records
          } else {
            this.parentClassifyData = [];
          }

        })
        .catch(res => {
          console.log(res)
        })
    }
  },
  created() {
    this.categoryTree()
  },
  mounted() {},
  destroyed() {},
  methods: {
    parseTime(str) {
      return parseTime(str)
    },
    //根据属性值类型变化改变约束值和编辑模式
    attributeTypeChange(ev, row) {
      this.$set(row, 'attributeType', ev)
      this.$set(row, 'attributeRangeBegin', '')
      this.$set(row, 'attributeRangeEnd', '')
      this.$set(row, 'editType', ev)
      this.$set(row, 'editSource', '')
      if (ev === 3) {
        this.$set(row, 'editSource', '1')
      }
      if (ev === 1 || ev === 3) {
        this.$set(row, 'attributeRangeBegin', 0)
        this.$set(row, 'attributeRangeEnd', 0)
      }
    },

    chooseItem(item, parentItem) {
      parentItem ? (this.checkedParentId = parentItem.id) : (this.checkedParentId = '')
      this.checkedId = item.id
      this.list()
    },
    //选中分类事件
    changeCascader(item) {
      this.checkedId = item[item.length - 1]
      //获取选中分类的父级分类id，查询回父级分类的属性模板展示出来
      if (item.length > 1) {
        this.checkedParentId = item[item.length - 2]
      } else {
        this.checkedParentId = this.checkedParentItem.id
      }
      this.list()
    },
    addClassify() {
      //属性条数最多50条
      if (this.classifyData.length === 50) {
        this.$message('属性条数最多50条')
        return
      }
      let obj = JSON.parse(JSON.stringify(this.defaultClassifyItem))
      this.classifyData.push(obj)
    },
    deleteHandle(index) {
      this.classifyData.splice(index, 1)
    },
    //撤销修改(重新请求数据，不清空已保存数据)
    cancelModify() {
      this.dialogVisible = false
      this.list()
    },
    save() {
      let ary = []
      let flag = true
      this.classifyData.map(item => {
        let obj = JSON.parse(JSON.stringify(this.defaultClassifyItem))

        if (item['attributeType'] === 1) {
          if (item['attributeName'].trim() === '') {
            flag = false
          }
        } else if (item['attributeType'] === 2) {
          if (
            item['attributeRangeBegin'] === '' ||
            item['attributeRangeEnd'] === '' ||
            item['attributeRangeBegin'] >= item['attributeRangeEnd']
          ) {
            flag = false
          }
        } else if (item['attributeType'] === 3) {
        } else {
          //日期
          if (
            item['attributeRangeBegin'] === '' ||
            item['attributeRangeEnd'] === '' ||
            item['attributeRangeBegin'] >= item['attributeRangeEnd']
          ) {
            flag = false
          }
        }

        for (let i in obj) {
          if (i === 'attributeRangeBegin' || i === 'attributeRangeEnd') {
            obj[i] = item[i].toString()
          } else {
            obj[i] = item[i]
          }
        }
        ary.push(obj)
      })
      console.log(ary, 'ary')
      if (!flag) {
        this.$message('请先完善属性')
        return
      }
      save({
        categoryId: this.checkedId,
        categoryAttributeTemplates: ary
      })
        .then(() => {
          this.$message('保存成功')
        })
        .catch(error => {
          throw error
        })
    },
    list() {
      list({
        categoryId: this.checkedId,
        pageNumber: 1,
        pageSize: 100
      })
        .then(res => {
          this.classifyData = res.data.records
        })
        .catch(error => {
          throw error
        })
    },
    // 获取外部词条目录
    categoryTree() {
      this.isLoading = true
      categoryTree()
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
          this.treeData = res.data.children
          this.checkedParentItem = this.treeData[0]
          this.checkedId = this.treeData[0].id
          this.checkedParentId = this.treeData[0].parentId

          if (this.permission === '0') {
            this.getInnerTreeData()
          } else {
            this.isLoading = false
          }
        })
        .catch(error => {
          throw error
        })
    },
    // 获取内部词条目录
    getInnerTreeData() {
      getInternalEntryList().then(res => {
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
          this.innerTree = res.data.children
          // this.checkedParentItem = this.treeData[0]
          // this.checkedId = this.treeData[0].id
          // this.checkedParentId = this.treeData[0].parentId
          this.isLoading = false
        })
        .catch(error => {
          throw error
        })
    },
    handleNodeClick(data) {
      this.checkedId = data.id
      //获取选中分类的父级分类id，查询回父级分类的属性模板展示出来
      this.checkedParentId = data.parentId
      this.checkedParentItem = data
      this.list()
    }
  }
}
</script>

<style lang="scss" scoped>
.pos-rltv {
  position: relative;
}
.mg-t-15 {
  margin-top: 15px;
}
.page-title {
  margin: 0;
  padding: 10px 10px 10px 0;
  border-bottom: 10px solid #f6fafb;
  font-size: 20px;
  font-weight: bold;
  span {
    border-left: 5px solid #007fff;
    padding-left: 15px;
  }
}

.flex-box {
  display: flex;
  height: calc(100% - 50px);

  .el-tree-node__content {
    height: 28px;
  }
  .left {
    width: 300px;
    height: calc(100% - 52px);
    overflow: auto;
    background: #fff;
    padding: 0 16px;
    position: absolute;
    box-sizing: border-box;
    border-right: 10px solid #f6fafb;
  }

  h3 {
    font-weight: 400;
    font-size: 26px;
    margin: 0;
    padding: 20px 0 10px;
    border-bottom: 1px solid #e4e4e4;
  }

  &/deep/ .el-tree-node {
    padding: 2px 0;
    .el-tree-node {
      padding-left: 16px;
    }
  }

  .sub-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add-top {
      margin: 15px 0;
    }
  }

  .right-box {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    overflow: visible;
    max-width: unset;
    max-height: unset;
    margin-left: 300px;
    height: 100%;
    font-size: 26px;
    padding: 0 16px;
    background: #fff;
  }
}

.leftBorder {
  display: inline-block;
  vertical-align: top;
  background: #5d7cd8;
  width: 5px;
  height: 16px;
  margin-right: 15px;
}
.classifyForm {
  font-size: 0;
  li {
    display: inline-block;
    width: 50%;
    font-size: 14px;
    color: black;
    line-height: 30px;
    margin-top: 20px;
    .name {
      margin-right: 15px;
      display: inline-block;
      width: 200px;
      text-align: right;
      vertical-align: middle;
      max-height: 60px;
      overflow: hidden;
    }
    div {
      display: inline-block;
    }
  }
}

.classifyList {
  background: #459df5;
  color: white;
  font-size: 16px;
  line-height: 40px;
  > span {
    display: inline-block;
    position: relative;
    span {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      display: block;
      text-align: center;
    }
    .el-cascader {
      opacity: 0;
    }
    .el-cascader .el-input .el-input__inner {
      opacity: 0;
      text-align: center;
      background: #459df5 !important;
      color: white !important;
      border: none;
      padding: 0;
      &::placeholder {
        color: white;
      }
    }
    .el-icon-arrow-down:before {
      content: '' !important;
    }
    .el-cascader-menu__list {
      background: #97c8f9 !important;
      color: white !important;
    }
  }
}
</style>
