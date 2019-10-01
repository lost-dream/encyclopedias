<template>
    <div>
        <h2>专题固有词条管理<el-button type="primary" style="float:right" @click="dialogVisible = true;keyword='';entrySearchList()">添加固有词条</el-button></h2>
        <div style="display: flex;">
            <div>
                <img v-if="form.specialCoverUrl" :src="form.specialCoverUrl" class="avatar" style="margin-top: 20px;margin-left: 20px">
            </div>
            <div style="display: flex;flex-direction: column;width: 30%" >
                <el-input v-model="form.specialName" disabled="" class="mg-20"></el-input>
                <el-input v-model="form.specialDesc" disabled="" type="textarea" :rows="5" class="mg-20"></el-input>
            </div>
            <div style="display: flex;flex-direction: column;margin-left: 20px;width: 30%" >
                <el-input v-model="form.keyWords" disabled="" class="mg-20"></el-input>
                <el-input v-model="form.labels" disabled="" class="mg-20"></el-input>
                <el-input v-model="form.categoryIds" disabled="" class="mg-20"></el-input>
            </div>
        </div>
        <el-table
                class="departTable"
                :data="entryList"
                border
                style="width: 100%">
            <el-table-column prop="entryName" label="词条名称" ></el-table-column>
            <el-table-column prop="creator" label="创建人" ></el-table-column>
            <el-table-column label="创建时间" >
                <template slot-scope="scope">
                    {{parseTime(scope.row.createTime)}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="deleteFromSpecial(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.page" :page-size="pagination.limit" layout="total, sizes, prev, pager, next" :total="pagination.count"></el-pagination>
        <!-- 弹窗 -->
        <el-dialog
                title="添加固有词条"
                :visible.sync="dialogVisible">
            <el-input placeholder="请输入内容" v-model="keyword" style="margin-bottom: 10px">
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
    </div>
</template>

<script>
    import {entryVersionList,entryInfo} from '@/api/entry/index.js'
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
                entryIds: []
            }
        },
        watch: {

        },
        created() {
            let vm = this
            vm.specialId = vm.$route.query.id
            vm.getSpecialDetail(vm.$route.query.id)
        },
        mounted() {
        },
        destroyed() {

        },
        methods: {
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
                this.$axios.post('/wiki-backend/api/special/info', {id: index,pageNumber:vm.pagination.page,pageSize:vm.pagination.limit})
                    .then(res => {
                        vm.form = res.data.special
                        vm.entryList = res.data.entry.records
                        vm.pagination.count = res.data.entry.total
                    })
            },
            addToSpecial () {
                let vm = this
                let sort = ''
                vm.entryIds.map((item,index)=>{
                    sort = sort + (index + 1)
                })
                vm.$axios.post('/wiki-backend/api/specialDemandEntry/save',{
                    specialId: vm.specialId,
                    entryIds: vm.entryIds.join(','),
                    sorts:sort
                }).then(res=>{
                    vm.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    });
                    vm.getSpecialDetail(vm.specialId)
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
                    "keyword": vm.keyword
                }).then((res)=>{
                    vm.entryListData = res.data.records
                    vm.paginationEntry.count = res.data.total
                })
            },
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
</style>