<template>
	<div>
		<el-card class="myForm" shadow="hover">
			<div style="font-weight: bold;font-size: 20px;" slot="header" class="clearfix">
				<span class="leftBorder"></span>
				数据源
			</div>
			<el-form style="width: 800px;" :disabled="type==='see'" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="200px" class="demo-ruleForm">
			  <el-form-item label="数据源名称：" prop="dataSourceName">
			    <el-input style="width: 300px;" v-model="ruleForm.dataSourceName"></el-input>
			  </el-form-item>
			  <el-form-item label="数据源类别：" prop="dataSourceType">
			    <el-select style="width: 300px;" v-model="ruleForm.dataSourceType" placeholder="请选择数据源类别">
			      <el-option label="oracle" value="1"></el-option>
			      <el-option label="达梦" value="2"></el-option>
			      <el-option label="ftp" value="3"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="host：" prop="host">
			    <el-input style="width: 700px;" v-model="ruleForm.host"></el-input>
			  </el-form-item>
			  <el-form-item label="端口号：" prop="port">
			    <el-input style="width: 700px;" v-model="ruleForm.port"></el-input>
			  </el-form-item>
			  <el-form-item label="用户名：" prop="userName">
			    <el-input style="width: 700px;" v-model="ruleForm.userName"></el-input>
			  </el-form-item>
			  <el-form-item label="密码：" prop="password">
			    <el-input style="width: 700px;" v-model="ruleForm.password"></el-input>
			  </el-form-item>
			  <el-form-item label="服务名：" prop="serverName">
			    <el-input style="width: 700px;" v-model="ruleForm.serverName"></el-input>
			  </el-form-item>
			  <el-form-item label="文件路径：" prop="filePath">
			    <el-input style="width: 700px;" v-model="ruleForm.filePath"></el-input>
			  </el-form-item>
			  <el-form-item v-if="type!=='see'" style="text-align: center;margin-top: 20px;margin-left: 0;">
			  	<el-button style="background: #cccccc !important;color: black;border: none;margin-right: 60px;" @click="resetForm('ruleForm')">取消</el-button>
			    
			    <el-button style="background: #5b7dd7 !important;color: white;" type="primary" @click="submitForm('ruleForm')">保存</el-button>
			    
			  </el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import {save,update,info} from '@/api/dataSource/index.js'
export default {
	name: 'dataSourceManager',
	data() {
	    return {
	    	ruleForm: {
	          dataSourceName: '',
	          dataSourceType: '',
	          host: '',
	          port: '',
	          userName: '',
	          password: '',
	          serverName: '',
	          filePath:''
	        },
	        rules: {
	          dataSourceName: [
	            { required: true, message: '请输入数据源名称', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          dataSourceType: [
	            { required: true, message: '请选择数据源类别', trigger: 'change' }
	          ],
	          host: [
	            { required: true, message: '请输入host', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          port: [
	            { required: true, message: '请输入端口号', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          userName: [
	            { required: true, message: '请输入用户名', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          password: [
	            { required: true, message: '请输入密码', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          serverName: [
	            { required: false, message: '请输入服务名', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
	          ],
	          filePath: [
	            { required: false, message: '请输入文件路径', trigger: 'blur' },
	            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
		'ruleForm.dataSourceType':{
			handler:function(){
				let type = this.ruleForm.dataSourceType
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
					this.ruleForm[i] = res.data[i]!==null?res.data[i].toString():''
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
	          message: '数据源修改成功！',
	          type: 'success'
	       	});
	        this.$router.push({
				name:'dataSourceList'
			})
      	})
      },
      save() {
      	save(this.ruleForm).then((res)=>{
      		this.$message({
	          message: '数据源保存成功！',
	          type: 'success'
	       	});
	        this.resetForm('ruleForm')
      	})
      },
      resetForm(formName) {
      	this.$router.push({
			name:'dataSourceList'
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