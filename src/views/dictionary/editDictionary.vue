<template>
    <div style="display: flex;max-width: 1280px;margin: 0 auto" >
        <div style="width: 80%;display: flex;flex-direction: column">
            <div>
                <h3>[ci tiao ming cheng]</h3>
                <h1>{{entryName}}</h1>
            </div>
            <!-- 词条分类 -->
            <div class="mg-top-20">
                <h4 class="block">词条分类</h4>
                <div class="block-container"></div>
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
                                :key="tag"
                                closable
                                @close="handleClose(tag, 1)"
                                type="info">
                            {{tag}}
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
                <div class="block-container"></div>
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
                                :key="tag"
                                closable
                                @close="handleClose(tag, 0)"
                                type="info">
                            {{tag}}
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
                    <el-button type="danger" @click="setTemplate(1)" class="btn-column">预设模板1</el-button>
                    <el-button type="danger" @click="setTemplate(2)" class="btn-column">预设模板2</el-button>
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
    </div>

</template>
<script>
    import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
    import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    //    import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
    export default {
        components: {ElForm},
        name: 'editor',
        data() {
            return {
                entryName: '词条名称',
                isInit: false,
                formLabelWidth: '120px',
                dialogVisible: true,
                model: [
                    {
                        'plate1': 1,
                        'plate2': 1,
                        'plate3': '',
                        'title': '红军',
                        'isActive': true,
                        'subtitle': '',
                        'content': '\n' +
                        '\t\t\t\t\n' +
                        '\t\t<p>工农红军此名称来源于苏联红军的正式名称工农红军（Рабо́че-крестья́нская Кра́сная а́рмия）。</p>',
                    },
                    {
                        'plate1': 2,
                        'plate2': 1,
                        'plate3': '',
                        'title': '历史沿革',
                        'isActive': true,
                        'subtitle': '',
                        'content': '<a name="5"> </a>',
                    },
                    {
                        'plate1': 2,
                        'plate2': 2,
                        'plate3': '',
                        'title': '历史沿革',
                        'isActive': true,
                        'subtitle': '南昌起义和井冈山会师',
                        'content': '<p>1927年8月1日，在中国共产党的领导下，爆发了“南昌起义”。<sup><a href="#hdtop_1" name="hdend_1" title="南昌起义">[1]</a></sup></p><div class="img img_r">\n' +
                        ' <a title="南昌起义" href="http://tupian.baike.com/a3_60_26_50200009239445155313262377273_s_jpg.html" target="_blank"><img title="南昌起义" alt="南昌起义" src="http://www.huimg.cn/lib/0.gif" data-original="http://a3.att.hudong.com/60/26/50200009239445155313262377273_s.jpg"></a>\n' +
                        ' <h4>南昌起义</h4>\n' +
                        '</div><div class="img img_r">\n' +
                        ' <a title="井冈山会师" href="http://tupian.baike.com/a1_60_32_50200009239445156259326737486_s_jpg.html" target="_blank"><img title="井冈山会师" alt="井冈山会师" src="http://www.huimg.cn/lib/0.gif" data-original="http://a1.att.hudong.com/60/32/50200009239445156259326737486_s.jpg"></a>\n' +
                        ' <h4>井冈山会师</h4>\n' +
                        '</div><p>1928年4月，朱德领导的南昌起义的队伍到达井冈山，与毛泽东领导的秋收起义的队伍与在井冈山会师，组成中国工农革命军第四军。</p><a name="7"> </a>',
                    },
                    {
                        'plate1': 2,
                        'plate2': 3,
                        'plate3': '',
                        'title': '历史沿革',
                        'isActive': true,
                        'subtitle': '广州起义首举“工农红军”旗帜',
                        'content': '<div class="img img_r">\n' +
                        ' <a title="中国工农红军" href="http://tupian.baike.com/a4_01_32_50200009239445156259325875126_s_jpg.html" target="_blank"><img title="中国工农红军" alt="中国工农红军" src="http://www.huimg.cn/lib/0.gif" data-original="http://a4.att.hudong.com/01/32/50200009239445156259325875126_s.jpg"></a>\n' +
                        ' <h4>中国工农红军</h4>\n' +
                        '</div><p>1927年12月11日凌晨，爆发了震惊中外的广州起义。起义领导机关在发布的《红旗号外》中宣布组织“工农红军”，并公布了工农红军领导人名单，参加起义的工农兵在起义爆发的当天就打出了“工农红军”的旗帜。</p><p>当日凌晨2时左右，张太雷、叶挺等领导人来到国民革命军第二方面军第四军军官教导团北较场四标营驻地举行誓师大会。在誓师大会上，广州起义总指挥部公开举起了“工农红军”的旗帜，将参加起义的部队统称为工农红军， \n' +
                        '工农红军总司令由叶挺担任。参加起义的部队包括国民革命军第四军教导团全部、警卫团一部和广州工人赤卫队七个联队以及市郊部分农民武装。</p><p>虽然广州起义不久便遭到失败，但“工农红军”的响亮名称却在全国不胫而走。从此，“红军”的称号在各地的革命武装中开始陆续使用。</p><a name="9"> </a>',
                    },
                    {
                        'plate1': 2,
                        'plate2': 4,
                        'plate3': '',
                        'title': '历史沿革',
                        'isActive': true,
                        'subtitle': '中共中央第51号通报',
                        'content': '<div class="img img_r">\n' +
                        ' <a title="袁鹏飞主题性创作-南梁扩红" href="http://tupian.baike.com/a1_78_32_50200009239445156259329164501_s_jpg.html" target="_blank"><img title="袁鹏飞主题性创作-南梁扩红" alt="袁鹏飞主题性创作-南梁扩红" src="http://www.huimg.cn/lib/0.gif" data-original="http://a1.att.hudong.com/78/32/50200009239445156259329164501_s.jpg"></a>\n' +
                        ' <h4>袁鹏飞主题性创作-南梁扩红</h4>\n' +
                        '</div><p>1928年5月25日，中共中央发出《中央通告第五十一号——军事工作大纲（采用广东省委扩大会议军事问题决议案内容）》。大纲规定：“建立红军已成为的要务，不一定要等到一省或一国暴动成功，只要能建立一割据区域，便应当开始建立红军的工作。在割据区域所建立的红军，可正式定名为红军，取消以前工农革命军的名义。” “红军中政治工作，必须特别注意”。“红军应由苏维埃派政治委员监督军官，并负责进行政治工作。政治委员应即为党代表”。</p><p>此后中国工农革命军第四军改称中国工农红军第四军。</p><a name="11"> </a>',
                    },
                    {
                        'plate1': 3,
                        'plate2': 1,
                        'plate3': '',
                        'title': '编制变迁',
                        'isActive': true,
                        'subtitle': '政治工作',
                        'content': '<a name="15"> </a>',
                    },
                    {
                        'plate1': 3,
                        'plate2': 2,
                        'plate3': '',
                        'title': '编制变迁',
                        'isActive': true,
                        'subtitle': '红一方面军',
                        'content': '<p>1930年8月24日，红一军团和红三军团在湖南浏阳永和会师，组成红一方面军（也称中央红军）。总司令朱德，总政治委员毛泽东。当时红一军团辖红三、四、十二军，红三军团辖红五、八、十六军。</p><div class="img img_r">\n' +
                        ' <a title="红一方面军" href="http://tupian.baike.com/a0_28_32_50200009239445156259326460055_s_jpg.html" target="_blank"><img title="红一方面军" alt="红一方面军" src="http://www.huimg.cn/lib/0.gif" data-original="http://a0.att.hudong.com/28/32/50200009239445156259326460055_s.jpg"></a>\n' +
                        ' <h4>红一方面军</h4>\n' +
                        '</div><p>1931年8月，张云逸、邓小平的红七军编入三军团。同年12月24日，宁都起义的国民党军   （26路军）编为红五军团。1932年6月改称红一方面军。</p><p>1933年编成为红一、三、五军团和江西军区独立师，其中，一军团辖四、十四、十五军（十四、十五军原为五军团编制），三军团辖一、二、三、四、六、七师，无军一级，五军团辖三、二（原一军团十二军）军。红七军团原为1930年赣东北红军部队扩编而成的红十军，1933年1月与中央红军会师，划归一方面军，1933年7月20日改为红七军团，红九军团于1933年10月28日由红一军团三师、红五军团十四师合编而成。红八军团由红七军团二十一师和中央红军直属二十三师，在1934年9月合编而成，兵力最高达24个军共7万余人。1933年编成为，一、三、五、六、七军团，1934年7月红七军团北上，改名“抗日先遣队”，10月与1933年初成立的新红十军合编为红十军团，后失败；六军团作为长征先遣队先前进至湘西和二军团会师。</p><p>1934年长征开始时，一方面军编成为红一、三（各三个师）、五、八、九（各两个师）军团，其中八、九军团为长征前最后一次“扩红”时组建，多为新兵，装备及战斗力较差。湘江之战时，八、九军团被打散。湘江之战后，八军团番号撤销。余部编入五、九军团，一直是作为全军后卫。九军团在贵州曾经单独作战，以掩护主力进行机动作战。</p><div class="img img_r">\n' +
                        ' <a title="红一方面军：总司令朱德" href="http://tupian.baike.com/a3_48_37_50200009239445156051378362318_s_jpg.html" target="_blank"><img title="红一方面军：总司令朱德" alt="红一方面军：总司令朱德" src="http://www.huimg.cn/lib/0.gif" data-original="http://a3.att.hudong.com/48/37/50200009239445156051378362318_s.jpg"></a>\n' +
                        ' <h4>红一方面军：总司令朱德</h4>\n' +
                        '</div><p>1935年毛儿盖会议之后，红一方面军离开红四方面军向陕北前进，其时五、九军团   因驻地在四方面军中，未能随军北上，编入红四方面军。俄界会议后，一、三军团与干部团编成中央纵队，至陕北组成陕甘支队，到达陕北前全军整编为红一军团，1935年11月与红十五军团汇合，合编为红一方面军。</p><a name="17"> </a>',
                    }
                ],
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
                editIndex: -1,
                activeName: 'first',
                menuList: [],
                submitList: []
            }
        },
        mounted() {
            this.setModel()
            this.initCKEditor()
            let vm = this
            // 获取目录列表
            vm.$axios.post('/wiki-backend/api/categoryContentTemplate/list',{pageNumber: 1,pageSize: 10})
                .then(res=>{
                    console.log(res)
                })
        },
        methods: {
            setModel () {
                let vm = this
                let wiki = ''
                vm.model.map((item)=>{
                    if(item['plate2'] == 1){
                        let h2 = '<h2>' + item.title + '</h2>'
                        wiki = wiki + h2 + item.content
                    } else {
                        let h3 = '<h3>' + item.subtitle + '</h3>'
                        wiki = wiki + h3 + item.content
                    }
                })
                vm.wiki = wiki
                document.getElementById('editor').innerHTML = wiki
            },
            initCKEditor() {
                var vm = this
//                const ft = new FocusTracker()
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
//                        obj.plate1 = index/2 + 1
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
//                                    obj.plate1 = index+1
//                                    obj.plate2 = (v+1)/2
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
//                                obj.plate1 = index+1
//                                obj.plate2 = (v+1)/2
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
//                                    obj.plate1 = index+1
//                                    obj.plate2 = l+1
//                                    obj.plate3 = (n+1)/2
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
//                                    obj.plate1 = index+1
//                                    obj.plate2 = l+1
//                                    obj.plate3 = (n/2)+1
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
                    lvl1.children = []
                    item.children.map(k => {
                        let lvl2 = {}
                        lvl2.title = k.title
                        lvl2.children = []
                        lvl1.children.push(lvl2)
                        k.children.map(v => {
                            let lvl3 = {
                                title: v.title
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
                    vm.synonymList.push(vm.synonym)
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
                    vm.tagList.push(vm.tag)
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
                    entryId: '',  // 返回值
                    versionId:'',
                    entryName: vm.entryName,
                    summary: vm.summary,
                    categorys: [], // 欧阳 - [categoryId，categoryId]
                    attributes: [], // 进哥 - [{key: keyName,value: value}]
                    content:vm.submitList,
                    label: vm.tagList,
                    referrences: vm.quoteList,
                    synonym: vm.synonymList
                }
                console.log(data)
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
        width: 200px;
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
</style>