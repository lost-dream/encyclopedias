<template>
    <div style="display: flex;margin: 0 auto;width: 1280px" id="entry-container" v-if="!doReload" v-loading="!wikiContent.entryName">
        <div style="width: calc(100% - 300px);display: flex;flex-direction: column;margin-bottom: 50px">
            <div>
                <!--<h3>[ci tiao ming cheng]</h3>-->
                <h1 style="font-weight: normal;font-size: 35px;"><span style="font-weight: bold;">{{wikiContent.entryName}}</span>
                    <span style="font-size: 28px;color: #338ce6">同义词：
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
                    <div class="ck-content ck-summary" style="width: 100%;padding: 20px 0">
                        <div v-if="summaryEditor !== ''" v-html="summaryEditor" class="main-content"></div>
                        <span v-else>当前词条暂无描述</span>
                    </div>

                    <el-collapse accordion @change="showOtherSummaries = !showOtherSummaries" style="background: #eeeeee" v-if="otherSummaries.length">
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
            <div class="mg-top-20" id="attribute" style="display: flex;flex-wrap: wrap;padding: 20px 0;margin-top: 50px;" v-if="wikiContent.entryAttributes.length">
                <div v-for="item in wikiContent.entryAttributes" style="width: 50%;display: inline-block;">
                    <p style="padding: 10px 30px 10px 0px;border-bottom: 1px dotted #ccc;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                        <p style="width: 160px;display: inline-block;padding-left: 60px;">{{item.attributeKey}}</p>
                        <p style="display: inline-block;vertical-align: top;width: 50%;">
                        	<span v-if="item.attributeType < 4||item.attributeType > 7">{{item.attributeValue}}</span>
	                        <span v-else-if="item.attributeType == 4">{{new Date(Number(item.attributeValue)).getFullYear()}}年</span>
	                        <span v-else-if="item.attributeType == 5">{{new Date(Number(item.attributeValue)).getFullYear()}}年{{new Date(Number(item.attributeValue)).getMonth()+1}}月</span>
	                        <span v-else-if="item.attributeType == 6">{{new Date(Number(item.attributeValue)).getFullYear()}}年{{new Date(Number(item.attributeValue)).getMonth()+1}}月{{new Date(Number(item.attributeValue)).getDate()}}日</span>
	                        <span v-else-if="item.attributeType == 7">{{new Date(Number(item.attributeValue)).getFullYear()}}年{{new Date(Number(item.attributeValue)).getMonth()+1}}月{{new Date(Number(item.attributeValue)).getDate()}}日&nbsp;{{new Date(Number(item.attributeValue)).getHours()}}:{{new Date(Number(item.attributeValue)).getMinutes()}}:{{new Date(Number(item.attributeValue)).getSeconds()}}</span>
                        </p>
                        
                    </p>
                </div>
            </div>
            <!-- 目录 -->
            <div class="mg-top-20" style="display: flex;flex-direction: row" id="catalogue">
                <div class="block-container juedui_middle" style="width: calc(14% - 40px);width: 97px;display: inline-block;background: #fbfbfb;text-align: center;position: relative;">
                	<p class="vertical-middle">目录</p>
                </div>
                <ul style="padding: 15px;width: calc(21.5% - 31px);width: 180px;display: inline-block;border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(0,8)">
                        <a @click="slideToAnchor1(item)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length >2" style="padding: 15px;width: calc(21.5%  - 31px);width: 180px;display: inline-block;border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(8,16)">
                        <a @click="slideToAnchor1(item)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length > 16" style="padding: 15px;width: calc(21.5%  - 31px);width: 180px;display: inline-block;border-right: 1px dotted #ccc">
                    <li v-for="(item,index) in contentList.slice(16,24)">
                        <a @click="slideToAnchor1(item)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
                <ul v-if="contentList.length > 24" style="padding: 15px;width: calc(21.5%  - 30px);width: 180px;display: inline-block;">
                    <li v-for="(item,index) in contentList.slice(24,32)">
                        <a @click="slideToAnchor1(item)" class="catalogue p1 pd-top-5 text-center" style="color: #338ce6;" v-if="item.level == 1">{{item.mark+1}}  {{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p2 pd-top-5 text-center" v-else-if="item.level == 2">&nbsp;{{item.value}}</a>
                        <a @click="slideToAnchor1(item)" class="catalogue p3 pd-top-5 text-center" v-else-if="item.level == 3">{{item.value}}</a>
                    </li>
                </ul>
            </div>
            <!-- 词条详情 -->
            <div style="display: flex"  class="mg-top-20" id="content">
                <div class="ck-content" style="width: 100%;padding: 20px 0">
                    <template v-for="item,index in wikiContent.entryContentVos">
                        <div >
                            <h2 :id="item.id" v-if="item.contentTitle!==null&&item.contentTitle!=='null'">{{item.contentTitle}}</h2>
<!--                            <h2 class="shadow" :id="item.id" v-if="item.contentTitle!==null&&item.contentTitle!=='null'"><span style="color: #338ce6;font-family: fantasy;font-size: 40px;height: 40px;vertical-align: middle;">{{index+1}}</span><span class="block">{{item.contentTitle}}</span></h2>-->
                            <div v-html="item.contentBody" v-if="item.contentBody !== '<p>null</p>'&&item.contentBody !== null&&item.contentBody !== 'null'"></div>
                            <!-- <div v-else><p>&nbsp;</p></div> -->
                            <template v-if="item.children.length" v-for="key in item.children">
                                <div>
                                    <h3 :id="key.id" v-if="key.contentTitle!==null&&key.contentTitle!=='null'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{key.contentTitle}}</h3>
                                    <div v-html="key.contentBody" v-if="key.contentBody !== '<p>null</p>'&&key.contentBody !== null&&key.contentBody !== 'null'"></div>
                                    <div v-else><p>&nbsp;</p></div>
                                </div>
                                <template v-if="key.children.length" v-for="v in key.children">
                                    <div>
                                        <h4 :id="v.id" v-if="v.contentTitle!==null&&v.contentTitle!=='null'">&nbsp;&nbsp;&nbsp;&nbsp;{{v.contentTitle}}</h4>
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
                        <p style="line-height: 1.5;font-size: 26px;">
                            {{index+1}}.<a class="quote-btn" @click="goLink(item.referrenceUrl)">{{item.referrenceTitle}}</a>
                        </p>
                    </template>
                </div>
            </div>
            <!-- 标签 -->
            <div class="mg-top-20">
                <h3 id="tag">标签</h3>
                <div v-if="wikiContent.entryLabels.length" >
                    <template v-for="(item) in wikiContent.entryLabels">
                        <el-tag @click="chooseTag(item)" :class="item.choosed?'el-tag-active':''">{{item.labelName}}</el-tag>
                    </template>'
                </div>
                <template v-else>
                    <span style="color: #999;">该词条暂时还没有添加标签哦~</span>
                </template>
            </div>
        </div>
        <div >
            <div class="box-card">
                <el-card v-show="auditShow">
                    <div class="card-title">
                        <span >审核操作</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <div  class="audit-box">
                        <el-button type="primary" style="background: #6b9cec" size="small" @click="modalShow = true; code = '3'">审核通过</el-button>
                        <el-button type="danger" size="small" @click="modalShow = true; code = '4'">审核不通过</el-button>
                    </div>
                </el-card>
                <el-card style="margin-top: 20px">
                    <div class="card-title">
                        <span >词条统计</span>
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <p class="pd-left-10">创建者：{{wikiInfo.creator}}</p>
                    <p class="pd-left-10">编辑次数：{{wikiInfo.versionApprovingCount}}次<a style="color:#338ce6;cursor:pointer;margin-left: 10px;" @click="toHistoryList(wikiInfo.id)">历史版本</a></p>
                    <p class="pd-left-10" v-if="wikiContent.entryVersion">最近更新：{{new Date(wikiContent.entryVersion.updateTime).getFullYear()+'-'+(new Date(wikiContent.entryVersion.updateTime).getMonth()+1)+'-'+new Date(wikiContent.entryVersion.updateTime).getDate()}}</p>
                    <p v-if="viewType !== 'preview'" class="pd-left-10" @click="routeToEditOthersEntry()" style="color:#338ce6;cursor:pointer;">修改词条</p>
                </el-card>
                <el-card style="margin-top: 20px;padding: 20px 0;">
                	<div @click="scrollRightNav('down')" class="down-arrow-active"></div>
                    <div class="card-title">
                        <!--<span >快速导航</span>-->
                        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                    </div>
                    <div id="rightNav" class="rightNav" style="max-height: 310px;overflow-y: scroll">
                        <!--<a @click="slideToAnchor('summary')" class="catalogue pd-left-10">摘要</a>
                        <a @click="slideToAnchor('catalogue')" class="catalogue pd-left-10">目录</a>
                        <a @click="slideToAnchor('attribute')" class="catalogue pd-left-10">词条属性</a>-->
                        
                        <div v-for="(item,index) in wikiContent.entryContentVos" class="pd-left-10">
                            <a v-if="item.contentTitle&&item.contentTitle!=='null'" :class="item.choosed?'current':''" class="catalogue1 catalogue" @click="slideToAnchor1(item)"><span style="margin-right: 10px;">{{index+1}}</span>{{item.contentTitle}}</a>
                            <div v-for="(k,index1) in item.children">
                                <a :class="k.choosed?'current':''" v-if="k.contentTitle&&k.contentTitle!=='null'" class="catalogue2 catalogue" @click="slideToAnchor1(k)">
                                	<span style="margin-right: 10px;">{{index+1}}.{{index1}}</span>{{k.contentTitle}}
                                </a>
                                <a :class="v.choosed?'current':''" v-if="v.contentTitle&&v.contentTitle!=='null'" class="catalogue3 catalogue" v-for="(v,index2) in k.children" @click="slideToAnchor1(v)">
                                	<span style="margin-right: 10px;">{{index+1}}.{{index1}}.{{index2}}</span>{{v.contentTitle}}
                                </a>
                            </div>
                        </div>
                        
                        <!--<a @click="slideToAnchor('reference')" class="catalogue pd-left-10">引用</a>
                        <a @click="slideToAnchor('tag')" class="catalogue pd-left-10">标签</a>-->
                    </div>
                    <div @click="scrollRightNav('up')" class="down-arrow"></div>
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
                otherSummaries: [],
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
                viewType:'',
            }
        },
        mounted() {
        	let vm = this
        	Cetc10Auth().init(function(){
				vm.entryId = vm.$route.query.entryId
	            vm.versionId = vm.$route.query.versionId?vm.$route.query.versionId:''
	            vm.viewType = vm.$route.query.viewType
	            vm.auditShow = sessionStorage.getItem('auditShow') === 'true'
	            if(vm.viewType == 'preview') {
	                vm.$axios.post('/wiki-backend/api/entry/getByVersionId', {entryId:vm.entryId,versionId:vm.versionId})
	                    .then(res => {
	                    	vm.handleEntryDetail(res)
	                    })
	                vm.$axios.post('/wiki-backend/api/entry/info',{id: vm.entryId})
	                    .then(res => {
	                        console.log(res.data)
	                        vm.wikiInfo = res.data
	                    })
	            }else{
	                vm.$axios.post('/wiki-backend/api/entry/info',{id: vm.entryId})
	                    .then(res => {
	                        console.log(res.data)
	                        vm.wikiInfo = res.data
	                        vm.versionId = res.data.versionId
	                        vm.$axios.post('/wiki-backend/api/entry/getByVersionId', {entryId:vm.entryId,versionId:res.data.versionId})
	                            .then(res => {
	                            	vm.handleEntryDetail(res)
	                            })
	                    })
	            }
			});
        },
        updated () {
            this.$nextTick(()=>{
                let target = document.getElementById('content').getElementsByTagName('img')
                let target_parent = document.getElementById('content').getElementsByClassName('img_r')
                setTimeout(()=>{
                    for (let i = 0;i<target.length;i++){
                        if(target[i].hasAttribute('data-original')) {
                            target[i].src = baseUrlConfig.IMG_PREFIX + target[i].getAttribute('data-original')
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
        	//处理词条详情
        	handleEntryDetail(res) {
        		let vm = this
                console.log(res.data)
                vm.wikiContent = res.data
                if(vm.wikiContent.entryLabels&&vm.wikiContent.entryLabels.length){
                	vm.$set(vm.wikiContent.entryLabels[0],'choosed',true)
                }
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
//                              vm.otherSummaries.push(obj)
                    }
                })
                res.data.entryContentVos.map((item, index) => {
                    let obj1 = {
                        level: 1,
                        value: item.contentTitle,
                        id: item.id,
                        mark: index,
                        dataType:item.dataType,
                    }
                    if(obj1.value !== 'null'&&obj1.value !== null&&obj1.dataType === 1) {
                        vm.contentList.push(obj1)
                    }
                    item.children.map(k => {
                        let obj2 = {
                            level: 2,
                            value: k.contentTitle,
                            id: k.id,
                            mark: index,
                            dataType:k.dataType,
                        }
                        if(obj2.value !== 'null'&&obj2.value !== null&&obj2.dataType === 1) {
                            vm.contentList.push(obj2)
                        }
                        k.children.map(v => {
                            let obj3 = {
                                level: 3,
                                value: v.contentTitle,
                                id: v.id,
                                mark: index,
                                dataType:v.dataType,
                            }
                            if(obj3.value !== 'null'&&obj3.value !== null&&obj3.dataType === 1) {
                                vm.contentList.push(obj3)
                            }
                        })
                    })
                })
                //只显示dataType为1的内容
                var entryContentVosList = []
                res.data.entryContentVos.map(item =>{
                	if(item.dataType === 1){
                		let obj1 = JSON.parse(JSON.stringify(item))
                		obj1.children = []
	                    item.children.map(k => {
	                    	if(k.dataType === 1){
	                    		let obj2 = k
	                    		obj2.children = []
		                        obj1.children.push(obj2)
		                        k.children.map(v => {
		                        	if(v.dataType === 1){
		                        		let obj3 = v
			                            obj2.children.push(obj3)
		                        	}
		                        })
	                    	}
	                    })
	                    entryContentVosList.push(obj1)
                	}
               })
                console.log('22233',entryContentVosList)
				vm.wikiContent.entryContentVos = entryContentVosList
				//只显示dataType为1的引用
				var entryReferrencesList = []
				res.data.entryReferrences.map(item =>{
					if(item.dataType === 1){
						entryReferrencesList.push(item)
					}
				})
				vm.wikiContent.entryReferrences = entryReferrencesList
				//只显示dataType为1的属性
				var entryAttributesList = []
				res.data.entryAttributes.map(item =>{
					if(item.dataType === 1){
						entryAttributesList.push(item)
					}
				})
				vm.wikiContent.entryAttributes = entryAttributesList
				
                    
        	},
        	
            routeToEditOthersEntry () {
              let vm = this
              vm.$router.push({
                  name: 'editOthersEntry',
                  query: {
                      versionId: vm.versionId,
                      entryId: vm.entryId
                  }
              })
            },
        	chooseTag(item) {
        		this.wikiContent.entryLabels.map((item)=>{
        			this.$set(item,'choosed',false)
        		})
        		this.$set(item,'choosed',true)
        	},
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
            scrollRightNav(type) {
            	let dom = document.getElementById('rightNav')
            	switch (type){
            		case 'up':
            			dom.scrollTo(dom.scrollLeft, dom.scrollTop+100); 
            			break;
            		case 'down':
            			dom.scrollTo(dom.scrollLeft, dom.scrollTop-100); 
            			break;
            	}
            },
            slideToAnchor1 (target) {
                console.log(target)
                this.wikiContent.entryContentVos.map((item)=>{
                	this.$set(item,'choosed',false)
                	item.children.map((item1)=>{
                		this.$set(item1,'choosed',false)
                		item1.children.map((item2)=>{
                			this.$set(item2,'choosed',false)
                		})
                	})
                })
                this.$set(target,'choosed',true)
                document.getElementById(target.id).scrollIntoView({behavior: 'smooth'})
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
.ck-content /deep/  .table{
		margin-bottom: 10px;
	}
	.ck-content /deep/  .table,.ck-content /deep/  .table thead,.ck-content /deep/  .table tr,.ck-content /deep/  .table td{
		border: 1px solid #666;
	    padding: 9px 15px 7px;
	    font-size: 26px;
	    text-align: left;
	    word-wrap: break-word;
	    word-break: break-all;
	}
/deep/ .ck-content a{
	pointer-events:none;
	color: #6f727c;
	text-decoration: none;
}
h2,h3{
	font-size: 28px;
}
	.down-arrow,.down-arrow-active {
	    display :block;
	    position: relative;
	    width: 40px;
	    height: 30px;
	    position: absolute;
	    bottom: 0;
	    left: calc(50% - 20px);
	    &:hover{
	    	cursor: pointer;
	    	:after{
	    		border-color: #338ce6;
	    	}
	    }
	}
	.down-arrow-active{
		bottom: auto;
		top: 0;
	}
	
	.down-arrow::after,.down-arrow-active::after {
	    display: inline-block;
	    content: " ";
	    height: 18px;
	    width: 18px;
	    border-width: 0 3px 3px 0;
	    border-color: #999999;
	    border-style: solid;
	    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	    transform-origin: center;
	    transition: transform .3s;
	    position: absolute;
	    top: 50%;
	    right: 10px;
	    margin-top: -10px;
	    
	}
	// 加上active旋转成 上箭头
	.down-arrow-active::after {
	    transform-origin: center;
	    transform: rotate(-135deg);
	    transition: transform .3s;
	}
	/*修改样式*/
	.ck-content .table,.ck-content .table thead,.ck-content .table tr,.ck-content .table td{
		border: 1px solid #e2e5f3;
	    padding: 9px 15px 7px;
	    text-align: left;
	    word-wrap: break-word;
	    word-break: break-all;
	}
	.el-card__body{
		padding: 15px;
		background: #f6fafb;
	}
	.el-tag{
		background: #f6fafb;
		color: #909293;
		padding: 0 15px;
        margin-bottom: 15px;
		line-height: 1.5;
		height: 40px;
		margin-right: 35px;
		margin-bottom: 35px;
		font-size:26px;
		&:hover{
			cursor: pointer;
		}
	}
	.el-tag-active{
		background: #338ce6;
		color: #fff;
	}
	.ck-content,#attribute,#catalogue{
		font-size: 26px;
		color: #6f727c;
	}
	#reference,#tag{
		font-weight: normal;
	}
	
    .card-title{
        /*font-weight: bold;*/
        margin-bottom:10px;
        span{
        	color: #333333;
        }
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
        position: relative;
    }
    .block::after{
        content: '';
        display: block;
        position: absolute;
        box-shadow: -120px 0 10px 0px #bbb;
        width: 116px;
        height: 37px;
        top: -11px;
        right: -118px;
        z-index: -1;
        transform: skew(0, -11deg)
    }
    .el-card__header span{
        font-weight: bold;
    }
    .block-container{
        /*background: #eee;*/
        /*padding: 20px;*/
        border-top: 1px solid #eee;
        h6{
        	font-weight: normal;
        }
    }
    .pd-20{
        padding: 20px;
    }
    .quote-btn{
        color:  #8a8a8a;
        font-weight: normal;
        padding-right: 10px;
        cursor: pointer;
    }
    .box-card p{
        margin: 5px 0;
        font-size: 26px;
        line-height: 1.5;
    }
    .el-form-item{
        margin-bottom: 10px;
    }
    .box-card{
        position: fixed !important;
        top: 60px;
        width: 350px;
        // margin-top: 50px;
        margin-left: 50px;
    }
    .el-card{
        background: #f6fafb;
    }
    .p1{
        font-size: 26px;
        font-weight: bolder;
    }
    .p2{
        font-size: 26px;
        padding-left:10px;
    }
    .p3{
        font-size: 26px;
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
        font-weight: 500;
    }
    
    /*右侧导航样式*/
   .rightNav::-webkit-scrollbar {
        width:0px;
        height:0px;
    }
   .rightNav::-webkit-scrollbar-thumb {
        background-color:#338ce6;
        background-clip:padding-box;
        min-height:5px;
        -webkit-border-radius: 1em;
        -moz-border-radius: 1em;
        border-radius:1em;
    }
   .rightNav{
   	
   	.catalogue{
   		text-decoration: none;
	    display: block;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    padding-bottom: 4px;
	    height: 26px;
    	line-height: 1.5;
   	}
   	.catalogue1{
   		font-weight: 700;
    	color: #666;
    	padding-left: 10px;
    	font-size: 26px;
   	}
   	.catalogue2{
   		font-size: 26px;
	    padding-left: 20px;
	    color: #666;
   	}
   	.catalogue3{
   		font-size: 26px;
	    padding-left: 40px;
	    color: #666;
   	}
   	.current{
   		background: #e2eff9;
   		position: relative;
   		:before{
   			content: '';
   			width: 5px;
   			height: 20px;
   			background: #338ce6;
   			position: absolute;
   			left: 0;
   			top: 5px;
   		}
   		
   	}
   }
    
    
    
    
    
    .text-center{
        text-align: center;
    }
    .juedui_middle{
    	position: relative;
    }
    .vertical-middle{
        
        font-weight: 500;
        width: 50%;
	  	height: 16px;
	  	margin: auto;
	 	position: absolute;
	  	top: 0; left: 0; bottom: 0; right: 0;
    }
    ul li{
        line-height: 1.5;
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
    #content {
        color: #1a2237;
    }
    #content /deep/ .img_r  {
       float: right;
       text-align: center;
       display: flex;
       flex-direction: column;
       margin: 10px 30px 20px;
       box-shadow: 0 0 1px 0 #b5b5b5;
       
       strong {
           padding: 5px;
           font-weight: normal;
           color: #666666;
       }
    }
</style>