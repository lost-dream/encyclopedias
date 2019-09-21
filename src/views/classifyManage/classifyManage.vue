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
		return {
			
		}
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
			categoryAttributeTemplate({
				pageNumber:1,
				pageSize:10
			}).then(res =>{
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