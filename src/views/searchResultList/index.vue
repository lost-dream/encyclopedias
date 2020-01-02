<template>
  <div>
    <!--非全站搜索-->
    <div v-if="!searchTotalStation" class="entryListData">
      <div
        v-for="(item, index) in entryListData"
        @click="routeToEntry(item.ENTRY_ID)"
        class="entry-cell"
        :class="index == entryListData.length - 1 ? '' : 'bd-bottom'"
      >
        <img
          style="width: 160px;height: 120px;margin-right: 20px;"
          v-if="
            item.SUMMARY.length &&
              item.SUMMARY[0].summary &&
              JSON.parse(item.SUMMARY[0].summary).img
          "
          :src="baseUrlConfig.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img"
          alt=""
        />
        <img
          style="width: 160px;height: 120px;margin-right: 20px;"
          v-else
          src="/static/image/tank.png"
        />
        <div>
          <p>{{ item.ENTRY_NAME }}</p>
          <p class="desc" v-if="item.SUMMARY.length">
            {{ JSON.parse(item.SUMMARY[0]).text }}
          </p>
          <p class="desc" v-else>暂无描述</p>
          <p class="come_from" v-if="item.come_from">{{ item.come_from }}</p>
        </div>
      </div>
    </div>

    <!--全站搜索-->
    <div v-else class="entryListData">
      <div
        v-for="(item, index) in entryListData"
        @click="routeToEntry(item.itemid)"
        class="entry-cell"
        :class="index == entryListData.length - 1 ? '' : 'bd-bottom'"
      >
        <img
          style="width: 160px;height: 120px;margin-right: 20px;"
          v-if="item.img"
          :src="baseUrlConfig.IMG_PREFIX + item.img"
          alt=""
        />
        <img
          style="width: 160px;height: 120px;margin-right: 20px;"
          v-else
          src="/static/image/tank.png"
        />
        <div>
          <p v-html="item.title"></p>
          <p class="desc" v-if="item.desc" v-html="item.desc"></p>
          <p class="desc" v-else>暂无描述</p>
          <!--<p class="come_from" v-if="item.come_from">{{item.come_from}}</p>-->
        </div>
      </div>
    </div>

    <div class="noDataRemindContent" v-if="hasLoad && !entryListData.length">
      当前搜索词暂无词条，请换一个试试
    </div>
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
import { entryList, searchTotalStationEntryList } from '@/api/onlyShowData'
export default {
  name: 'searchResultList',
  data() {
    return {
      keyword: '',
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      },
      searchTotalStation: false,
      entryListData: [],
      hasLoad: false,
      nbct: sessionStorage.getItem('nbct') // 内部词条权限
    }
  },
  created() {
    let vm = this
    Cetc10Auth().init(function() {
      vm.keyword = vm.$route.query.content
      vm.searchTotalStation = vm.$route.query.searchTotalStation ? true : false
      vm.entryList()
    })
  },
  mounted() {},
  destroyed() {},
  methods: {
    handleSizeChange(val) {
      this.pagination.page = 1
      this.pagination.limit = val
      this.entryList()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.entryList()
    },
    entryList() {
      this.hasLoad = false
      if (this.searchTotalStation) {
        //全站搜索
        searchTotalStationEntryList({
          pageNumber: this.pagination.page,
          pageSize: this.pagination.limit,
          query: this.keyword,
          nbct: this.nbct
        }).then(res => {
          res.data.records.map(item => {
            try {
              item.img = JSON.parse(item.text).img
              item.desc = JSON.parse(item.text).text
            } catch (e) {
              throw e
              item.img = ''
              item.desc = ''
            }
          })
          this.entryListData = res.data.records
          this.pagination.count = res.data.total
          this.hasLoad = true
        })
      } else {
        entryList({
          pageNumber: this.pagination.page,
          pageSize: this.pagination.limit,
          categoryId: '',
          keyword: this.keyword
        }).then(res => {
          this.entryListData = res.data.records
          this.pagination.count = res.data.total
          this.hasLoad = true
        })
      }
    },
    routeToEntry(index) {
      this.$router.push({
        name: 'viewEntry',
        query: {
          entryId: index,
          versionId: '',
          viewType: 'view'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.entryListData {
  > div {
    line-height: 36px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    img {
      width: 160px;
      height: 120px;
      margin-right: 20px;
    }
    .desc {
      line-height: 20px;
      font-weight: normal;
      font-size: 14px;
    }
    .come_from {
      margin-top: 10px;
      line-height: 20px;
      font-weight: normal;
      font-size: 12px;
      color: #61a0e8;
      text-align: right;
    }
  }
  ul,
  li,
  p {
    cursor: pointer;
  }
  .entry-cell {
    padding: 10px 0;
  }
  .bd-bottom {
    border-bottom: 1px dotted #ccc;
  }
}
</style>
