<template>
    <div style="display: flex;width: 1280px;margin: 0 auto;" >
        <div style="width: 80%;display: flex;flex-direction: column">
            <div>
                <!--<h3>[ci tiao ming cheng]</h3>-->
                <h1>{{wikiContent.entryName}}
                    <span style="font-size: 14px;color: #03A9F4">同义词：<template v-for="item,index in wikiContent.entrySynonyms">{{item.name}}
                    <span v-if="index+1<wikiContent.entrySynonyms.length">，</span></template></span>
                </h1>
            </div>
            <!-- summary -->
            <div class="mg-top-20" id="summary">
                <div class="block-container" v-for="item in wikiContent.entrySummarys" style="display: flex">
                    <div >
                        <el-image :src="JSON.parse(item.summary).img" style="width: 250px"></el-image>
                    </div>
                    <div v-if="item.status == 1" style="padding-left: 20px">
                        <span v-if="item.summary">{{JSON.parse(item.summary).text}}</span>
                        <span v-else>当前词条暂无描述</span>
                    </div>
                </div>
            </div>
            <!-- 目录 -->
            <div class="mg-top-20" style="display: flex;flex-direction: row" id="catalogue">
                <div class="block-container" style="width: calc(14% - 40px);font-weight: bolder"><p class="vertical-middle">目录</p></div>
                <ul style="padding: 15px;width: calc(21.5% - 31px);border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(0,8)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #03A9F4;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length >2" style="padding: 15px;width: calc(21.5%  - 31px);border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(8,16)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #03A9F4;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length > 16" style="padding: 15px;width: calc(21.5%  - 31px);border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(16,24)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #03A9F4;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length > 24" style="padding: 15px;width: calc(21.5%  - 30px)">
                    <li v-for="(item,index) in contentList.slice(24,32)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #03A9F4;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
            </div>
            <!-- 词条分类 -->
            <div class="mg-top-20" id="classify">
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
                            <h2 class="block" :id="item.id" v-if="item.contentTitle">{{index+1}}{{item.contentTitle}}</h2>
                            <div v-html="item.contentBody">}</div>
                            <template v-if="item.children.length > 0" v-for="key in item.children">
                                <div style="margin-left: 20px">
                                    <h3 :id="key.id">{{key.contentTitle}}</h3>
                                    <div v-html="key.contentBody"></div>
                                </div>
                                <template v-if="key.children.length > 0" v-for="v in key.children">
                                    <div style="margin-left: 20px">
                                        <h4 :id="v.id">{{v.contentTitle}}</h4>
                                        <div v-html="v.contentBody"></div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 引用 -->
            <div class="mg-top-20">
                <h3 id="reference">参考资料</h3>
                <div class="block-container">
                    <template v-for="(item,index) in wikiContent.entryReferrences">
                        <h6 style="margin: 5px">
                            {{index+1}}、<a class="quote-btn" @click="goLink(item.referrenceUrl)">{{item.referrenceTitle}}</a>
                        </h6>
                    </template>
                </div>
            </div>
            <!-- 标签 -->
            <div class="mg-top-20">
                <h3 id="tag">标签</h3>
                <div>
                    <template v-for="(item,index) in wikiContent.entryLabels">
                        <el-tag>{{item.labelName}}</el-tag>
                    </template>
                </div>
            </div>
        </div>
        <div >
            <div class="box-card">

                <el-card>
                    <div slot="header" class="clearfix">
                        <span>词条统计</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <p>创建者：{{wikiInfo.creator}}</p>
                    <p>编辑次数：{{wikiInfo.versionApprovingCount}}&nbsp;<a style="color:#03A9F4;cursor:pointer;" @click="toHistoryList(wikiInfo.id)">历史版本</a></p>
                    <p v-if="wikiContent.entryVersion">最近更新：{{new Date(wikiContent.entryVersion.updateTime).getFullYear()+'-'+(new Date(wikiContent.entryVersion.updateTime).getMonth()+1)+'-'+new Date(wikiContent.entryVersion.updateTime).getDate()}}</p>
                </el-card>
                <el-card style="margin-top: 20px">
                    <div slot="header" class="clearfix">
                        <span>快速导航</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>

                    <a @click="slideToAnchor('summary')" class="catalogue">摘要</a>
                    <a @click="slideToAnchor('catalogue')" class="catalogue">目录</a>
                    <a @click="slideToAnchor('classify')" class="catalogue">词条分类</a>
                    <div v-for="item in wikiContent.entryContentVos">
                        <a class="p1 catalogue" @click="slideToAnchor(item.id)">{{item.contentTitle}}</a>
                        <div v-for="k in item.children">
                            <a class="p2 catalogue" @click="slideToAnchor(k.id)">{{k.contentTitle}}</a>
                            <a class="p3 catalogue" v-for="v in k.children" @click="slideToAnchor(v.id)">{{v.contentTitle}}</a>
                        </div>
                    </div>
                    <a @click="slideToAnchor('reference')" class="catalogue">引用</a>
                    <a @click="slideToAnchor('tag')" class="catalogue">标签</a>
                </el-card>
            </div>
            <!--<el-tabs v-model="activeName">-->
                <!--&lt;!&ndash;<el-tab-pane label="目录模板" name="first">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button type="danger" @click="setTemplate(1)" class="btn-column">预设模板1</el-button>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-button type="danger" @click="setTemplate(2)" class="btn-column">预设模板2</el-button>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-tab-pane>&ndash;&gt;-->
                <!--<el-tab-pane label="目录" name="second">-->
                <!--</el-tab-pane>-->
            <!--</el-tabs>-->
        </div>
    </div>

</template>
<script>
    export default {
        name: 'editor',
        data() {
            return {
                wikiContent: {entrySummary: {summary: ''}},
                activeName: 'second',
                contentList: [],
                wikiInfo: {}
            }
        },
        mounted() {
            let vm = this
            vm.entryId = vm.$route.query.entryId
            vm.versionId = vm.$route.query.versionId?vm.$route.query.versionId:''
            vm.viewType = vm.$route.query.viewType
//            if(vm.viewType == 'preview') {
            vm.$axios.post('/wiki-backend/api/entry/getByVersionId', {entryId: vm.entryId,versionId: vm.versionId})
                .then(res => {
                    console.log(res.data)
                    vm.wikiContent = res.data
                    vm.contentList = []
                    vm.wikiContent.entrySummary = JSON.parse(res.data.entrySummary)
                    res.data.entryContentVos.map((item,index) => {
                        let obj1 = {
                            level: 1,
                            value: item.contentTitle,
                            id: item.id,
                            mark: index
                        }
                        vm.contentList.push(obj1)
                        item.children.map(k => {
                             let obj2 = {
                                 level: 2,
                                 value: k.contentTitle,
                                 id: k.id,
                                 mark: index
                             }
                             vm.contentList.push(obj2)
                             k.children.map(v=>{
                                 let obj3 = {
                                     level: 3,
                                     value: v.contentTitle,
                                     id: v.id,
                                     mark: index
                                 }
                                 vm.contentList.push(obj3)
                             })
                        })
                    })
                    console.log(vm.contentList)
                })
            this.$axios.post('/wiki-backend/api/entry/info',{id: vm.entryId})
                .then(res => {
                     console.log(res.data)
                     vm.wikiInfo = res.data
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
            },
            toHistoryList (target) {
                this.$router.push({
                    name:'entryVersionList',
                    query:{
                        entryId: target
                    }
                })
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
    .box-card{
        position: fixed !important;
        width: 200px;
        margin-top: 50px;
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
    .pd-top-5{
        padding-top: 5px;
    }
    a.catalogue{
        display: block;
        cursor: pointer;
    }
    .text-center{
        text-align: center;
    }
    .vertical-middle{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        margin: 0;
    }
    ul li{
        line-height: 20px;
    }
</style>