<template>
	<div>
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				提取任务
			</div>
			<el-form :disabled="type==='see'" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="200px" class="demo-ruleForm">
			  <el-form-item label="任务名称：" prop="taskName">
			    <el-input style="width: 300px;" v-model="ruleForm.taskName"></el-input>
			  </el-form-item>
			  <el-form-item label="数据源：" prop="dataSourceId">
			    <el-select style="width: 300px;" v-model="ruleForm.dataSourceId" placeholder="请选择数据源">
			    	<el-option :label="item.dataSourceName" :value="item.id" v-for="(item, index) in dataSourceList" :key="index"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item style="display: inline-block;width: 50%;vertical-align: top;" label="时间（每天）：" prop="taskScheduleTime">
			  	
			   <el-time-select
			   		style="width: 300px;"
			      v-model="ruleForm.taskScheduleTime"
				  :picker-options="{
				    start: '00:00',
				    step: '01:00',
				    end: '23:00'
				  }"
				  placeholder="选择时间">
				</el-time-select>
			  </el-form-item>
			  
			  <!--<el-form-item v-if="type!=='see'" style="margin-left: -110px;display: inline-block;width: 50%;vertical-align: top;">
			  	<el-button style="background: #cccccc !important;color: black;border: none;margin-right: 60px;margin-left: 0;" @click="resetForm('ruleForm')">取消</el-button>
			    
			    <el-button style="background: #5b7dd7 !important;color: white;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
			    
			  </el-form-item>-->
			  
			  
			  <el-form-item></el-form-item>
			  
			  <el-form-item label-width="80px" v-show="rules.tableName[0].required" style="display: inline-block;width: 50%;vertical-align: top;" label="表：" prop="tableName">
			  	<el-radio style="display: block;margin: 0;" v-for="(item, index) in tableNameList" :key="index" v-model="ruleForm.tableName" :label="item" border>{{item}}</el-radio>
			  </el-form-item>
			  <el-form-item label-width="50px" v-show="rules.columns[0].required" style="display: inline-block;width: 50%;vertical-align: top;" label="列：" prop="columns">
			    <el-radio style="display: block;margin: 0;" v-for="(item, index) in columnNameList" :key="index" v-model="ruleForm.columns" :label="item" border>{{item}}</el-radio>
			  </el-form-item>
			  
			  <!--<el-form-item v-if="type!=='see'" style="text-align: center;margin-top: 20px;margin-left: 0;">
			  	<el-button style="background: #cccccc;color: black;border: none;margin-right: 60px;" @click="resetForm('ruleForm')">取消</el-button>
			    
			    <el-button style="background: #5b7dd7;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
			    
			  </el-form-item>-->
			  
			  
			  <el-form-item v-if="type!=='see'" style="text-align: center;">
			  	<el-button style="background: #cccccc !important;color: black;border: none;margin-right: 60px;margin-left: 0;" @click="resetForm('ruleForm')">取消</el-button>
			    
			    <el-button style="background: #5b7dd7 !important;color: white;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
			    
			  </el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import {save,info,update} from '@/api/extractTask/index.js'
import {allList,getTableNames,getColumnNames} from '@/api/dataSource/index.js'
import {parseTime} from '@/utils/commonMethod.js'
export default {
	name: 'extractTaskManager',
	data() {
	    return {
	    	ruleForm: {
	          taskName: '',
	          dataSourceId: '',
	          taskScheduleTime: '',
	          tableName: '',
	          columns: '',
	        },
	        rules: {
	          taskName: [
	            { required: true, message: '请输入任务名称', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          dataSourceId: [
	            { required: true, message: '请选择数据源', trigger: 'change' }
	          ],
	          taskScheduleTime: [
	            { required: true, message: '请输入时间', trigger: 'blur' },
//	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          tableName: [
	            { required: false, message: '请选择表', trigger: 'change' }
	          ],
	          columns: [
	            { required: false, message: '请选择列', trigger: 'change' }
	          ],
	        },
	        dataSourceList:[],
	        type:'',
	        id:'',
	        tableNameList:[],
	        columnNameList:[],
	        isModifyFirst:false,
      	}
    },
	created() {
		this.allList()
		this.type = this.$route.query.type?this.$route.query.type:''
		this.id = this.$route.query.id?this.$route.query.id:''
		
	},
	watch: {
		'ruleForm.dataSourceId':{
			handler:function(){
				if(!this.isModifyFirst){
					this.ruleForm.tableName = ''
					this.ruleForm.columns = ''
				}
				let type = ''
				this.rules.tableName[0].required = false
				this.rules.columns[0].required = false
				this.dataSourceList.map((item)=>{
					if(item.id === this.ruleForm.dataSourceId){
						type = item.dataSourceType
					}
				})
				if(type === 1 || type === 2){
					this.rules.tableName[0].required = true
					this.rules.columns[0].required = true
					this.getTableNames()
				}
				
			}
		},
		'ruleForm.tableName':{
			handler:function(){
				if(!this.isModifyFirst){
					this.ruleForm.columns = ''
				}
				this.isModifyFirst = false
				this.columnNameList = []
				if(this.ruleForm.tableName){
					this.getColumnNames()
				}
			}
		}
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		getTableNames() {
			getTableNames({'id':this.ruleForm.dataSourceId}).then((res)=>{
				this.tableNameList = res.data
				if(this.ruleForm.tableName){
					this.getColumnNames()
				}
			})
		},
		getColumnNames() {
			getColumnNames({
				'id':this.ruleForm.dataSourceId,
				'tableName':this.ruleForm.tableName
			}).then((res)=>{
				this.columnNameList = res.data
			})
		},
		info() {
			info({id:this.id}).then((res)=>{
				for(let i in this.ruleForm){
					res.data[i]!==null?this.ruleForm[i] = res.data[i].toString():''
				}
				let time = this.ruleForm.taskScheduleTime
				if(time.length === 1){
					time = '0'+time
				}
				time += ':00'
				this.ruleForm.taskScheduleTime = time
			})
		},
		submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.id?this.update():this.save()
          } else {
          	console.log(valid)
          	this.$message({
	          message: '请完善任务信息',
	          type: 'success'
	       	});
            return false;
          }
        });
      },
      update() {
      	var obj = JSON.parse(JSON.stringify(this.ruleForm))
      	obj.id = this.id
      	obj.taskScheduleTime = obj.taskScheduleTime.split(':')[0]
      	if(obj.taskScheduleTime.charAt(0) === '0'){
      		obj.taskScheduleTime = obj.taskScheduleTime.slice(1)
      	}
      	update(obj).then((res)=>{
      		this.$message({
	          message: '提取任务修改成功！',
	          type: 'success'
	       	});
	        this.$router.push({
				name:'extractTask'
			})
      	})
      },
      save() {
      	var obj = JSON.parse(JSON.stringify(this.ruleForm))
      	obj.id = this.id
      	obj.taskScheduleTime = obj.taskScheduleTime.split(':')[0]
      	if(obj.taskScheduleTime.charAt(0) === '0'){
      		obj.taskScheduleTime = obj.taskScheduleTime.slice(1)
      	}
      	save(obj).then((res)=>{
      		this.$message({
	          message: '提取任务保存成功！',
	          type: 'success'
	       	});
	        this.resetForm('ruleForm')
      	})
      },
      resetForm(formName) {
      	this.$router.push({
			name:'extractTask'
		})
      	if(this.type === 'modify'){
      		this.info()
      	}
      	else{
      		this.$refs[formName].resetFields();
      	}
      },
      allList() {
			allList({}).then(res =>{
				this.dataSourceList = res.data
				if(this.id){
					this.isModifyFirst = true
					this.info()
				}
			})
	        .catch(res=>{
	        	console.log(res)
	        })
		},
	}
}
</script>

<style lang="scss" scoped>



.leftBorder{
	display: inline-block;
	vertical-align: middle;
	background: #5d7cd8;
	width: 5px;
	height: 20px;
	margin-right: 15px;
}
</style>