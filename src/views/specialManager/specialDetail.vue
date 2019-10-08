<template>
    <div>
        <div style="display: flex">

            <el-card style="width: 50%;margin: 10px" class="myForm" shadow="hover">
                <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
                    <span class="leftBorder"></span>
                    基础信息
                </div>

                <div style="display: flex;">
                    <el-form style="width: 100%">
                        <div style="display: flex">
                            <div style="display: flex;flex-direction: column;width: 50%">
                                <el-form-item label="专题名称：" style="display: flex;width: 100%">
                                    <el-input v-model="form.specialName" style="width: 170px"></el-input>
                                </el-form-item>
                                <el-form-item label="专题描述：" style="display: flex">
                                    <el-input v-model="form.specialDesc" type="textarea" style="width: 170px" :rows="5"></el-input>
                                </el-form-item>
                            </div>

                            <el-form-item label="专题封面：" style="display: flex;">
                                <el-upload
                                        style="float: left;width: 170px;"
                                        class="avatar-uploader"
                                        action="http://106.12.208.84:8080/wiki-backend/upload/uploadImg"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess">
                                    <img v-if="form.specialCoverUrl" :src="form.specialCoverUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </el-card>
            <el-card style="width: 50%;margin: 10px;overflow: unset" class="myForm" shadow="hover">
                <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
                    <span class="leftBorder"></span>
                    聚合规则
                </div>
                <div style="display: flex;">
                    <div style="display: flex;flex-direction: column;margin-left: 20px;width: 100%" >
                        <el-form ref="form" :model="form" label-width="80px">

                            <el-form-item label="专题分类：" >
                                <span @click="changeTreeShow" class="el-input__inner changeTreeShow">{{checkedCategoryName}}</span>
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
                            </el-form-item>
                            <el-form-item label="关键词：">
<!--                                <el-input placeholder="回车添加关键词" v-model="keyword" class="input-with-select" @keyup.native.13="addKeyword">-->
                                    <!--<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>-->
<!--                                </el-input>-->
                                <div class="mg-top-20" style="border-radius: 4px;border: 1px solid #DCDFE6;">
                                    <el-tag
                                            style="float: left"
                                            v-for="tag in keywords"
                                            :key="tag"
                                            closable
                                            @close="handleClose(tag, 1)"
                                            type="info">
                                        {{tag}}
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
<!--                                <el-input placeholder="回车添加标签" v-model="label" class="input-with-select" @keyup.native.13="addLabel">-->
<!--                                    &lt;!&ndash;<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>&ndash;&gt;-->
<!--                                </el-input>-->
                                <div class="mg-top-20" style="border-radius: 4px;border: 1px solid #DCDFE6;">
                                    <el-tag
                                            style="float: left"
                                            v-for="tag in labels"
                                            :key="tag"
                                            closable
                                            @close="handleClose(tag, 1)"
                                            type="info">
                                        {{tag}}
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
            </el-card>
        </div>

        <el-card style="min-height: 500px;margin: 10px">

            <div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
                <span class="leftBorder"></span>
                词条列表
                <el-button size="small" type="primary" style="float:right;background: rgb(86, 189, 157)" @click="dialogVisible = true,entrySearchList()">新增</el-button>

            </div>
            <el-table
                    class="departTable"
                    :data="entryList"
                    border
                    style="width: 100%">
                <el-table-column prop="entryName" label="词条名称" ></el-table-column>
                <el-table-column prop="summarys" label="描述" ></el-table-column>
                <el-table-column prop="creator" label="创建人" ></el-table-column>
                <el-table-column label="创建时间" >
                    <template slot-scope="scope">
                        {{parseTime(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="添加类型" >
                    <template slot-scope="scope">
                        {{scope.row.status == 1?'聚合':'手动'}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteFromSpecial(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
            <div style="text-align: center;margin-top: 20px">
<!--                <el-button @click="dialogVisible = false" size="small">取 消</el-button>-->
                <el-button type="primary" @click="createNewSpecial" v-if="!isEdit" size="small">确 定</el-button>
                <el-button type="primary" @click="updateSpecial" size="small" v-else>确 定</el-button>
            </div>
            <!-- 弹窗 -->
            <el-dialog
                    title="添加固有词条"
                    :visible.sync="dialogVisible">
                <el-input placeholder="请输入内容" v-model="entrySearch" style="margin-bottom: 10px">
                    <!--<el-button slot="append" @clcik="entrySearchList">搜索</el-button>-->
                    <el-button slot="append" @click="entrySearchList">搜索词条</el-button>
                </el-input>
                <el-table
                        class="departTable"
                        :data="entryListData"
                        border
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="ENTRY_NAME" label="词条名称" width="180"></el-table-column>
                    <el-table-column label="词条描述">
                        <template slot-scope="scope" v-for="item in entryListData.SUMMARY" v-if="item.dataType == 1">
                            {{JSON.parse(item).text}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background @size-change="handleEntrySizeChange" @current-change="handleEntryCurrentChange" :current-page="paginationEntry.page" :page-size="paginationEntry.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addToSpecial">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {categoryTree} from '@/api/classifyManager/index.js'
    import {parseTime} from '@/utils/commonMethod.js'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
    import {entryList} from '@/api/onlyShowData/index.js'
    export default {

        components: {
            ElInput,
            ElFormItem,
            ElForm},
        name: 'specialManager',
        data() {
            return {
                entrySearch: '',
                dialogVisible: false,
                entryList:[],
                keyword: '',
                categoryId:'',
                form: {
                    specialName: '',
                    specialDesc:'',
                    categoryIds:'',
                    keyWords: '',
                    labels: '',
                    specialCoverUrl: ''
                },
                pagination: {
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
                checkedCategoryName:'',
                treeData:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                keywords: [],
                labels: [],
                label: '',
                showTree:false,
                isEdit: false,
            }
        },
        watch: {

        },
        created() {
            let vm = this
            vm.specialId = vm.$route.query.id
            if(vm.specialId == 'new'){
                vm.isEdit = false
            } else {
                vm.isEdit = true
            }
            vm.getSpecialDetail(vm.$route.query.id)
        },
        mounted() {
        },
        destroyed() {

        },
        methods: {

            handleClose(tag, index) {
                if(index == 1){
                    this.keywords.splice(this.keywords.indexOf(tag), 1);
                } else {
                    this.labels.splice(this.labels.indexOf(tag), 1);
                }
            },
            addKeyword () {
                let vm = this;
                if(vm.keywords.includes(vm.keyword)){
                    this.$message.error('该关键词已存在');
                } else if(vm.keyword == '') {
                    return
                } else {
                    vm.keywords.push(vm.keyword)
                    vm.keyword = '';
                }
            },
            addLabel() {
                let vm = this;
                if(vm.labels.includes(vm.label)){
                    this.$message.error('该标签已存在');
                }  else if(vm.label == '') {
                    return
                } else {
                    vm.labels.push(vm.label)
                    vm.label = '';
                }
            },
            changeTreeShow() {
                this.showTree = !this.showTree
            },
            handleNodeClick(data, checked, node) {
                console.log(data)
                this.categoryId = data.id;
                this.checkedCategoryName = data.name;
                this.showTree = false
            },
            categoryTree() {
                let vm = this
                categoryTree({}).then(res =>{
                    res.data.children.map((item)=>{
                        if(vm.form.categoryIds == item.id) vm.checkedCategoryName = item.name
                        if(!item.children.length){
                            delete item.children
                        }
                        else{
                            item.children.map((item1)=>{
                                if(vm.form.categoryIds == item1.id) vm.checkedCategoryName = item1.name
                                if(!item1.children.length){
                                    delete item1.children
                                }
                                else{
                                    item1.children.map((item2)=>{
                                        if(vm.form.categoryIds == item2.id) vm.checkedCategoryName = item2.name
                                        if(!item2.children.length){
                                            delete item2.children
                                        }
                                    })
                                }
                            })
                        }
                    })
                    console.log(res.data.children,'111')
                    this.treeData = res.data.children
                })
                    .catch(res=>{
                        console.log(res)
                    })
            },
            handleSelectionChange(val) {
                this.entryIds = []
                val.map(item=>{
                    this.entryIds.push(item.ENTRY_ID)
                })
                console.log(this.entryIds)
            },
            parseTime(str) {
                return parseTime(str)
            },
            handleSizeChange(val) {
                this.pagination.page = 1
                this.pagination.limit = val
                this.getSpecialList()
            },
            handleCurrentChange(val) {
                this.pagination.page = val
                this.getSpecialList()
            },
            getSpecialList () {
                let vm = this
                this.$axios.post('/wiki-backend/api/specialDemandEntry/list',{specialId: vm.specialId,pageNumber:vm.pagination.page,pageSize:vm.pagination.limit})
                    .then(res =>{
                        vm.entryList = res.data.specialDemandEntry.records
                        vm.pagination.count = res.data.specialDemandEntry.total
                    })
            },
            handleEntrySizeChange (val) {
                this.entryListData.page = 1
                this.entryListData.limit = val
                this.entrySearchList()
            },
            handleEntryCurrentChange(val) {
                this.entryListData.page = val
                this.entrySearchList()
            },
            getSpecialDetail (index) {
                let vm = this
                console.log(vm.form)
                if(index == 'new') {
                    vm.categoryTree()
                } else  {
                    this.$axios.post('/wiki-backend/api/special/info', {id: index})
                        .then(res => {
                            vm.form = res.data.special
                            vm.keywords = res.data.special.keyWords.split(',')
                            vm.labels = res.data.special.labels.split(',')
                            vm.categoryTree()
                        })
                    this.$axios.post('/wiki-backend/api/specialDemandEntry/list',{specialId: index,pageNumber:vm.pagination.page,pageSize:vm.pagination.limit})
                        .then(res =>{
                            vm.entryList = res.data.specialDemandEntry.records
                            vm.pagination.count = res.data.specialDemandEntry.total
                        })
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.specialCoverUrl  = res.url
            },
            addToSpecial () {
                let vm = this
                let sort = []
                vm.entryIds.map((item,index)=>{
                    sort.push(index + 1)
                })
                vm.$axios.post('/wiki-backend/api/specialDemandEntry/save',{
                    specialId: vm.specialId,
                    entryIds: vm.entryIds.join(','),
                    sorts:sort.join(',')
                }).then(res=>{
                    vm.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    });
                    vm.getSpecialDetail(vm.specialId)
                    vm.dialogVisible = false
                })
            },
            deleteFromSpecial (index) {
                let vm = this
                vm.$axios.post('/wiki-backend/api/specialDemandEntry/delete',{
                    id: index.id
                }).then(res=>{
                    vm.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                    vm.getSpecialDetail(vm.specialId)
                })
            },
            entrySearchList(){
                let vm = this
                vm.$axios.post('/wiki-backend/api/entry/list',{
                    pageNumber: vm.paginationEntry.page,
                    pageSize: vm.paginationEntry.limit,
                    "categoryId": "",
                    "keyword": vm.entrySearch,
                }).then((res)=>{
                    vm.entryListData = res.data.records
                    vm.paginationEntry.count = res.data.total
                })
            },

            updateSpecial () {
                let vm = this
                vm.form.keyWords = vm.keywords.join(',')
                vm.form.labels = vm.labels.join(',')
                vm.form.categoryIds =  vm.categoryId
                console.log(vm.form, 'update')
                this.$axios.post('/wiki-backend/api/special/update', vm.form)
                    .then(res => {
                        vm.$router.replace({name: 'specialManager'})
                        vm.getSpecialList()
                        vm.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                        });
                        vm.dialogVisible = false
                        vm.keywords = []
                        vm.labels = []
                        vm.form = {
                            specialName: '',
                            specialDesc:'',
                            categoryIds:'',
                            keyWords: '',
                            labels: '',
                            specialCoverUrl: ''
                        }
                    })
            },
            createNewSpecial () {
                let vm = this
                vm.form.keyWords = vm.keywords.join(',')
                vm.form.labels = vm.labels.join(',')
                vm.form.categoryIds =  vm.categoryId
                if(vm.form.id) delete vm.from.id
                console.log(vm.form, 'create')
                this.$axios.post('/wiki-backend/api/special/save', vm.form)
                    .then(res => {
                        vm.$router.replace({name: 'specialManager'})
                        vm.getSpecialList()
                        vm.$message({
                            showClose: true,
                            message: '添加成功',
                            type: 'success'
                        });
                        vm.dialogVisible = false
                        vm.keywords = []
                        vm.labels = []
                        vm.form = {
                            specialName: '',
                            specialDesc:'',
                            categoryIds:'',
                            keyWords: '',
                            labels: '',
                            specialCoverUrl: ''
                        }
                    })
            }
        }

    }
</script>

<style lang="scss" scoped>
    .versionHistory{
        background: #f6fafb;
        color: black;
        line-height: 60px;
        .el-col-6{
            text-align: center;
        }
    }
    .statusList{
        li{
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
        .choosed{
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
        border-color: #409EFF;
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
    .mg-20{
        margin: 20px;
    }
    .entryListData{
         >div{
             line-height: 36px;
             font-size: 16px;
             font-weight: bold;
             display: flex;
             img{
                 width: 160px;
                 height: 120px;
                 margin-right: 20px;
             }
             .desc{
                 line-height: 20px;
                 font-weight: normal;
                 font-size: 14px;
             }
         }
         ul, li, p{
             cursor: pointer;
         }
         .entry-cell{
             padding: 10px 0;
         }
         .bd-bottom{
             border-bottom: 1px dotted #ccc;
         }
     }
    .leftBorder{
        display: inline-block;
        vertical-align: middle;
        background: #5d7cd8;
        width: 5px;
        height: 20px;
        margin-right: 15px;
    }
    .leftBorder{
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
</style>