<template>
  <div>
    <div class="card-box">
      <el-card class="myForm" shadow="hover">
        <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
          <span class="leftBorder"></span>
          基础信息
        </div>
        <div style="display: flex;" class="sepcial">
          <el-form style="width: 100%" label-width="140px">
            <div style="display: flex;">
              <el-form-item label="专题名称：" style="display: flex">
                <el-input v-model="form.specialName" style="width: 200px"></el-input>
              </el-form-item>

              <el-form-item v-if="permission === '0' && !isEdit" label="词条类别：" style="display: flex">
                <el-select size="small" v-model="form.region">
                  <el-option label="外部词条" value="outer"></el-option>
                  <el-option label="内部词条" value="inner"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-else-if="permission === '1' && !isEdit" label="词条类别：" style="display: flex">
                <el-select size="small" v-model="form.region">
                  <el-option label="外部词条" value="outer"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="permission === '0' && isEdit" label="词条类别：" style="display: flex">
                <el-input disabled value="内部词条"></el-input>
              </el-form-item>

              <el-form-item v-else-if="permission === '1' && isEdit" label="词条类别：" style="display: flex">
                <el-input disabled value="外部词条"></el-input>
              </el-form-item>
            </div>

            <div style="display: flex;">
              <el-form-item label="专题封面：" style="display: flex;">
                <el-upload
                    style="float: left;max-width: 140px;"
                    class="avatar-uploader"
                    :action="baseUrlConfig.UPLOAD_URL"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                >
                  <img v-if="form.specialCoverUrl" :src="form.specialCoverUrl" class="avatar" alt="" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <el-form-item label="专题描述：" style="display: flex; flex: 1">
                <el-input
                    v-model="form.specialDesc"
                    resize="none"
                    type="textarea"
                    style="width: 100%"
                    :rows="6"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-card>

      <!-- <el-card class="myForm" shadow="hover">
        <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
          <span class="leftBorder"></span>
          聚合规则
        </div>
        <div style="display: flex;">
          <div style="display: flex;flex-direction: column;margin-left: 20px;width: 100%">
            <el-form ref="form" :model="form" label-width="140px">
              <el-form-item label="专题分类：">
                <span
                  @click="changeTreeShow"
                  class="el-input__inner changeTreeShow"
                  style="padding: 0;color: rgb(192, 196, 204);"
                >
                  <el-tag
                    style="float: left"
                    v-for="tag in categoryName"
                    :key="tag"
                    closable
                    @close="handleClose(tag, 3)"
                    type="info"
                  >
                    {{ tag }} </el-tag
                  >点击添加
                </span>
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
                    &lt;!&ndash;<div class="custom-tree-node" slot-scope="{ node, data}">
                                          <div>
                                            <span @click.stop="chooseItem(data)">{{ data.name }}</span>
                                          </div>
                                          <span class="el-ic"></span>
                                        </div>&ndash;&gt;
                  </el-tree>
                </div>
              </el-form-item>
              <el-form-item label="关键词：">
                &lt;!&ndash;                                <el-input placeholder="回车添加关键词" v-model="keyword" class="input-with-select" @keyup.native.13="addKeyword">&ndash;&gt;
                &lt;!&ndash;<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>&ndash;&gt;
                &lt;!&ndash;                                </el-input>&ndash;&gt;
                <div class="mg-top-20" style="border-radius: 4px;border: 1px solid #DCDFE6;">
                  <el-tag
                    style="float: left"
                    v-for="tag in keywords"
                    :key="tag"
                    closable
                    @close="handleClose(tag, 1)"
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    placeholder="回车添加"
                    class="input-new-tag"
                    v-model="keyword"
                    ref="saveTagInput1"
                    @keyup.enter.native="addKeyword"
                    @blur="addKeyword"
                    size="small"
                  >
                  </el-input>
                </div>
              </el-form-item>

              <el-form-item label="标签：">
                &lt;!&ndash;                                <el-input placeholder="回车添加标签" v-model="label" class="input-with-select" @keyup.native.13="addLabel">&ndash;&gt;
                &lt;!&ndash;                                    &lt;!&ndash;<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>&ndash;&gt;&ndash;&gt;
                &lt;!&ndash;                                </el-input>&ndash;&gt;
                <div class="mg-top-20" style="border-radius: 4px;border: 1px solid #DCDFE6;">
                  <el-tag
                    style="float: left"
                    v-for="tag in labels"
                    :key="tag"
                    closable
                    @close="handleClose(tag, 2)"
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>

                  <el-input
                    placeholder="回车添加"
                    class="input-new-tag"
                    v-model="label"
                    ref="saveTagInput"
                    @keyup.enter.native="addLabel"
                    @blur="addLabel"
                    size="small"
                  >
                  </el-input>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>-->
    </div>
    <el-card style="min-height: 500px;margin: 10px">
      <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
        <span class="leftBorder"></span>
        词条列表
        <el-button
          size="small"
          type="primary"
          style="float:right;background: #ef5d5d !important;color: white;"
          @click="addEntry"
          >新增<i class="el-icon-plus el-icon--right"></i
        ></el-button>
      </div>
      <ul class="statusList">
        <li
          v-for="(item, index) in statusList"
          :key="index"
          :class="item.chosen ? 'chosen' : ''"
          @click="chooseStatus(item)"
        >
          {{ item.name }}
        </li>
      </ul>

      <!-- 手动添加 -->
      <div v-show="activeTab == 1">
        <el-table class="departTable" :data="conditionList" border style="width: 100%">
          <el-table-column prop="ENTRY_NAME" label="词条名称"></el-table-column>
          <el-table-column prop="summarys" label="描述"></el-table-column>
          <el-table-column prop="CREATOR" label="创建人"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ parseTime(scope.row.CREATE_TIME) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            @size-change="handleConditionSizeChange"
            @current-change="handleConditionCurrentChange"
            :current-page="conditionPagination.page"
            :page-size="conditionPagination.limit"
            layout="total, sizes, prev, pager, next"
            :total="conditionPagination.count"
        ></el-pagination>
      </div>

      <div v-show="activeTab == 2">
        <el-table class="departTable" :data="entryList" border style="width: 100%">
          <el-table-column prop="entryName" label="词条名称"></el-table-column>
          <el-table-column prop="summarys" label="描述"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteFromSpecial(scope.row)" type="text" size="small"
              >删除</el-button
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
      </div>
      <div style="text-align: center;margin-top: 20px">
        <!--<el-button @click="dialogVisible = false" size="small">取 消</el-button>-->
        <el-button
          type="primary"
          @click="createNewSpecial"
          v-if="!isEdit"
          size="small"
          style="background: #56BD9D"
        >
          确 定
        </el-button>
        <el-button
          type="primary"
          @click="updateSpecial"
          size="small"
          style="background: #56BD9D"
          v-else
        >
          确 定
        </el-button>
      </div>
      <!-- 弹窗 -->
      <el-dialog
        :title="'添加' + statusList[parseInt(activeTab - 1)].name"
        :visible.sync="dialogVisible"
      >
        <el-input placeholder="请输入内容" v-model="entrySearch" style="margin-bottom: 10px">
          <!--<el-button slot="append" @clcik="entrySearchList">搜索</el-button>-->
          <el-button slot="append" @click="entrySearchList">搜索词条</el-button>
        </el-input>
        <el-table
          class="departTable"
          :data="entryListData"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>

          <!--<el-table-column prop="ENTRY_NAME" label="词条名称" width="180"></el-table-column>
          <el-table-column label="词条描述">
            <template slot-scope="scope" v-for="item in entryListData.SUMMARY" v-if="item.dataType == 1">
              {{JSON.parse(item).text}}
            </template>
          </el-table-column>-->

          <el-table-column prop="title" label="词条名称" width="180"></el-table-column>
          <el-table-column prop="desc" label="词条描述">
            <template slot-scope="scope">
              <span v-html="scope.row.desc"></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleEntrySizeChange"
          @current-change="handleEntryCurrentChange"
          :current-page="paginationEntry.page"
          :page-size="paginationEntry.limit"
          layout="total, sizes, prev, pager, next"
          :total="pagination.count"
        ></el-pagination>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addToSpecial">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { categoryTree } from '@/api/classifyManager'
import { parseTimeYMD } from '@/utils/commonMethod'
import { entryList } from '@/api/onlyShowData'
import { specialSave } from '@/api/special'

export default {
  name: 'specialManager',
  data() {
    return {
      permission: sessionStorage.getItem('nbct'), // 判断权限   0 -- 内部人员  1 -- 外部人员
      createEntryId: null, // 新创建的词条生成的 id
      entrySearch: '',
      dialogVisible: false, // 弹窗显隐
      entryList: [],
      conditionList: [],
      keyword: '',
      categoryId: '',
      form: {
        specialName: '',
        specialDesc: '',
        categoryIds: '',
        keyWords: '',
        labels: '',
        specialCoverUrl: '',
        nbct: sessionStorage.getItem('nbct')
      },
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      },
      conditionPagination: {
        page: 1,
        limit: 10,
        count: 0
      },
      entryListData: [],
      paginationEntry: {
        page: 1,
        limit: 10,
        count: 0
      },
      entryIds: [],
      categoryName: [],
      categoryIds: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      keywords: [],
      labels: [],
      label: '',
      showTree: false,
      isEdit: false,
      statusList: [
        { id: '2', name: '固有词条',chosen: true },
        { id: '1', name: '推荐新闻',  }
      ],
      activeTab: '2'
    }
  },
  watch: {},
  created() {
    Cetc10Auth().init(() => {
      const id = this.$route.query.id
      this.specialId = id
      this.isEdit = this.specialId !== 'new'
      this.getSpecialDetail(id)
      this.getSpecialEntryList()
    })
  },
  methods: {
    handleClose(tag, index) {
      if (index == 1) {
        this.keywords.splice(this.keywords.indexOf(tag), 1)
      } else if (index == 2) {
        this.labels.splice(this.labels.indexOf(tag), 1)
      } else {
        this.categoryIds.splice(this.categoryIds.indexOf(tag), 1)
        this.categoryName.splice(this.categoryName.indexOf(tag), 1)
      }
      this.getConditionEntryList()
    },
    addKeyword() {
      if (this.keywords.includes(this.keyword)) {
        this.$message.error('该关键词已存在')
      } else if (this.keyword === '') {
        return
      } else {
        this.keywords.push(this.keyword)
        this.keyword = ''
      }
      this.getConditionEntryList()
    },
    addLabel() {
      if (this.labels.includes(this.label)) {
        this.$message.error('该标签已存在')
      } else if (this.label === '') {
        return
      } else {
        this.labels.push(this.label)
        this.label = ''
      }
      this.getConditionEntryList()
    },
    changeTreeShow() {
      this.showTree = !this.showTree
    },
    handleNodeClick(data) {
      if (this.categoryIds.includes(data.id)) {
        this.$message.error('专题已经拥有该分类')
      } else {
        this.categoryIds.push(data.id)
        this.categoryName.push(data.name)
        this.showTree = false
        this.getConditionEntryList()
      }
    },
    categoryTree() {
      let vm = this
      categoryTree()
        .then(res => {
          res.data.children.map(item => {
            if (vm.form.categoryIds.includes(item.id)) vm.categoryName.push(item.name)
            if (!item.children.length) {
              delete item.children
            } else {
              item.children.map(item1 => {
                if (vm.form.categoryIds.includes(item1.id)) vm.categoryName.push(item1.name)
                if (!item1.children.length) {
                  delete item1.children
                } else {
                  item1.children.map(item2 => {
                    if (vm.form.categoryIds.includes(item2.id)) vm.categoryName.push(item2.name)
                    if (!item2.children.length) {
                      delete item2.children
                    }
                  })
                }
              })
            }
          })
          this.treeData = res.data.children
        })
        .catch(error => {
          throw error
        })
    },
    handleSelectionChange(val) {
      this.entryIds = []
      val.map(item => {
        // this.entryIds.push(item.ENTRY_ID)
        this.entryIds.push(item.itemid)
      })
    },
    parseTime(str) {
      return parseTimeYMD(str)
    },
    handleSizeChange(val) {
      this.pagination.page = 1
      this.pagination.limit = val
      this.getSpecialEntryList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getSpecialEntryList()
    },
    handleConditionSizeChange(val) {
      this.conditionPagination.page = 1
      this.conditionPagination.limit = val
      this.getConditionEntryList()
    },
    handleConditionCurrentChange(val) {
      this.conditionPagination.page = val
      this.getConditionEntryList()
    },
    getConditionEntryList() {
      // entryList({
      //   pageNumber: this.paginationEntry.page,
      //   pageSize: this.paginationEntry.limit,
      //   categoryIds: this.categoryIds.join(','),
      //   keywords: this.keywords.join(','),
      //   labels: this.labels.join(',')
      // }).then(res => {
      //     this.conditionList = res.data.records
      //     this.conditionPagination.count = res.data.total
      //   })
    },
    getSpecialEntryList(id) {
      let vm = this
      this.$axios
        .post('/wiki-backend/api/specialDemandEntry/list', {
          specialId: id ? id : vm.specialId,
          pageNumber: vm.pagination.page,
          pageSize: vm.pagination.limit
        })
        .then(res => {
          vm.entryList = res.data.entry
          vm.pagination.count = res.data.specialDemandEntry.total
        })
    },
    handleEntrySizeChange(val) {
      this.entryListData.page = 1
      this.entryListData.limit = val
      this.entrySearchList()
    },
    handleEntryCurrentChange(val) {
      this.entryListData.page = val
      this.entrySearchList()
    },
    getSpecialDetail(index) {
      let vm = this
      if (index === 'new') {
        vm.categoryTree()
      } else {
        this.$axios
          .post('/wiki-backend/api/special/info', {
            id: index,
            pageNumber: vm.pagination.page,
            pageSize: vm.pagination.limit
          })
          .then(res => {
            vm.form = res.data.special
            vm.keywords = res.data.special.keyWords ? res.data.special.keyWords.split(',') : []
            vm.labels = res.data.special.labels ? res.data.special.labels.split(',') : []
            vm.categoryIds = res.data.special.categoryIds
              ? res.data.special.categoryIds.split(',')
              : []
            vm.categoryTree()
            vm.getConditionEntryList()
          })
      }
    },
    handleAvatarSuccess(res) {
      this.form.specialCoverUrl = res.url
    },
    addToSpecial() {
      let sort = []
      this.entryIds.map((item, index) => {
        sort.push(index + 1)
      })
      this.$axios
        .post('/wiki-backend/api/specialDemandEntry/save', {
          specialId: this.createEntryId ? this.createEntryId : this.$route.query.id,
          entryIds: this.entryIds.join(','),
          sorts: sort.join(',')
        })
        .then(() => {
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })

          const id = this.createEntryId ? this.createEntryId : this.$route.query.id
          this.getSpecialEntryList(id)
          this.getSpecialDetail(this.specialId)
          this.dialogVisible = false
        })
    },
    deleteFromSpecial(index) {
      let vm = this
      const id = this.createEntryId ? this.createEntryId : this.$route.query.id
      vm.$axios
        .post('/wiki-backend/api/specialDemandEntry/delete', {
          id: index.id,
          specialId: id
        })
        .then(() => {
          vm.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          vm.getSpecialEntryList(id)
        })
    },
    entrySearchList() {
      //换成全站搜索的接口，内网环境才能调通
      let vm = this
      vm.$axios
        .post('/wiki-backend/encyclopedia/search/query', {
          pageNumber: vm.paginationEntry.page,
          pageSize: vm.paginationEntry.limit,
          query: vm.entrySearch
        })
        .then(res => {
          if (res.data.records) {
            res.data.records.map(item => {
              try {
                item.img = JSON.parse(item.text).img
                item.desc = JSON.parse(item.text).text
              } catch (e) {
                item.img = ''
                item.desc = ''
              }
            })
            vm.entryListData = res.data.records
          } else {
            vm.entryListData = [];
          }

          vm.paginationEntry.count = res.data.total
        })
    },

    updateSpecial() {
      let vm = this
      vm.form.keyWords = vm.keywords.join(',')
      vm.form.labels = vm.labels.join(',')
      vm.form.categoryIds = vm.categoryIds.join(',')
      this.$axios.post('/wiki-backend/api/special/update', vm.form).then(res => {
        vm.$router.replace({ name: 'specialManager' })
        vm.getSpecialEntryList()
        vm.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        vm.dialogVisible = false
        vm.keywords = []
        vm.labels = []
        // vm.form = {
        //   specialName: '',
        //   specialDesc: '',
        //   categoryIds: '',
        //   keyWords: '',
        //   labels: '',
        //   specialCoverUrl: ''
        // }
      })
    },
    createNewSpecial() {
      if (this.form.specialName === '') {
        this.$message.error('请填写专题名称')
        return
      }
      if (!this.form.region || this.form.region === '') {
        this.$message.error('请选择词条类别')
        return
      }
      // if (this.form.specialCoverUrl === '') {
      //   this.$message.error('请上传专题封面')
      //   return
      // }
      // if (this.form.specialDesc === '') {
      //   this.$message.error('请填写专题描述')
      //   return
      // }



      this.form.keyWords = this.keywords.join(',')
      this.form.labels = this.labels.join(',')
      this.form.categoryIds = this.categoryIds.join(',')
      if (this.form.id) delete this.from.id

      specialSave(this.form).then(() => {
        this.$router.replace({ name: 'specialManager' })
        this.getSpecialEntryList()
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.keywords = []
        this.labels = []
        // this.form = {
        //   specialName: '',
        //   specialDesc: '',
        //   categoryIds: '',
        //   keyWords: '',
        //   labels: '',
        //   specialCoverUrl: ''
        // }
      })
    },
    addEntry() {
      if (this.form.specialName === '') {
        this.$message.error('请填写专题名称')
        return
      }
      if ((!this.form.region || this.form.region === '') && !this.isEdit) {
        this.$message.error('请选择词条类别')
        return
      }
      // if (this.form.specialCoverUrl === '') {
      //   this.$message.error('请上传专题封面')
      //   return
      // }
      // if (this.form.specialDesc === '') {
      //   this.$message.error('请填写专题描述')
      //   return
      // }

      this.form.keyWords = this.keywords.join(',')
      this.form.labels = this.labels.join(',')
      this.form.categoryIds = this.categoryIds.join(',')
      if (!this.isEdit) {
        if (this.form.id) delete this.from.id

      }

      if (this.isEdit) {
        this.$axios.post('/wiki-backend/api/special/update', this.form).then(res => {
          if (res.status === 'success') {
            this.keywords = []
            this.labels = []
            // this.form = {
            //   specialName: '',
            //   specialDesc: '',
            //   categoryIds: '',
            //   keyWords: '',
            //   labels: '',
            //   specialCoverUrl: ''
            // }

            this.dialogVisible = true
            this.createEntryId = res.data // 创建的词条生成的 id
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$axios.post('/wiki-backend/api/special/save', this.form).then(res => {
          if (res.status === 'success') {
            this.keywords = []
            this.labels = []
            // this.form = {
            //   specialName: '',
            //   specialDesc: '',
            //   categoryIds: '',
            //   keyWords: '',
            //   labels: '',
            //   specialCoverUrl: ''
            // }

            this.dialogVisible = true
            this.createEntryId = res.data // 创建的词条生成的 id
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },

    chooseStatus(item) {
      this.statusList.map(item => {
        item.chosen = false
      })
      this.status = item.id
      item.chosen = true
      this.activeTab = item.id
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .avatar-uploader-icon,
/deep/ .avatar {
  width: 140px !important;
  height: 140px !important;
  line-height: 140px !important;
}
/deep/ .sepcial .el-form-item__content {
  margin-left: 0 !important;
  flex: 1;
}
.versionHistory {
  background: #f6fafb;
  color: black;
  line-height: 60px;
  .el-col-6 {
    text-align: center;
  }
}
.statusList {
  li {
    display: inline-block;
    background: #e6e6e6;
    color: #adadad;
    font-weight: bold;
    font-size: 18px;
    width: 90px;
    text-align: center;
    border-right: 1px solid #d0d0d0;
    line-height: 40px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .chosen {
    background: #337ab7;
    color: white;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dotted #ccc;
  border-radius: 5px;
}
.avatar {
  width: 200px;
  height: auto;
  display: block;
}
.mg-20 {
  margin: 20px;
}
.entryListData {
  > div {
    line-height: 36px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    img {
      width: 160px;
      height: 120px;
      margin-right: 20px;
    }
    .desc {
      line-height: 20px;
      font-weight: normal;
      font-size: 14px;
    }
  }
  ul,
  li,
  p {
    cursor: pointer;
  }
  .entry-cell {
    padding: 10px 0;
  }
  .bd-bottom {
    border-bottom: 1px dotted #ccc;
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
.leftBorder {
  display: inline-block;
  vertical-align: middle;
  background: #5d7cd8;
  width: 5px;
  height: 20px;
  margin-right: 15px;
}
.el-form-item__content {
  width: 70%;
}
.myTree {
  background: white;
  position: absolute;
  /* left: 78px; */
  top: 40px;
  width: calc(100% - 8px);
  z-index: 999;
  padding: 5px 5px 5px 0;
  border: 1px solid #ebebeb;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag.el-tag--info {
  margin: 4px;
}
.statusList {
  li {
    display: inline-block;
    background: #e6e6e6;
    color: #adadad;
    font-weight: bold;
    font-size: 18px;
    width: 90px;
    text-align: center;
    border-right: 1px solid #d0d0d0;
    line-height: 40px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    cursor: pointer;
  }
  .choosed {
    background: #337ab7;
    color: white;
  }
}
@media (min-width: 1501px) {
  .card-box {
    display: flex;
  }
  .myForm {
    // TODO 右边删掉一个框，所以把这个拉伸，如果代码回滚，打开 838 行，删除 839 行
    /*width: 50%;*/
    width: 100%;

    margin: 10px;
    overflow: unset;
  }
}
@media (max-width: 1500px) {
  .card-box {
    display: block;
  }
  .myForm {
    margin: 10px;
    overflow: unset;
  }
}
</style>
