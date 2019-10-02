<template>
	<div>
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				提取任务
			</div>
			<el-form style="width: 800px;" :disabled="type==='see'" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="110px" class="demo-ruleForm">
			  <el-form-item label="任务名称：" prop="taskName">
			    <el-input style="width: 300px;" v-model="ruleForm.taskName"></el-input>
			  </el-form-item>
			  <el-form-item label="数据源：" prop="dataSourceId">
			    <el-select style="width: 300px;" v-model="ruleForm.dataSourceId" placeholder="请选择数据源">
			      <el-option label="oracle" value="1"></el-option>
			      <el-option label="达梦" value="2"></el-option>
			      <el-option label="ftp" value="3"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="时间（每天）：" prop="taskScheduleTime">
			  	<el-date-picker
			  		style="width: 300px;"
			      v-model="ruleForm.taskScheduleTime"
			      type="datetime"
			      placeholder="选择日期时间">
			   </el-date-picker>
			  </el-form-item>
			  <el-form-item label="表：" prop="tableName">
			    <el-input style="width: 700px;" v-model="ruleForm.tableName"></el-input>
			  </el-form-item>
			  <el-form-item label="列：" prop="columns">
			    <el-input style="width: 700px;" v-model="ruleForm.columns"></el-input>
			  </el-form-item>
			  
			  <el-form-item v-if="type!=='see'" style="text-align: center;margin-top: 20px;margin-left: 0;">
			  	<el-button style="background: #cccccc;color: black;border: none;margin-right: 60px;" @click="resetForm('ruleForm')">取消</el-button>
			    
			    <el-button style="background: #5b7dd7;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
			    
			  </el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import {save,info,update} from '@/api/extractTask/index.js'
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
	            { required: true, message: '请输入taskScheduleTime', trigger: 'blur' },
//	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          tableName: [
	            { required: true, message: '请选择表', trigger: 'change' }
	          ],
	          columns: [
	            { required: true, message: '请选择列', trigger: 'change' }
	          ],
	        },
	        type:'',
	        id:'',
      	}
    },
	created() {
		this.type = this.$route.query.type?this.$route.query.type:''
		this.id = this.$route.query.id?this.$route.query.id:''
		if(this.id){
			this.info()
		}
	},
	watch: {
		'ruleForm.dataSourceId':{
			handler:function(){
				let type = this.ruleForm.dataSourceId
				this.rules.serverName[0].required = false
				this.rules.filePath[0].required = false
				if(type === '1'){
					this.rules.serverName[0].required = true
				}
				if(type === '3'){
					this.rules.filePath[0].required = true
				}
			}
		}
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		info() {
			info({id:this.id}).then((res)=>{
				for(let i in this.ruleForm){
					this.ruleForm[i] = res.data[i].toString()
				}
				
			})
		},
		submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.id?this.update():this.save()
          } else {
            return false;
          }
        });
      },
      update() {
      	var obj = this.ruleForm
      	obj.id = this.id
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
      	save(this.ruleForm).then((res)=>{
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
      }
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