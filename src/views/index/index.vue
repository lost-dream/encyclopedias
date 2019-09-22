<template>
	<div>
		<p>首页</p>
		<div id="entryStatisticalData">
			<p>
				<img src="../../assets/index/01.png"/>
				<span class="data">{{entryStatisticalData.totalEntry}}</span>
				<span>个词条</span>
			</p>
			<p>
				<img src="../../assets/index/02.png"/>
				<span class="data">{{entryStatisticalData.totalEntryEitor}}</span>
				<span>次编辑</span>
			</p>
			<p>
				<img src="../../assets/index/03.png"/>
				<span class="data">{{entryStatisticalData.totalEditor}}</span>
				<span>人编写</span>
			</p>
		</div>
	</div>
</template>

<script>
import {entryStatistical,} from '@/api/onlyShowData/index.js'
export default {
	
	name: 'index',
	data() {
	    return {
	    	entryStatisticalData:{}
	    }
	},
	watch: {
		
	},
	created() {
		this.entryStatistical()
	},
	mounted() {
	},
	destroyed() {
		
	},
	methods: {
		entryStatistical() {
			entryStatistical({}).then((res)=>{
				this.entryStatisticalData = res.data
				//计算最大数据的宽度
//				var max = Math.max()
				
			})
		},
		
	}

}
</script>

<style lang="scss" scoped>
#entryStatisticalData{
	color: #338ce6;
	font-size: 15px;
	img{
		vertical-align: sub;
	}
	p{
		line-height: 35px;
		.data{
			font-size: 30px;
			text-align: right;
			display: inline-block;
		}
		span:last-child{
			margin-left: 20px;
		}
	}
}
	
</style>