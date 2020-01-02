<template>
    <div>
        <el-card style="min-height: 500px;" class="myForm" shadow="hover">
            <div style="font-weight: bold;font-size: 28px;" slot="header" class="clearfix">
                <span class="leftBorder"></span>
                专题列表
            </div>
            <el-row style="margin: 0 0 0 20px;">
               	 专题名称
                <el-input placeholder="请输入内容" v-model="searchKeyword" style="margin-bottom: 10px;width: 44%">
                    <!--<el-button slot="append" @clcik="entrySearchList">搜索</el-button>-->
                </el-input>
                <el-button  @click="getSpecialList" style="background: #587dda !important;color: white;margin-left: 25px">搜索</el-button>
                <el-button type="primary" style="float:right;background: #ef5d5d !important;color: white;" @click="routeToSpecial('new')">
                	
                	新增
                	<i style="margin-left: -10px;" class="el-icon-plus el-icon--right"></i>
                </el-button>

            </el-row>
            <el-table
                    class="departTable"
                    :data="specialList"
                    border
                    style="width: 100%">
                <el-table-column label="专题名字" prop="specialName">
                </el-table-column>
                <el-table-column label="专题描述" prop="specialDesc"  width="300">
                </el-table-column>
                <el-table-column prop="labels" label="标签"></el-table-column>
                <el-table-column prop="keyWords" label="关键词"></el-table-column>

                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        {{parseTime(scope.row.createTime)}}
                    </template>
                </el-table-column>

                <el-table-column label="修改时间">
                    <template slot-scope="scope">
                        {{parseTime(scope.row.updateTime)}}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="routeToSpecial(scope.row)" type="text" size="small">详情</el-button>
<!--                        <el-button @click="getSpecialDetail(scope.row);dialogVisible = true;isEdit = true" type="text" size="small">修改</el-button>-->
                        <el-button @click="deleteSpecial(scope.row)" style="color: #e36d72;"  type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
            <!-- 弹窗 -->
            <el-dialog
                    :title="isEdit?'编辑专题':'添加专题'"
                    :visible.sync="dialogVisible">
            <span slot="footer" class="dialog-footer">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="专题名称">
                        <el-input v-model="form.specialName"></el-input>
                    </el-form-item>
                    <el-form-item label="专题描述">
                        <el-input v-model="form.specialDesc" type="textarea" :rows="2"></el-input>
                    </el-form-item>

                    <el-form-item label="专题分类">
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
                    <el-form-item label="专题封面">
                        <el-upload
                                style="float: left"
                                class="avatar-uploader"
                                :action="baseUrlConfig.UPLOAD_URL"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess">
                          <img v-if="form.specialCoverUrl" :src="form.specialCoverUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="关键词">
                        <el-input placeholder="回车添加关键词" v-model="keyword" class="input-with-select" @keyup.native.13="addKeyword">
                        <!--<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>-->
                        </el-input>
                        <div class="mg-top-20" v-show="keywords.length">
                            <el-tag
                                    style="float: left"
                                    v-for="tag in keywords"
                                    :key="tag"
                                    closable
                                    @close="handleClose(tag, 1)"
                                    type="info">
                                {{tag}}
                            </el-tag>
                        </div>
                    </el-form-item>

                    <el-form-item label="标签">
                        <el-input placeholder="回车添加标签" v-model="label" class="input-with-select" @keyup.native.13="addLabel">
                        <!--<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>-->
                        </el-input>
                        <div class="mg-top-20" v-show="keywords.length">
                            <el-tag
                                    style="float: left"
                                    v-for="tag in labels"
                                    :key="tag"
                                    closable
                                    @close="handleClose(tag, 1)"
                                    type="info">
                                {{tag}}
                            </el-tag>
                        </div>
                    </el-form-item>
                </el-form>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createNewSpecial" v-if="!isEdit">确 定</el-button>
                <el-button type="primary" @click="updateSpecial" v-else>确 定</el-button>
            </span>
            </el-dialog>
        </el-card>

    </div>
</template>

<script>
    import {entryVersionList,entryInfo} from '@/api/entry/index.js'
    import {categoryTree} from '@/api/classifyManager/index.js'
    import {parseTimeYMD} from '@/utils/commonMethod.js'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    export default {

        components: {
            ElFormItem,
            ElForm},
        name: 'specialManager',
        data() {
            return {
                entryId:'',
                specialList:[],
                info:{},
                pagination: {
                    page: 1,
                    limit: 10,
                    count: 0
                },
                dialogVisible: false,
                isEdit: false,
                form: {
                    specialName: '',
                    specialDesc:'',
                    categoryIds:'',
                    keyWords: '',
                    labels: '',
                    specialCoverUrl: '',
                    id: '',
                    nbct: sessionStorage.getItem('nbct')
                },
                keywords: [],
                keyword: '',
                labels: [],
                label: '',
                checkedCategoryName:'',
                treeData:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                showTree:false,
                searchKeyword: ''
            }
        },
        watch: {

        },
        created() {
            let vm = this
	    	Cetc10Auth().init(function(){
	    		vm.getSpecialList()
                vm.categoryTree()
	    	});
            
        },
        mounted() {
        },
        destroyed() {

        },
        methods: {
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
                categoryTree({}).then(res =>{
                    res.data.children.map((item)=>{
                        if(!item.children.length){
                            delete item.children
                        }
                        else{
                            item.children.map((item1)=>{
                                if(!item1.children.length){
                                    delete item1.children
                                }
                                else{
                                    item1.children.map((item2)=>{
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
            addKeyword () {
                let vm = this;
                if(vm.keywords.includes(vm.keyword)){
                    this.$message.error('该关键词已存在');
                } else {
                    vm.keywords.push(vm.keyword)
                    vm.keyword = '';
                }
            },
            addLabel() {
                let vm = this;
                if(vm.labels.includes(vm.label)){
                    this.$message.error('该标签已存在');
                } else {
                    vm.labels.push(vm.label)
                    vm.label = '';
                }
            },
            parseTime(str) {
                return parseTimeYMD(str)
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
                this.$axios.post('/wiki-backend/api/special/list',{
                    pageNumber: this.pagination.page,
                    pageSize: this.pagination.limit,
                    keyword: vm.searchKeyword
                }).then(res => {
                    vm.specialList = res.data.records
                    vm.pagination.count = res.data.total
                })
            },
            handleClose(tag, index) {
                if(index == 1){
                    this.keywords.splice(this.keywords.indexOf(tag), 1);
                } else {
                    this.labels.splice(this.labels.indexOf(tag), 1);
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.specialCoverUrl  = res.url
            },
            deleteSpecial (index) {
                let vm = this
                this.$axios.post('/wiki-backend/api/special/delete',{
                    id: index.id
                }).then(res => {
                    vm.getSpecialList()
                    vm.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                })
            },
            getSpecialDetail (index) {
                let vm = this
                console.log(vm.form)
                this.$axios.post('/wiki-backend/api/special/info', {id: index.id})
                    .then(res => {
                        vm.form = res.data.special
                    })
            },
            routeToSpecial (index) {
                if(index == 'new') {
                    this.$router.push({
                        path: '/specialDetail',
                        query: {
                            id: index
                        }
                    })
                }
                else{
                    this.$router.push({
                        path: '/specialDetail',
                        query: {
                            id: index.id
                        }
                    })
                }
            },
            updateSpecial () {
                let vm = this
                vm.form.keyWords = vm.keywords.join(',')
                vm.form.labels = vm.labels.join(',')
                console.log(vm.form)
                this.$axios.post('/wiki-backend/api/special/update', vm.form)
                    .then(res => {
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
                if(vm.form.id) delete vm.from.id
                console.log(vm.form)
                this.$axios.post('/wiki-backend/api/special/save', vm.form)
                    .then(res => {
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
        width: 178px;
        height: 178px;
        display: block;
    }
    .leftBorder{
        display: inline-block;
        vertical-align: middle;
        background: #5d7cd8;
        width: 5px;
        height: 20px;
        margin-right: 15px;
    }
    span.el-input__inner.changeTreeShow{
        text-align: left!important;
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
</style>