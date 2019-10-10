<template>
    <div style="display: flex;margin: 0 auto;width: 1280px" id="entry-container" v-if="!doReload">
        <div style="width: calc(100% - 300px);display: flex;flex-direction: column;margin-bottom: 50px">
            <div v-show="auditShow" class="audit-box">
                <p class="audit-title"><span>审核操作</span></p>
                <el-button type="primary" @click="modalShow = true; code = '3'">审核通过</el-button>
                <el-button type="danger" @click="modalShow = true; code = '4'">审核不通过</el-button>
            </div>
            <div>
                <!--<h3>[ci tiao ming cheng]</h3>-->
                <h1 style="font-weight: normal">{{wikiContent.entryName}}
                    <span style="font-size: 14px;color: #338ce6">同义词：
                        <template  v-if="wikiContent.entrySynonyms.length" v-for="item,index in wikiContent.entrySynonyms">{{item.name}}
                            <span v-if="index+1<wikiContent.entrySynonyms.length">，</span>
                        </template>
                        <template v-if="!wikiContent.entrySynonyms.length">暂无同义词
                        </template>
                    </span>
                </h1>
            </div>
            <!-- summary -->
            <div class="mg-top-20" id="summary" >
                <div class="block-container" style="display: flex;flex-direction: column">
<!--                    <div>-->
<!--                        <el-image :src="JSON.parse(item.summary).img" style="width: 250px;min-height: 100px;height: auto">-->
<!--                            <div slot="error" class="image-slot" style="height: 100px;text-align: center;background: #f6fafb">-->
<!--                                <i class="el-icon-picture-outline" style="margin-top: 42px"></i>-->
<!--                            </div>-->
<!--                        </el-image>-->
<!--                    </div>-->
                    <div class="ck-content ck-summary" style="width: 100%;padding: 20px">
                        <div v-if="summaryEditor !== ''" v-html="summaryEditor" class="main-content"></div>
                        <span v-else>当前词条暂无描述</span>
                    </div>

                    <el-collapse accordion @change="showOtherSummaries = !showOtherSummaries" style="background: #eeeeee">
                        <el-collapse-item :title="showOtherSummaries?'收起':'展开其他来源摘要'"  style="background: #eeeeee">
                            <div style="display: flex;padding: 10px" v-for="item in otherSummaries">
                                <img :src="item.img" class="avatar" style="width: 25%">
                                <p class="main-content" style="margin-left: 10px">{{item.text}}
                                    [<span v-if="item.sourceType == 1" style="color: rgb(51, 140, 230)">词条来源：百度百科</span>
                                    <span v-if="item.sourceType == 2" style="color: rgb(51, 140, 230)">词条来源：搜狗百科</span>
                                    <span v-if="item.sourceType == 3" style="color: rgb(51, 140, 230)">词条来源：互动百科</span>
                                    <span v-if="item.sourceType == 4" style="color: rgb(51, 140, 230)">词条来源：维基百科</span>
                                    <span v-if="item.sourceType == 5" style="color: rgb(51, 140, 230)">词条来源：数据库抽取</span>
                                    <span v-if="item.sourceType == 6" style="color: rgb(51, 140, 230)">词条来源：文件夹抽取</span>]
                                </p>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
            <!-- 词条属性 -->
            <div class="mg-top-20" id="attribute" style="display: flex;flex-wrap: wrap;margin: 20px" v-if="wikiContent.entryAttributes.length">
                <div v-for="item in wikiContent.entryAttributes" style="width: 50%">
                    <p style="padding: 10px 30px;border-bottom: 1px dotted #ccc">
                        <strong style="width: 100px;display: inline-block">{{item.attributeKey}}</strong>
                        <span v-if="item.attributeType < 4||item.attributeType > 7">{{item.attributeValue}}</span>
                        <span v-else-if="item.attributeType == 4">{{new Date(Number(item.attributeValue)).getFullYear()}}年</span>
                        <span v-else-if="item.attributeType == 5">{{new Date(Number(item.attributeValue)).getFullYear()}}年{{new Date(Number(item.attributeValue)).getMonth()+1}}月</span>
                        <span v-else-if="item.attributeType == 6">{{new Date(Number(item.attributeValue)).getFullYear()}}年{{new Date(Number(item.attributeValue)).getMonth()+1}}月{{new Date(Number(item.attributeValue)).getDate()}}日</span>
                        <span v-else-if="item.attributeType == 7">{{new Date(Number(item.attributeValue)).getFullYear()}}年{{new Date(Number(item.attributeValue)).getMonth()+1}}月{{new Date(Number(item.attributeValue)).getDate()}}日&nbsp;{{new Date(Number(item.attributeValue)).getHours()}}:{{new Date(Number(item.attributeValue)).getMinutes()}}:{{new Date(Number(item.attributeValue)).getSeconds()}}</span>
                    </p>
                </div>
            </div>
            <!-- 目录 -->
            <div class="mg-top-20" style="display: flex;flex-direction: row" id="catalogue">
                <div class="block-container" style="width: calc(14% - 40px);font-weight: bolder"><p class="vertical-middle">目录</p></div>
                <ul style="padding: 15px;width: calc(21.5% - 31px);border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(0,8)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length >2" style="padding: 15px;width: calc(21.5%  - 31px);border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(8,16)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length > 16" style="padding: 15px;width: calc(21.5%  - 31px);border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(16,24)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length > 24" style="padding: 15px;width: calc(21.5%  - 30px)">
                    <li v-for="(item,index) in contentList.slice(24,32)">
                        <a @click="slideToAnchor(item.id)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor(item.id)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
            </div>
            <!-- 词条详情 -->
            <div style="display: flex"  class="mg-top-20" id="content">
                <div class="ck-content" style="width: 100%;padding: 20px">
                    <template v-for="item,index in wikiContent.entryContentVos">
                        <div >
                            <h2 class="shadow" :id="item.id" v-if="item.contentTitle!==null&&item.contentTitle!=='null'"><span style="color: #338ce6;font-family: fantasy;font-size: 40px;height: 40px;vertical-align: middle;">{{index+1}}</span><span class="block">{{item.contentTitle}}</span></h2>
                            <div v-html="item.contentBody" v-if="item.contentBody !== '<p>null</p>'&&item.contentBody !== null&&item.contentBody !== 'null'"></div>
                            <div v-else><p>&nbsp;</p></div>
                            <template v-if="item.children.length" v-for="key in item.children">
                                <div style="margin-left: 20px">
                                    <h3 :id="key.id" v-if="key.contentTitle!==null&&key.contentTitle!=='null'">{{key.contentTitle}}</h3>
                                    <div v-html="key.contentBody" v-if="key.contentBody !== '<p>null</p>'&&key.contentBody !== null&&key.contentBody !== 'null'"></div>
                                    <div v-else><p>&nbsp;</p></div>
                                </div>
                                <template v-if="key.children.length" v-for="v in key.children">
                                    <div style="margin-left: 20px">
                                        <h4 :id="v.id" v-if="v.contentTitle!==null&&v.contentTitle!=='null'">{{v.contentTitle}}</h4>
                                        <div v-html="v.contentBody" v-if="v.contentBody !== '<p>null</p>'&&v.contentBody !== null&&v.contentBody !== 'null'"></div>
                                        <div v-else="v.contentBody == '<p>null</p>'"><p>&nbsp;</p></div>
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
                        <el-tag style="margin-right: 10px">{{item.labelName}}</el-tag>
                    </template>
                </div>
            </div>
        </div>
        <div >
            <div class="box-card">

                <el-card>
                    <div class="card-title">
                        <span >词条统计</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <p class="pd-left-10">创建者：{{wikiInfo.creator}}</p>
                    <p class="pd-left-10">编辑次数：{{wikiInfo.versionApprovingCount}}&nbsp;<a style="color:#338ce6;cursor:pointer;" @click="toHistoryList(wikiInfo.id)">历史版本</a></p>
                    <p class="pd-left-10" v-if="wikiContent.entryVersion">最近更新：{{new Date(wikiContent.entryVersion.updateTime).getFullYear()+'-'+(new Date(wikiContent.entryVersion.updateTime).getMonth()+1)+'-'+new Date(wikiContent.entryVersion.updateTime).getDate()}}</p>
                </el-card>
                <el-card style="margin-top: 20px">
                    <div class="card-title">
                        <span >快速导航</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <div style="max-height: 330px;overflow-y: scroll">
                        <a @click="slideToAnchor('summary')" class="catalogue pd-left-10">摘要</a>
                        <a @click="slideToAnchor('catalogue')" class="catalogue pd-left-10">目录</a>
                        <a @click="slideToAnchor('attribute')" class="catalogue pd-left-10">词条属性</a>
                        <div v-for="item in wikiContent.entryContentVos" class="pd-left-10">
                            <a class="p1 catalogue" @click="slideToAnchor(item.id)">{{item.contentTitle}}</a>
                            <div v-for="k in item.children">
                                <a class="p2 catalogue" @click="slideToAnchor(k.id)">{{k.contentTitle}}</a>
                                <a class="p3 catalogue" v-for="v in k.children" @click="slideToAnchor(v.id)">{{v.contentTitle}}</a>
                            </div>
                        </div>
                        <a @click="slideToAnchor('reference')" class="catalogue pd-left-10">引用</a>
                        <a @click="slideToAnchor('tag')" class="catalogue pd-left-10">标签</a>
                    </div>
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
        <el-dialog title="审核意见" :visible.sync="modalShow">
		  <el-form>
		    <el-form-item label="审核意见">
		      <el-input v-model="comment" autocomplete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="modalShow = false">取 消</el-button>
		    <el-button type="primary" @click="modify">确 定</el-button>
		  </div>
		</el-dialog>
    </div>

</template>
<script>
import {audit} from '@/api/entry/index.js'
    export default {
        name: 'editor',
        data() {
            return {
                summaryEditor: '',
                otherSummaries: [{
                    img: 'http://106.12.208.84:8888/group1/M00/00/00/rBAABF2elj2AUOYtAANXnTl20iA914.jpg',
                    text: '123',
                    sourceType: 1
                }],
                activeNames: ['1'],
                wikiContent: {entryContentVos:[],entrySummarys:[],entryReferrences:[],entrySynonyms:[],entryAttributes:[],categories:[],entryLabels:[]},
                activeName: 'second',
                contentList: [],
                wikiInfo: {},
                comment: '',  // 审核意见
                auditShow: false,  // 审核操作框
                modalShow: false,  // 审核diag对话框
                code: '',  // 提交状态
                doReload: false,
                showOtherSummaries: false,
            }
        },
        mounted() {
            let vm = this
            vm.entryId = vm.$route.query.entryId
            vm.versionId = vm.$route.query.versionId?vm.$route.query.versionId:''
            vm.viewType = vm.$route.query.viewType
            vm.auditShow = sessionStorage.getItem('auditShow') === 'true'
            if(vm.viewType == 'preview') {
                vm.$axios.post('/wiki-backend/api/entry/getByVersionId', {entryId:vm.entryId,versionId:vm.versionId})
                    .then(res => {
                        console.log(res.data)
                        vm.wikiContent = res.data
                        vm.contentList = []
                        res.data.entrySummarys.map(item => {
                            if(item.dataType ==1 ){
                                vm.summaryEditor = JSON.parse(item.summary).text
                                console.log(vm.summaryEditor,1111111)
                                vm.imageUrl = JSON.parse(item.summary).img
                            } else {
                                let obj = {
                                    img : JSON.parse(item.summary).img,
                                    text : JSON.parse(item.summary).text,
                                    sourceType : item.sourceType,
                                    sourceValue : item.sourceValue
                                }
                                vm.otherSummaries.push(obj)
                            }
                        })
                        res.data.entryContentVos.map((item, index) => {
                            let obj1 = {
                                level: 1,
                                value: item.contentTitle,
                                id: item.id,
                                mark: index
                            }
                            if(obj1.value !== 'null'&&obj1.value !== null) {
                                vm.contentList.push(obj1)
                            }
                            item.children.map(k => {
                                let obj2 = {
                                    level: 2,
                                    value: k.contentTitle,
                                    id: k.id,
                                    mark: index
                                }
                                if(obj2.value !== 'null'&&obj2.value !== null) {
                                    vm.contentList.push(obj2)
                                }
                                k.children.map(v => {
                                    let obj3 = {
                                        level: 3,
                                        value: v.contentTitle,
                                        id: v.id,
                                        mark: index
                                    }
                                    if(obj3.value !== 'null'&&obj3.value !== null) {
                                        vm.contentList.push(obj3)
                                    }
                                })
                            })
                        })

                    })
                this.$axios.post('/wiki-backend/api/entry/info',{id: vm.entryId})
                    .then(res => {
                        console.log(res.data)
                        vm.wikiInfo = res.data
                    })
            }else{
                this.$axios.post('/wiki-backend/api/entry/info',{id: vm.entryId})
                    .then(res => {
                        console.log(res.data)
                        vm.wikiInfo = res.data
                        vm.$axios.post('/wiki-backend/api/entry/getByVersionId', {entryId:vm.entryId,versionId:res.data.versionId})
                            .then(res => {
                                console.log(res.data)
                                vm.wikiContent = res.data
                                vm.contentList = []
                                res.data.entrySummarys.map(item => {
                                    if(item.dataType ==1 ){
                                        vm.summaryEditor = JSON.parse(item.summary).text
                                        vm.imageUrl = JSON.parse(item.summary).img
                                    } else {
                                        let obj = {
                                            img : JSON.parse(item.summary).img,
                                            text : JSON.parse(item.summary).text,
                                            sourceType : item.sourceType,
                                            sourceValue : item.sourceValue
                                        }
                                        vm.otherSummaries.push(obj)
                                    }
                                })
                                res.data.entryContentVos.map((item, index) => {
                                    let obj1 = {
                                        level: 1,
                                        value: item.contentTitle,
                                        id: item.id,
                                        mark: index
                                    }
                                    if(obj1.value !== 'null'&&obj1.value !== null) {
                                        vm.contentList.push(obj1)
                                    }
                                    item.children.map(k => {
                                        let obj2 = {
                                            level: 2,
                                            value: k.contentTitle,
                                            id: k.id,
                                            mark: index
                                        }
                                        if(obj2.value !== 'null'&&obj2.value !== null) {
                                            vm.contentList.push(obj2)
                                        }
                                        k.children.map(v => {
                                            let obj3 = {
                                                level: 3,
                                                value: v.contentTitle,
                                                id: v.id,
                                                mark: index
                                            }
                                            if(obj3.value !== 'null'&&obj3.value !== null) {
                                                vm.contentList.push(obj3)
                                            }
                                        })
                                    })
                                })
                            })
                    })
            }
        },
        updated () {
            this.$nextTick(()=>{
                let target = document.getElementById('content').getElementsByTagName('img')
                let target_parent = document.getElementById('content').getElementsByClassName('img_r')
                setTimeout(()=>{
                    for (let i = 0;i<target.length;i++){
                        if(target[i].hasAttribute('data-original')) {
                            target[i].src = target[i].getAttribute('data-original')
                        }
                    }
                    // for(let j = 0;j<target_parent.length;j++){
                    //     target_parent[j].setAttribute('style', 'float: right;text-align: center;display:flex;flex-direction:column')

                    // }
                },1000)
            })
        },
        beforeRouteEnter(to, from, next){
            console.log(from)
            sessionStorage.setItem('auditShow', from.path === '/entryVersionExamine')
            next()
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
            },
            modify() {
                if(this.comment.trim() === ''){
				this.$message('请输入审核意见');
				    return
                }
                audit({
                    versionId:this.versionId,
                    auditContent:this.comment,
                    state: this.code, // 3 通过  4 拒绝
                }).then((res)=>{
                    let vm = this;
                    sessionStorage.setItem('auditShow', false)
                    this.modalShow = false
                    this.auditShow = false
                    this.$message.success('词条状态修改成功');
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .card-title{
        font-weight: bold;
        margin-bottom:10px;
    }
    .pd-left-10{
        padding-left: 10px;
    }
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
        color: white;
        padding: 5px 10px;
        background: #338ce6;
    }
    .el-card__header span{
        font-weight: bold;
    }
    .block-container{
        background: #eee;
        padding: 20px;
    }
    .pd-20{
        padding: 20px;
    }
    .quote-btn{
        color:  #338ce6;
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
        width: 250px;
        // margin-top: 50px;
        margin-left: 20px;
    }
    .el-card{
        background: #f6fafb;
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
        margin: 5px 0;
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

    .audit-title {
        margin: 0;
        padding: 10px 10px 10px 0;
        font-size: 18px;
        font-weight: bold;
        span {
            border-left: 5px solid #007fff;
            padding-left: 15px;
        }
    }
    #content /deep/ .img_r  {
       float: right;
       text-align: center;
       display: flex;
       flex-direction: column;
    }
</style>