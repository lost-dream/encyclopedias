<template>
    <div style="display: flex;max-width: 1280px;margin: 0 auto;" >
        <div style="width: 80%;display: flex;flex-direction: column">
            <div>
                <!--<h3>[ci tiao ming cheng]</h3>-->
                <h1>{{wikiContent.entryName}}
                    <span style="font-size: 14px;color: #03A9F4">同义词：<template v-for="item in wikiContent.entrySynonyms">{{item.name}}</template></span>
                </h1>
            </div>
            <!-- summary -->
            <div class="mg-top-20">
                <div class="block-container">
                    {{wikiContent.entrySummary.summary}}
                </div>
            </div>
            <!-- 目录 -->
            <div class="mg-top-20" style="display: flex;flex-direction: row">
                <div class="block-container" style="width: 20%;"><p>目录</p></div>
                <div v-for="(item,index) in wikiContent.entryContentVos">
                    <a @click="slideToAnchor(item.id)">{{item.contentTitle}}</a>
                    <div v-for="k in item.children">
                        <a @click="slideToAnchor(k.id)">{{k.contentTitle}}</a>
                        <a v-for="v in k.children" @click="slideToAnchor(v.id)">{{v.contentTitle}}</a>
                    </div>
                </div>
            </div>
            <!-- 词条分类 -->
            <div class="mg-top-20">
            </div>
            <!-- 词条详情 -->
            <div class="mg-top-20">
                <div class="block-container">
                </div>
            </div>
            <div style="display: flex"  class="mg-top-20">
                <div id="demo" style="width: 100%;padding: 20px">
                    <template v-for="item,index in wikiContent.entryContentVos">
                        <div >
                            <h2 class="block" :id="item.id">{{index+1}}{{item.contentTitle}}</h2>
                            <div>{{item.contentBody}}</div>
                            <template v-if="item.children.length > 0" v-for="key in item.children">
                                <div style="margin-left: 20px">
                                    <h3 :id="key.id">{{key.contentTitle}}</h3>
                                    <div>{{key.contentBody}}</div>
                                </div>
                                <template v-if="key.children.length > 0" v-for="v in key.children">
                                    <div style="margin-left: 20px">
                                        <h4 :id="v.id">{{v.contentTitle}}</h4>
                                        <div>{{v.contentBody}}</div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 引用 -->
            <div class="mg-top-20">、
                <h3>参考资料</h3>
                <div class="block-container">
                    <template v-for="(item,index) in wikiContent.entryReferrences">
                        <h6 style="margin: 5px">
                            {{index+1}}、<a class="quote-btn" @click="goLink(item.referrenceUrl)">{{item.referrenceTitle}}</a>
                        </h6>
                    </template>
                </div>
            </div>
            <!-- 引用 -->
            <div class="mg-top-20">
                <h3>标签</h3>
                <div>
                    <template v-for="(item,index) in wikiContent.entryLabels">
                        <el-tag>{{item.labelName}}</el-tag>
                    </template>
                </div>
            </div>
        </div>
        <div>
            <el-tabs type="border-card" v-model="activeName">
                <!--<el-tab-pane label="目录模板" name="first">-->
                    <!--<el-button type="danger" @click="setTemplate(1)" class="btn-column">预设模板1</el-button>-->
                    <!--<el-button type="danger" @click="setTemplate(2)" class="btn-column">预设模板2</el-button>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="目录" name="second">
                    <div v-for="item in wikiContent.entryContentVos">
                        <a class="p1" @click="slideToAnchor(item.id)">{{item.contentTitle}}</a>
                        <div v-for="k in item.children">
                            <a class="p2" @click="slideToAnchor(k.id)">{{k.contentTitle}}</a>
                            <a class="p3" v-for="v in k.children" @click="slideToAnchor(v.id)">{{v.contentTitle}}</a>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>
<script>
    export default {
        name: 'editor',
        data() {
            return {
                wikiContent: {entrySummary: {summary: ''}},
                activeName: 'second'
            }
        },
        mounted() {
            let vm = this
            this.$axios.post('/wiki-backend/api/entry/getByVersionId' ,{entryId:'1174974096481820673',versionId:'1174974096481820674'})
                .then(res => {
                    console.log(res)
                    vm.wikiContent = res.data
                })
        },
        methods: {
            goLink (link) {
                if(link.slice(0,4)=='http'){
                    window.open(link)
                } else {
                    window.open('http://' + link)
                }
            },
            slideToAnchor (target) {
                console.log(target)
                document.getElementById(target).scrollIntoView({behavior: 'smooth'})
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