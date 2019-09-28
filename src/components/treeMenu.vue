<template>
	<div>
		<ul class="nav">
			<li :class="item.status?'choosed':''" class="dropdown" @mouseout="hideSecondCategory(item)" @mouseover="showSecondCategory(item)" v-for="(item,index) in list" :key="index">
				<a @click.stop="clickFirstCategory(item,list)">{{item.name}}</a>
				<ul class="dropdown-menu" v-show="item.show">
					<li :class="item1.status?'choosed':''" class="dropdown-submenu" @mouseout="hideThirdCategory(item1)" @mouseover="showThirdCategory(item1)" v-for="(item1,index1) in item.children">
						<a @click.stop="clickSecondCategory(item1,item,index,list)">{{item1.name}}</a>
						<ul class="dropdown-menu" v-show="item1.show">
							<li :class="item2.status?'choosed':''" class="dropdown-submenu" v-for="(item2,index2) in item1.children">
								<a @click.stop="clickThirdCategory(item2,item1,index1,index,list)">{{item2.name}}</a>
							</li>
						</ul>
					</li>
				</ul>
				
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
    list: {
      type: Array,
      default: []
    }
 },
  data () {
    return {
    	categoryTreeList: [],
    }
  },
  watch: {
  	
  },
  created() {
  	
  },
  mounted() {},
  beforeRouteLeave(to,from,next) {},
  
  methods: {
  	//清空status
  	clearStatus(list) {
  		list.map((item)=>{
  			item.status = false
  			item.children.map((item1)=>{
  				item1.status = false
  				item1.children.map((item2)=>{
  					item2.status = false
  				})
  			})
  		})
  	},
  	
  	clickFirstCategory(item,list) {
  		this.clearStatus(list)
  		item.status = true
  		this.$emit('parentMethod',item);
  	},
  	clickSecondCategory(item,parentItem,index,list) {
  		this.clearStatus(list)
  		item.status = true
  		this.hideSecondCategory(parentItem)
  		this.$emit('parentMethod',item,parentItem);
  	},
  	clickThirdCategory(item,parentItem,index1,index,list) {
  		this.clearStatus(list)
  		item.status = true
  		this.hideThirdCategory(parentItem)
  		this.$emit('parentMethod',item,parentItem);
  	},
  	showSecondCategory(item) {
  		this.$set(item,'show',true)
  	},
  	hideSecondCategory(item) {
  		this.$set(item,'show',false)
  	},
  	showThirdCategory(item) {
  		this.$set(item,'show',true)
  	},
  	hideThirdCategory(item) {
  		this.$set(item,'show',false)
  	},
  	
  },
}
</script>

<style lang="scss" scoped>
.choosed{
	background-color: #298CF1 !important;
}

 
ul.nav>li {
    float: left;
    display: block;
    position: relative;
    background-color: #459DF6;
    min-width: 160px;
}
 
ul.nav li:hover {
    background-color: #298CF1;
}
 
.nav>li>a {
    position: relative;
    padding: 10px 15px;
    display: block;
    color: white;
    text-align: center;
}
 
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    text-align: left;
    background-color: #98C8F9;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
}
 
a {
    text-decoration: none;
    background-color: transparent;
    color: #337ab7;
}
 
.dropdown-menu>li>a {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: 400;
    line-height: 1.42857143;
    color: white;
    white-space: nowrap;
}
 
.dropdown-submenu {
    position: relative;
}
 
.dropdown-submenu>.dropdown-menu {
    top: 0;
    left: 100%;
    border-left: 1px solid white;
}
.dropdown:hover>.dropdown-menu {
    display: block;
}
 
.dropdown-submenu:hover>.dropdown-menu {
    display: block;
}
.dropdown-submenu:hover>a:after {
    border-left-color: #aaa;
}
</style>