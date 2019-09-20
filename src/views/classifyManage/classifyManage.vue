<template>
	<div>
		<p>属性模板管理</p>
		
	</div>
</template>

<script>
import {categoryAttributeTemplate} from '@/api/classifyManager/index.js'
export default {
	name: 'classifyManage',
	data() {
		
	},
	watch: {
		
	},
	created() {
		this.getList()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		getList() {
			console.log(11111)
			categoryAttributeTemplate({
				pageNumber:1,
				pageSize:10
			}).then(res =>{
                // 注册成功
                alert('注册成功!')
                this.$router.push('/login')
                console.log(res)
            })
            .catch(res=>{
            	console.log(res)
            })
		},
		
	}
}
</script>

<style>
</style>