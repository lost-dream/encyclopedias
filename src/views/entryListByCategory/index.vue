<template>
  <div style="margin-bottom: 20px">
    <ul class="categoryList">
      <li
        :class="item.choosed ? 'highlight' : ''"
        @click="choose(item)"
        v-for="item in categoryList"
      >
        <p>
          {{ item.name
          }}<span style="font-size: 26px;vertical-align: top;" v-if="hasFinishAjax && item.choosed"
            >({{ pagination.count }})</span
          >
        </p>
      </li>
    </ul>
    <ul class="entryList">
      <li @click="seeEntry(item)" v-for="item in entryListData">
        <img
          v-if="item.SUMMARY.length && item.SUMMARY[0].summary && item.img"
          :src="baseUrlConfig.IMG_PREFIX + item.img"
          alt=""
        />
        <img v-else src="/static/image/tank.png" />
        <div>
          <p class="entry-title">{{ item.ENTRY_NAME }}</p>
          <div v-if="item.SUMMARY.length && item.SUMMARY[0].summary">{{ item.text }}</div>
        </div>
      </li>
    </ul>
    <div class="noDataRemindContent" v-if="entryListData.length === 0">当前分类暂无词条</div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page"
      :page-size="pagination.limit"
      layout="total, sizes, prev, pager, next"
      :total="pagination.count"
    ></el-pagination>
  </div>
</template>

<script>
import { entryList } from '@/api/onlyShowData/index.js'
import { categoryTree } from '@/api/classifyManager/index.js'
export default {
  name: 'entryListByCategory',
  data() {
    return {
      entryListData: [],
      categoryList: [],
      categoryTreeList: [],
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      },
      categoryId: '',
      hasFinishAjax: false
    }
  },
  watch: {
    categoryId() {
      this.pagination.page = 1
      this.list()
    }
  },
  created() {
    let vm = this
    Cetc10Auth().init(function() {
      // vm.getChoosedCategoryInfo()
      vm.categoryTree()
    })
  },
  mounted() {},
  destroyed() {},
  methods: {
    seeEntry(hash) {
      console.log(hash)
      this.$router.push({
        name: 'viewEntry',
        query: {
          entryId: hash.ENTRY_ID,
          //                    versionId: hash.ID,
          viewType: 'view'
        }
      })
    },
    choose(item) {
      console.log(item.id)
      this.categoryList.map(item => {
        item.choosed = false
      })
      item.choosed = true
      this.categoryId = item.id
    },
    routeToEntry(id) {
      this.$router.push({
        name: 'entryDetail',
        params: { id: id }
      })
    },
    handleSizeChange(val) {
      this.pagination.page = 1
      this.pagination.limit = val
      this.list()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.list()
    },
    //根据分类id获取词条列表
    list(item) {
      this.hasFinishAjax = false
      entryList({
        pageNumber: this.pagination.page,
        pageSize: this.pagination.limit,
        categoryIds: this.categoryId,
        keyword: ''
      }).then(res => {
        this.hasFinishAjax = true
        console.log(res.data)
        if (res.data.records) {
          res.data.records.map(item => {
            try {
              item.text = JSON.parse(item.SUMMARY[0].summary).text
              item.img = JSON.parse(item.SUMMARY[0].summary).img
            } catch (e) {
              //TODO handle the exception
            }
          })
          this.entryListData = res.data.records
        } else {
          this.entryListData = []
        }
        this.pagination.count = res.data.total
      })
    },
    categoryTree() {
      categoryTree({})
        .then(res => {
          res.data.children.map(item => {
            item.children.map((item1, index) => {
              item1.showThirdCategory = index === 0
            })
          })
          this.categoryTreeList = res.data.children
          this.getChoosedCategoryInfo()
        })
        .catch(e => {
          console.log(e)
        })
    },
    //根据本地存储的首页传参高亮显示首页选中的分类
    getChoosedCategoryInfo() {
      try {
        var obj = JSON.parse(sessionStorage.getItem('choosedCategoryInfo'))
        this.categoryTreeList.forEach(item => {
          if (item.id === obj.thirdAry[obj.index2].parentId) {
            this.categoryList = item.children
          }
        })
        this.categoryList.map(item => {
          item.choosed = item.id === obj.id2
          this.categoryId = obj.id2
        })
      } catch (e) {
        //TODO handle the exception
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.entryList {
  width: 1210px;
  margin: auto;
  margin-top: 20px;
  li {
    display: inline-block;
    vertical-align: top;
    width: 380px;
    height: 430px;
    background: #f6fafb;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    line-height: 25px;
    margin-right: 30px;
    margin-bottom: 30px;
    font-size: 26px;
    color: #666666;

    &:nth-child(3n + 3) {
      margin-right: 0;
    }
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
    img {
      width: 100%;
      height: 120px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .entry-title {
      line-height: 45px;
      font-weight: bold;
      font-size: 28px;
      color: black;
      text-align: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    div {
      font-size: 26px;
      padding: 0 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 8;
      overflow: hidden;
    }
  }
}

.highlight {
  color: #338ce6;
}
.el-pagination {
  text-align: center;
}
.noDataRemindContent {
  text-align: center;
  padding: 20px 0;
}
.categoryList {
  font-size: 26px;
  color: #7b7d7f;
  background: #eaf4fe;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 20px;
  li {
    display: inline-block;
    margin: 0;
    line-height: 40px;
    text-align: center;
    padding: 5px 0;
    border-bottom: 1px solid white;
    p {
      padding: 0 20px;
      border-right: 1px solid white;
      cursor: pointer;
    }
    p:hover {
      color: #338ce6;
    }
  }
}
</style>
