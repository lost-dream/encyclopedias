<template>
    <div>

        <h2>专题管理<el-button type="primary" style="float:right" @click="dialogVisible = true">增加新专题</el-button></h2>
        <el-table
                class="departTable"
                :data="specialList"
                border
                style="width: 100%">
            <el-table-column label="专题名字" prop="specialName" width="180">
            </el-table-column>
            <el-table-column label="专题描述" prop="specialDesc" width="180">
            </el-table-column>
            <el-table-column prop="labels" label="标签" width="180"></el-table-column>
            <el-table-column prop="keyWords" label="关键词"></el-table-column>

            <el-table-column label="创建时间" width="180">
                <template slot-scope="scope">
                    {{parseTime(scope.row.createTime)}}
                </template>
            </el-table-column>

            <el-table-column label="修改时间" width="180">
                <template slot-scope="scope">
                    {{parseTime(scope.row.updateTime)}}
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="deleteSpecial(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
        <!-- 弹窗 -->
        <el-dialog
                title="选择分类"
                :visible.sync="dialogVisible">
            <span slot="footer" class="dialog-footer">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="专题名称">
                        <el-input v-model="form.specialName"></el-input>
                    </el-form-item>
                    <el-form-item label="专题描述">
                        <el-input v-model="form.specialDesc"></el-input>
                    </el-form-item>

                    <el-form-item label="专题封面">
                        <el-upload
                                style="float: left"
                                class="avatar-uploader"
                                action="http://106.12.208.84:8080/wiki-backend/upload/uploadImg"
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
                <el-button type="primary" @click="createNewSpecial">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {entryVersionList,entryInfo} from '@/api/entry/index.js'
    import {parseTime} from '@/utils/commonMethod.js'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    export default {

        components: {
            ElFormItem,
            ElForm},
        name: 'entryVersionList',
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
                form: {
                    specialName: '',
                    specialDesc:'',
                    categoryIds:'',
                    keyWords: '',
                    labels: '',
                    specialCoverUrl: ''
                },
                keywords: [],
                keyword: '',
                labels: [],
                label: ''
            }
        },
        watch: {

        },
        created() {
            let vm = this
            vm.getSpecialList()
        },
        mounted() {
        },
        destroyed() {

        },
        methods: {
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
                this.$axios.post('/wiki-backend/api/special/list',{
                    pageNumber: this.pagination.page,
                    pageSize: this.pagination.limit,
                    keyword: ''
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
            createNewSpecial () {
                let vm = this
                vm.form.keyWords = vm.keywords.join(',')
                vm.form.labels = vm.labels.join(',')
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
</style>