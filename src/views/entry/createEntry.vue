<template>
    <div style="display: flex;width: 1280px;margin: 0 auto" >
        <div style="width: 80%;display: flex;flex-direction: column">
            <div>
                <h3>[ci tiao ming cheng]</h3>
                <el-input  v-model="entryName"></el-input>
            </div>
            <!-- 词条分类 -->
            <div class="mg-top-20">
                <h4 class="block">词条分类</h4>
                <div class="block-container">
                    <el-tag
                        v-for="item in savedCategories"
                        :key="item.id"
                        type="primary">
                        {{ item.name }}
                    </el-tag>
                    <el-button class="button-new-category" size="small" @click="dialogVisible = true"> + 添加分类</el-button>
                </div>
            </div>
            <!-- 同义词 -->
            <div class="mg-top-20">
                <h4 class="block">同义词</h4>
                <div class="block-container">
                    <el-input placeholder="回车添加同义词" v-model="synonym" class="input-with-select" @keyup.native.13="addSymonyn">
                        <!--<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>-->
                    </el-input>
                    <div class="mg-top-20" v-show="synonymList.length">
                        <el-tag
                                v-for="tag in synonymList"
                                :key="tag.name"
                                closable
                                @close="handleClose(tag, 1)"
                                type="info">
                            {{tag.name}}
                        </el-tag>
                    </div>
                </div>
            </div>
            <!-- 摘要 -->
            <div class="mg-top-20">
                <h4 class="block">摘要</h4>
                <div>
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="summary">
                    </el-input>
                </div>
            </div>
            <!-- 属性 -->
            <div class="mg-top-20">
                <h4 class="block">属性</h4>
                <div class="block-container">
                    <!--分类树-->
					<el-row>
						<!-- <treemenu @parentMethod="chooseItem" :list="treeData"></treemenu> -->
					</el-row>
                </div>
            </div>
            <!-- 正文 -->
            <div class="mg-top-20">
                <h4 class="block">正文</h4>
                <div id="toolbar"></div>
                <div id="editor"></div>
            </div>

            <!-- 引用 -->
            <div class="mg-top-20">
                <h4 class="block">引用</h4>
                <div class="block-container">
                    <template v-for="(item, index) in quoteList">
                        <el-card class="box-card" style="margin-bottom: 10px">
                            <p>{{item.title}}
                                <span style="float: right;">
                                <a @click="editQuote(index)" class="quote-btn">编辑</a>
                                <a @click="deleteQuote(index)" class="quote-btn">删除</a>
                            </span>
                            </p>
                            <p>{{item.inntroduce}}</p>
                            <a  target="_blank" class="quote-btn" @click="goLink(item.url)">{{item.url}}</a>
                        </el-card >
                    </template>
                    <el-form label-width="80px">
                        <el-form-item label="说明">
                            <el-input v-model="quote.inntroduce"></el-input>
                        </el-form-item>
                        <el-form-item label="原始标题">
                            <el-input v-model="quote.title"></el-input>
                        </el-form-item>
                        <el-form-item label="网址">
                            <el-input v-model="quote.url"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center;display: flex;" class="mg-top-20">
                        <el-button type="danger" @click="resetQuote" >取消</el-button>
                        <el-button type="primary" @click="addQuoteToList" v-show="editIndex<0">添加</el-button>
                        <el-button type="primary" @click="addQuoteToList" v-show="editIndex>=0">保存</el-button>
                    </div>
                </div>
            </div>
            <!-- 标签 -->
            <div class="mg-top-20">
                <h4 class="block">标签</h4>
                <div class="block-container">
                    <el-input placeholder="回车添加标签" v-model="tag" class="input-with-select" @keyup.native.13="addTag">
                        <!--<el-button slot="append" icon="el-icon-circle-plus-outline" @clcik.native="addSymonyn"></el-button>-->
                    </el-input>
                    <div class="mg-top-20" v-show="tagList.length">
                        <el-tag
                                v-for="tag in tagList"
                                :key="tag.name"
                                closable
                                @close="handleClose(tag, 0)"
                                type="info">
                            {{tag.name}}
                        </el-tag>
                    </div>
                </div>
            </div>

            <div style="text-align: center;display: flex;" class="mg-top-20">
                <el-button type="danger" @click="commit('save')" >保存草稿</el-button>
                <el-button type="primary" @click="commit('submit')" >提交词条</el-button>
            </div>
        </div>
        <div>
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="目录模板" name="first">
                    <el-tree 
                        class="template-left"
                        :data="categoryTreeData" 
                        :props="{label: 'name'}"
                        @node-click="loadContent">
                    </el-tree>
                    <div class="template-right">
                        <h4>{{selectedCategory}}</h4>
                        <ul v-if="contentData.length" class="content-menu">
                            <li v-for="item in contentData" v-bind:key="item.id">
                                <template v-if="item.children.length">
                                    {{item.contentName}}
                                    <ul>
                                        <li v-for="el in item['children']" v-bind:key="el.id">
                                            {{el.contentName}}
                                        </li>
                                    </ul>
                                </template> 
                                <template v-else>
                                    {{item.contentName}}
                                </template>
                            </li>
                        </ul>
                        <p v-else class="empty-list">当前暂无目录模板数据</p>
                    </div>
                    <!-- <el-button type="danger" @click="setTemplate(1)" class="btn-column">预设模板1</el-button>
                    <el-button type="danger" @click="setTemplate(2)" class="btn-column">预设模板2</el-button> -->
                </el-tab-pane>
                <el-tab-pane label="修改目录" name="second">
                    <div v-for="item in menuList">
                        <p class="p1">{{item.title}}</p>
                        <div v-for="k in item.children">
                            <p class="p2">{{k.title}}</p>
                            <p class="p3" v-for="v in k.children">{{v.title}}</p>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog
        title="选择分类"
        :visible.sync="dialogVisible"
        :before-close="handleCloseModel">
            <tree-transfer 
                ref="treeTransfer"
                width="85%"
                height="540px"
                :title="title" 
                :from_data='categoryTreeData' 
                :to_data='toData' 
                :defaultProps="{label:'name'}" 
                pid="parentId" 
                @addBtn='add' 
                @removeBtn='remove' 
                @left-check-change="checkLength"
                :mode='mode' 
                :addressOptions="{num: 1, connector: ''}" 
                filter
                style="margin: 0 auto;min-width: 740px"></tree-transfer>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCategory">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import treeTransfer from 'el-tree-transfer'
    import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    import tabMenu from '../../components/treeMenu'
    import {categoryTree} from '@/api/classifyManager/index.js'
    import categoryApi from '@/api/categoryManager/index.js'
    import treemenu from '@/components/treeMenu'
    import templateApi from '@/api/contentTemplate/index.js'
    import _ from 'lodash'
    //    import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
    export default {
        components: {ElForm,tabMenu,treemenu,treeTransfer},
        name: 'editor',
        data() {
            return {
                entryName: '',
                isInit: false,
                formLabelWidth: '120px',
                dialogVisible: false,
                model: [],
                wiki: '',
                editor: null,
                synonym:'',
                synonymList:[],
                tag: '',
                tagList: [],
                summary:'',
                quoteList: [],
                quote: {
                    title: '',
                    url:'',
                    inntroduce: ''
                },
                treeData: [],
                editIndex: -1,
                activeName: 'first',
                menuList: [],
                submitList: [],
                // 分类部分
                title: ["全部分类", "已选择"],
                mode: "addressList", // transfer addressList
                categoryTreeData: [],
                toData:[],
                savedCategories: [],
                savedCategoriesArr: [],
                leafNumber: 0,
                // 目录
                contentData: [],
                selectedCategory: '',
            }
        },
        created(){
            this.getCategoryTree();
        },
        mounted() {
            this.setModel()
            this.initCKEditor()
            this.categoryTree()
        },
        methods: {
            setModel () {
                document.getElementById('editor').innerHTML = ''
            },
            //分类树
            categoryTree() {
                categoryTree({}).then(res =>{
                    //从第一级开始取
                    res.data.children.forEach((item)=>{
                        if(!item.children.length){
                            delete item.children
                        }
                        else{
                            item.children.forEach((item1)=>{
                                if(!item1.children.length){
                                    delete item1.children
                                }
                                else{
                                    item1.children.forEach((item2)=>{
                                        if(!item2.children.length){
                                            delete item2.children
                                        }
                                    })
                                }
                            })	
                        }
                    })
                    console.log(res.data.children)
                    this.treeData = res.data.children
                })
                .catch(res=>{
                    console.log(res)
                })
            },
            initCKEditor() {
                var vm = this
                // const ft = new FocusTracker()
                if (!this.isInit) {
                    CKEditor.create(document.querySelector('#editor'), {
                        language: 'zh-cn',
                        ckfinder: {
                            uploadUrl: '/admin/Upload/uploadUrl'
                            //后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
                        }
                    }).then(editor => {
                        const toolbarContainer = document.querySelector('#toolbar');
                        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
                        this.editor = editor //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
                        vm.updateEditorContent()
                        editor.editing.view.document.on("change:isFocused", (evt, name, value) => {
                            if (value) {
                                return false
                            } else {
                                vm.updateEditorContent()
                            }
                        })
                    }).catch(error => {
                        console.error(error);
                    });
                    this.isInit = true
                } else {
                    return false
                }
            },
            updateEditorContent(){
                let vm = this
                let reg1 = new RegExp(/<h2>(.*?)<\/h2>/g)
                let reg2 = new RegExp(/<h3>(.*?)<\/h3>/g)
                let reg3 = new RegExp(/<h4>(.*?)<\/h4>/g)
                let r_1 = vm.editor.getData().split(reg1)
                let r = r_1.filter(function (s) {
                    return s && s.trim()
                })
                r.map((item,index)=>{
                    if(item == '&nbsp;') {
                        r.splice(index,1)
                    }
                })
                let arr_main = []
                let arr_sub = []
                // 切割一级标题h2并构建一级目录结构
                // 两级目录间有内容，切割长度为奇数；无内容为偶数
                r.map((item,index) => {
                    let obj = {}
                    if(index%2==0){
                        obj.title = item
                        // obj.plate1 = index/2 + 1
                        obj.children = []
                        arr_main.push(obj)
                    } else {
                        // 预先切割h2标题
                        arr_sub.push(item.split(reg2))
                    }
                })
                // 构建二级目录结构
                arr_sub.map((item,index)=>{
                    if(item.length%2==1){
                        // 如果一级目录和二级目录之间有内容，则将一级目录content设置为中间部分的内容
                        arr_main[index].content = item[0]
                        // 生成二级目录对象
                        item.map((k,v)=>{
                            if(v>0){
                                if(v%2==1){
                                    let obj = {}
                                    obj.title = k
                                    // obj.plate1 = index+1
                                    // obj.plate2 = (v+1)/2
                                    obj.content = item[v+1]
                                    obj.children = []
                                    arr_main[index].children.push(obj)
                                }
                            }
                        })
                    } else {
                        // 如果一级目录和二级目录之间有内容，则将一级目录content设置为空
                        arr_main[index].content = ''
                        // 生成二级目录对象
                        item.children.map((k,v)=>{
                            if(v%2==0){
                                let obj = {}
                                obj.title = k
                            //    obj.plate1 = index+1
                            //    obj.plate2 = (v+1)/2
                                obj.content = item[v+1]
                                obj.children = []
                                arr_main[index].children.push(obj)
                            }
                        })
                    }
                })
                // 构建三级目录结构
                arr_main.map((item,index)=>{
                    item.children.map((k,l)=>{
                        // 对二级目录的content切割h4
                        let tmp = k.content.split(reg3)
                        if(tmp.length%2==1){
                            // 如果二级目录和三级目录之间有内容，则将二级目录content替换为中间部分的内容
                            k.content = tmp[0]
                            // 生成三级目录对象
                            tmp.map((v,n)=>{
                                if(n%2==1){
                                    let obj = {}
                                    obj.title = v
                                    obj.content = tmp[n+1]
                                //    obj.plate1 = index+1
                                //    obj.plate2 = l+1
                                //    obj.plate3 = (n+1)/2
                                    k.children.push(obj)
                                }
                            })
                        } else {
                            // 如果二级目录和二级目录之间没有内容，则将一级目录content设置为空
                            k.content = ''
                            // 生成三级目录对象
                            tmp.map((v,n)=>{
                                if(n%2==0){
                                    let obj = {}
                                    obj.title = v
                                    obj.content = tmp[n+1]
                                //    obj.plate1 = index+1
                                //    obj.plate2 = l+1
                                //    obj.plate3 = (n/2)+1
                                    item.children[l].push(obj)
                                }
                            })
                        }
                    })
                })
                console.log('提交格式为')
                console.log(arr_main)
                vm.submitList = arr_main
                let arr = []
                arr_main.map(item => {
                    let lvl1 = {}
                    lvl1.title = item.title
                    lvl1.sourceType = 7
                    lvl1.sourceValue = null
                    lvl1.children = []
                    item.children.map(k => {
                        let lvl2 = {}
                        lvl2.title = k.title
                        lvl1.sourceType = 7
                        lvl1.sourceValue = null
                        lvl2.children = []
                        lvl1.children.push(lvl2)
                        k.children.map(v => {
                            let lvl3 = {
                                title: v.title,
                                content: v.content,
                                sourceType: 7,
                                sourceValue: null
                            }
                            lvl2.children.push(lvl3)
                        })
                    })
                    arr.push(lvl1)
                })
                vm.menuList = arr
                console.log(arr)
            },
            addSymonyn () {
                let vm = this;
                if(vm.synonymList.includes(vm.synonym)){
                    this.$message.error('该同义词已存在');
                } else {
                    let obj = {
                        name: vm.synonym,
                        sourceType: 7,
                        sourceValue: null
                    }
                    vm.synonymList.push(obj)
                    vm.synonym = '';
                }
            },
            handleClose(tag, index) {
                if(index == 1){
                    this.synonymList.splice(this.synonymList.indexOf(tag), 1);
                    console.log(this.synonymList)
                } else {
                    this.tagList.splice(this.tagList.indexOf(tag), 1);
                    console.log(this.tagList)
                }
            },
            addTag () {
                let vm = this;
                if(vm.tagList.includes(vm.tag)){
                    this.$message.error('该标签已存在');
                } else {
                    let obj = {name: vm.tag,sourceType:7,sourceValue:null}
                    vm.tagList.push(obj)
                    vm.tag = '';
                }
            },
            resetQuote () {
                this.quote = {title:'',url: '',inntroduce:''}
            },
            addQuoteToList () {
                console.log(this.editIndex)
                let vm = this
                if(vm.quote.name == ''||vm.quote.inntroduce == ''||vm.quote.url == '') {
                    vm.$message.error('请填写所有数据！');
                    return false
                }
                if(vm.editIndex>=0){
                    vm.$set(vm.quoteList[vm.editIndex], vm.quote)
                    vm.quote = {title:'',url: '',inntroduce:''}
                    vm.editIndex = -1
                } else{
                    if(vm.quoteList.includes(vm.quote)) {
                        vm.$message.error('引用数据重复！');
                        return false
                    }
                    vm.quoteList.sourceType = 7
                    vm.quoteList.sourceValue = null
                    vm.quoteList.push(vm.quote)
                    vm.quote = {title:'',url: '',inntroduce:''}
                }
            },
            editQuote (index) {
                this.editIndex = index
                this.quote = this.quoteList[index]
            },
            deleteQuote(index){
                this.quoteList.splice(index,1)
            },
            goLink (link) {
                if(link.slice(0,4)=='http'){
                    window.open(link)
                } else {
                    window.open('http://' + link)
                }
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            setTemplate (index) {
                let content
                if(index == 1){
                    content = '<h2>歼-20</h2><h3>基础信息</h3><h4>作战半径</h4><h4>空-空格斗</h4><h4>最大航速</h4><h4>载弹</h4><h2>发展历史</h2><h3>测试阶段</h3><h4>首飞</h4><h3>第一次作战</h3><h4>第一次作战</h4>'
                } else {
                    content = '<h2>目录1</h2><h3>目录1-1</h3><h4>目录1-1-1</h4><h4>目录1-1-2</h4><h3>目录1-2</h3><h4>目录1-2-1</h4><h2>目录2</h2><h3>目录2-1</h3><h4>目录2-1-1</h4>'
                }
                let vm = this
                this.$confirm('生成模板将删除正文所有内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '生成模板成功!'
                    });
                    vm.editor.setData(content)
                    vm.updateEditorContent()
                }).catch(() => {
                });
            },
            commit (method) {
                let vm = this
                let data = {
                    operate: method,
                    editReson: '',
                    entryId: '',  // 返回值
                    versionId:'',
                    entryName: vm.entryName,
                    summary: [{value:JSON.stringify({img: '',text:vm.summary}),sourceType:7,sourceValue: null}],
                    categorys: vm.savedCategoriesArr, // 欧阳 - [categoryId，categoryId]
                    attributes: [], // 进哥 - [{key: keyName,value: value}]
                    content:vm.submitList,
                    label: vm.tagList,
                    referrences: vm.quoteList,
                    synonym: vm.synonymList
                }
                console.log(data)
                vm.$axios.post('/wiki-backend/api/entry/save', data)
                    .then(res =>{
                        if(res.status == 'success'){
                            vm.$router.push('/myEntry')
                        }
                    })
                console.log(data)

            },
            // 获取分类树
            getCategoryTree(){
                let vm = this
                categoryApi.getTreeData()
                .then(res => {
                    console.log('success:', res);
                    // return;
                    if(res.status == 'success'){
                        let data = res.data && (_.cloneDeep(res.data.children) || [])
                        vm.categoryTreeData = data;
                    }else{
                        this.$message.error("获取分类信息失败，请稍后重试！")
                    }
                })
                .catch(res => {
                    // console.log('error: ', res)
                    this.$message.error("请求出错，错误原因： " + res.msg ? res.msg : JSON.stringify(res));
                })
            },
            // 监听穿梭框组件添加
            add(transfered){
                this.savedCategories = transfered
            },
            // 监听穿梭框组件移除
            remove(transfered){
                this.savedCategories = transfered
            },
            // 限制最多选5个
            checkLength(nodeObj, treeObj, checkAll){
                // console.log(nodeObj, treeObj, checkAll)
                let vm = this,
                    treeComp = this.$refs.treeTransfer.$children[2],
                    arr = treeComp.getCheckedNodes().filter(x => !x.children.length);

                if((arr && ((arr.length + vm.savedCategories.length) > 5))){
                    this.$message.error("最多只能选择5个最末级分类");
                    treeComp.setCheckedKeys([]);
                    this.$refs.treeTransfer.from_check_all = false
                    this.$refs.treeTransfer.from_disabled =true
                    this.$refs.treeTransfer.from_check_keys = []
                }
            },
            // 关闭弹窗二次确认
            handleCloseModel(done) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
            },
            // 保存词条分类
            saveCategory(){
                // 处理一下savedCategories数组, 提出来id，重新弄个数组就ok
                this.savedCategoriesArr = this.savedCategories.map(x => x.id)
                this.dialogVisible = false;
            },
            // 获取目录数据
            loadContent(data, node, component){
                this.selectedCategory = data.name
                if(!data.children.length){
                    templateApi.checkTemplateTreeData({
                        id: data.id
                    })
                    .then(res => {
                        // 
                        this.contentData = res.data
                    })
                    .catch(e => {

                    })
                }
            }
        }
    }
</script>
<style scoped>
    .ck-rounded-corners .ck.ck-editor__editable:not(.ck-editor__nested-editable), .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-rounded-corners{
        border: 1px solid #ccc
    }
    .btn-column{
        margin-left: 0 !important;
        margin-top: 10px;
        width: 100%;
    }
    .mg-top-20{
        margin-top: 20px;
    }
    .content-level2{
        margin-left: 40px;
    }
    .content-level3{
        margin-left: 80px;
    }
    .btn-row{
        width: 100px;
        float: right;
        margin-right: 10px;
    }
    .block{
        width: 100px;
        text-align: center;
        color: white;
        padding: 10px;
        background: #03A9F4;
    }
    .block-container{
        background: #eee;
        padding: 20px;
    }
    .pd-20{
        padding: 20px;
    }
    .quote-btn{
        color:  #03A9F4;
        padding-right: 10px;
        cursor: pointer;
    }
    .box-card p{
        margin: 5px 0;
    }
    .el-form-item{
        margin-bottom: 10px;
    }
    .el-tabs--border-card{
        position: fixed !important;
        width: 340px;
        margin-top: 100px;
        margin-left: 20px;
    }
    .p1{
        font-size: 16px;
        font-weight: bolder;
    }
    .p2{
        font-size: 14px;
        padding-left:10px;
    }
    .p3{
        font-size: 12px;
        padding-left:20px;
        font-weight: lighter;
    }
    .el-dialog__wrapper /deep/ .el-dialog {
        min-width: 780px;
    }
    .el-tag,.button-new-category {
        min-width: 80px;
        text-align: center;
    } 
    .el-tag + .el-tag, .button-new-category {
        margin-left: 10px;
    }
    .el-dialog__wrapper /deep/ .u-clear {
        color: #409EFF !important;
    }

    .template-left {
        position: absolute;
        padding-right: 10px;
        width: 130px;
        border-right: 1px solid #f2f2f2;
        height: 100%;
    }
    .template-right {
        display: inline-block;
        margin-left: 151px;
        color: #606266;
        font-size: 14px;
    }
    #pane-first {
        position: relative;
        min-height: 300px;
    }

    .content-menu li {
        margin: 10px 0;
        list-style: initial;
    }

    .content-menu li ul {
        padding-left: 30px;
    }
    .template-right .empty-list {
        display: flex;
        min-width: 150px;
        height: 280px;
        justify-content: center;
        align-items: center;
        color: #999;
    }
</style>