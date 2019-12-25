<template>
  <div class="main-page">
    <div class="w1340">
      <div class="title">
        <span>最新词条</span>
      </div>
      <el-row>
        <el-col class="w800">
          <el-carousel
            :interval="5000"
            height="460px"
            id="index-carousel"
            style="height: 460px;overflow: hidden"
            v-loading="!entryListData.length"
          >
            <el-carousel-item
              v-for="(key, i) in entryListData"
              :key="i"
              style="display: flex"
            >
              <div v-for="(item, k) in key" :key="k">
                <!--								{{item}}-->
                <div @click="seeEntry(item)" class="entryList ">
                  <el-image
                    class="carousel-image"
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    :src="
                      baseUrlConfig.IMG_PREFIX +
                        JSON.parse(item.SUMMARY[0].summary).img
                    "
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <!--									<img v-if="item.SUMMARY.length&&item.SUMMARY[0].summary" :src="baseUrlConfig.IMG_PREFIX + JSON.parse(item.SUMMARY[0].summary).img" alt="" />-->
                  <!--<img src="/static/image/tank.png"/>-->
                  <div>
                    <p class="entry-title ellipsis1">{{ item.ENTRY_NAME }}</p>
                    <div
                      v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                      class="ellipsis3"
                    >
                      {{ JSON.parse(item.SUMMARY[0].summary).text }}
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col class="w480">
          <div id="entryStatisticalData">
            <div class="left">
              <div>
                <p>
                  <img src="../../assets/index/01.png" />
                  <span class="data">{{
                    toThousands(entryStatisticalData.totalEntry)
                  }}</span>
                  <span>个词条</span>
                </p>
              </div>
              <div>
                <p>
                  <img src="../../assets/index/02.png" alt="" />
                  <span class="data">{{
                    toThousands(entryStatisticalData.totalEntryEitor)
                  }}</span>
                  <!--<span class="data">0</span>-->
                  <span>个词条被编辑</span>
                </p>
              </div>
              <!--<div>
							<p>
								<img src="../../assets/index/03.png"/>
								<span class="data">{{toThousands(entryStatisticalData.totalEditor)}}</span>
								<span>编辑/次</span>
							</p>
						</div>-->
            </div>

            <div class="rightBtnArea">
              <el-button type="primary" @click="gotoCreate">创建词条</el-button>
              <el-button type="danger" @click="gotoMyEntry">我的词条</el-button>
              <el-button type="danger" @click="gotoManager">后台管理</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="w1280">
      <div class="title" style="margin-top: 25px">
        <span>特色专题</span>
      </div>
      <el-carousel
        :interval="5000000"
        type="card"
        height="500px"
        id="special-carousel"
        v-loading="!specialListData.length"
      >
        <el-carousel-item v-for="item in specialListData" :key="item.id">
          <div @click="routeToSpecial(item.id)" class="specialList">
            <!--<img :src="item.specialCoverUrl" alt="" />-->
            <el-image :fit="'cover'" :src="item.specialCoverUrl">
              <div slot="error" class="image-slot">
                <img src="/static/image/tank.png" alt="" />
              </div>
            </el-image>
            <div>
              <p>{{ item.specialName }}</p>
              <div>{{ item.specialDesc }}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="background: #EBF3F6;margin-top: 30px;min-height: 560px">
      <div class="w1280">
        <div class="bgf6fafb">
          <div class="title">
            <span>词条分类</span>
          </div>
          <div
            class="category-container"
            style="margin: 0;min-height: 441px"
            v-loading="loading"
          >
            <p class="categoryOrigin">
              <i class="el-icon-caret-bottom el-icon--left"></i>外部词条
            </p>
            <br />
            <div style="padding-bottom: 25px;">
              <div
                class="category-item"
                v-for="(item, index) in categoryTreeList"
                :key="index"
              >
                <div class="categoryTreeList">
                  <p style="color: #333333;text-align: left">{{ item.name }}</p>
                  <!--现在的渲染方式，均分为三个ul-->
                  <div class="ul">
                    <ul v-for="(item0, i) in item.child" :key="i">
                      <li
                        v-for="(item1, index1) in item0"
                        class="secondCategory"
                        :key="index1"
                        @click="
                          routeToEntryList(item1.id, index1, item.children)
                        "
                      >
                        {{ item1.name }}
                      </li>
                    </ul>
                  </div>
                  <!--原来的渲染方式，全部分类放在一起-->
                  <!--<ul class="ul">
										<li @click="routeToEntryList(item1.id,index1,item.children)" class="secondCategory" v-for="(item1,index1) in item.children">
											{{item1.name}}
										</li>
									</ul>-->
                </div>
              </div>
            </div>

            <p class="categoryOrigin">
              <i class="el-icon-caret-bottom el-icon--left"></i>内部词条
            </p>
            <br />
            <div style="padding-bottom: 25px;">
              <div
                class="category-item"
                v-for="(item, index) in categoryTreeList"
                :key="index"
              >
                <div class="categoryTreeList">
                  <p style="color: #333333;text-align: left">{{ item.name }}</p>
                  <!--现在的渲染方式，均分为三个ul-->
                  <div class="ul">
                    <ul v-for="(item0, i) in item.child" :key="i">
                      <li
                        v-for="(item1, index1) in item0"
                        :key="index1"
                        class="secondCategory"
                        @click="
                          routeToEntryList(item1.id, index1, item.children)
                        "
                      >
                        {{ item1.name }}
                      </li>
                    </ul>
                  </div>
                  <!--原来的渲染方式，全部分类放在一起-->
                  <!--<ul class="ul">
										<li @click="routeToEntryList(item1.id,index1,item.children)" class="secondCategory" v-for="(item1,index1) in item.children">
											{{item1.name}}
										</li>
									</ul>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w1280">
      <div class="title">
        <span>分类推荐</span>
      </div>
      <template>
        <el-tabs
          tab-position="left"
          v-model="activeName"
          @tab-click="handleClick"
          v-loading="panelLoading"
        >
          <el-tab-pane label="科技" name="6">
            <div
              style="display: flex;flex-wrap: wrap"
              v-if="categoryList.length"
            >
              <div
                v-for="(item, i) in categoryList"
                :key="i"
                class="categoryListItem"
                style="width: 45%;display: flex;padding: 10px;"
                @click="seeEntry(item)"
              >
                <el-image
                  class="cat-img"
                  v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                  :src="
                    baseUrlConfig.IMG_PREFIX +
                      JSON.parse(item.SUMMARY[0].summary).img
                  "
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!--<img src="/static/image/tank.png"/>-->
                <div class="text-desc">
                  <p class="entry-title">
                    <span>{{ item.ENTRY_NAME }}</span>
                  </p>
                  <div
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    class="ellipsis3"
                  >
                    {{ JSON.parse(item.SUMMARY[0].summary).text }}
                  </div>
                </div>
              </div>
            </div>
            <p class="noData" v-else>当前分类暂无词条</p>
          </el-tab-pane>
          <el-tab-pane label="经济" name="5">
            <div
              style="display: flex;flex-wrap: wrap"
              v-if="categoryList.length"
            >
              <div
                v-for="(item, i) in categoryList"
                :key="i"
                class="categoryListItem"
                style="width: 45%;display: flex;padding: 10px;"
                @click="seeEntry(item)"
              >
                <el-image
                  class="cat-img"
                  v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                  :src="
                    baseUrlConfig.IMG_PREFIX +
                      JSON.parse(item.SUMMARY[0].summary).img
                  "
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!--<img src="/static/image/tank.png"/>-->
                <div class="text-desc">
                  <p class="entry-title">
                    <span>{{ item.ENTRY_NAME }}</span>
                  </p>
                  <div
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    class="ellipsis3"
                  >
                    {{ JSON.parse(item.SUMMARY[0].summary).text }}
                  </div>
                </div>
              </div>
            </div>
            <p class="noData" v-else>当前分类暂无词条</p>
          </el-tab-pane>
          <el-tab-pane label="安全" name="4">
            <div
              style="display: flex;flex-wrap: wrap"
              v-if="categoryList.length"
            >
              <div
                v-for="(item, i) in categoryList"
                :key="i"
                class="categoryListItem"
                style="width: 45%;display: flex;padding: 10px;"
                @click="seeEntry(item)"
              >
                <el-image
                  class="cat-img"
                  v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                  :src="
                    baseUrlConfig.IMG_PREFIX +
                      JSON.parse(item.SUMMARY[0].summary).img
                  "
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!--<img src="/static/image/tank.png"/>-->
                <div class="text-desc">
                  <p class="entry-title">
                    <span>{{ item.ENTRY_NAME }}</span>
                  </p>
                  <div
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    class="ellipsis3"
                  >
                    {{ JSON.parse(item.SUMMARY[0].summary).text }}
                  </div>
                </div>
              </div>
            </div>
            <p class="noData" v-else>当前分类暂无词条</p>
          </el-tab-pane>
          <el-tab-pane label="外交" name="3">
            <div
              style="display: flex;flex-wrap: wrap"
              v-if="categoryList.length"
            >
              <div
                v-for="(item, i) in categoryList"
                :key="i"
                class="categoryListItem"
                style="width: 45%;display: flex;padding: 10px;"
                @click="seeEntry(item)"
              >
                <el-image
                  class="cat-img"
                  v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                  :src="
                    baseUrlConfig.IMG_PREFIX +
                      JSON.parse(item.SUMMARY[0].summary).img
                  "
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!--<img src="/static/image/tank.png"/>-->
                <div class="text-desc">
                  <p class="entry-title">
                    <span>{{ item.ENTRY_NAME }}</span>
                  </p>
                  <div
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    class="ellipsis3"
                  >
                    {{ JSON.parse(item.SUMMARY[0].summary).text }}
                  </div>
                </div>
              </div>
            </div>
            <p class="noData" v-else>当前分类暂无词条</p>
          </el-tab-pane>
          <el-tab-pane label="军事" name="2">
            <div
              style="display: flex;flex-wrap: wrap"
              v-if="categoryList.length"
            >
              <div
                v-for="(item, i) in categoryList"
                :key="i"
                class="categoryListItem"
                @click="seeEntry(item)"
                style="width: 45%;display: flex;padding: 10px;"
              >
                <el-image
                  class="cat-img"
                  v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                  :src="
                    baseUrlConfig.IMG_PREFIX +
                      JSON.parse(item.SUMMARY[0].summary).img
                  "
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!--<img src="/static/image/tank.png"/>-->
                <div class="text-desc">
                  <p class="entry-title">
                    <span>{{ item.ENTRY_NAME }}</span>
                  </p>
                  <div
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    class="ellipsis3"
                  >
                    {{ JSON.parse(item.SUMMARY[0].summary).text }}
                  </div>
                </div>
              </div>
            </div>
            <p class="noData" v-else>当前分类暂无词条</p>
          </el-tab-pane>
          <el-tab-pane label="政治" name="1">
            <div
              style="display: flex;flex-wrap: wrap"
              v-if="categoryList.length"
            >
              <div
                v-for="(item, i) in categoryList"
                :key="i"
                class="categoryListItem"
                style="width: 45%;display: flex;padding: 10px;"
                @click="seeEntry(item)"
              >
                <el-image
                  class="cat-img"
                  v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                  :src="
                    baseUrlConfig.IMG_PREFIX +
                      JSON.parse(item.SUMMARY[0].summary).img
                  "
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <!--<img src="/static/image/tank.png"/>-->
                <div class="text-desc">
                  <p class="entry-title">
                    <span>{{ item.ENTRY_NAME }}</span>
                  </p>
                  <div
                    v-if="item.SUMMARY.length && item.SUMMARY[0].summary"
                    class="ellipsis3"
                  >
                    {{ JSON.parse(item.SUMMARY[0].summary).text }}
                  </div>
                </div>
              </div>
            </div>
            <p class="noData" v-else>当前分类暂无词条</p>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import { entryStatistical, entryList } from "@/api/onlyShowData/index.js";
import { specialList } from "@/api/special/index.js";
import { categoryTree } from "@/api/classifyManager/index.js";
export default {
  name: "index",
  data() {
    return {
      loading: true,
      panelLoading: true,
      activeName: "6",
      entryStatisticalData: {},
      specialListData: [],
      categoryTreeList: [],
      entryListData: [],
      categoryList: [],
      categoryTitleColor: ["e9b937", "6d56fb", "079ea9", "ec6b6b", "199df2"],
      categoryBgColor: ["f3ebd1", "d9d4f5", "c1dfe2", "f7dee0", "c6e3f5"]
    };
  },
  watch: {},
  created() {
    let vm = this;
    Cetc10Auth().init(function() {
      vm.entryStatistical();
      vm.specialList();
      vm.categoryTree();
      vm.entryList();
      vm.getCategoryList(6);
    });
  },
  mounted() {},
  destroyed() {},
  methods: {
    entryList() {
      entryList({
        pageNumber: "1",
        pageSize: "9",
        categoryId: "",
        keyword: ""
      }).then(res => {
        for (let i = 0; i < res.data.records.length; i += 3) {
          this.entryListData.push(res.data.records.slice(i, i + 3));
        }
        console.log(this.entryListData);
      });
    },

    routeToEntryList(id2, index2, thirdAry) {
      var choosedCategoryInfo = {
        id2: id2,
        index2: index2,
        thirdAry: thirdAry
      };
      sessionStorage.setItem(
        "choosedCategoryInfo",
        JSON.stringify(choosedCategoryInfo)
      );
      this.$router.push("entryListByCategory");
    },
    showThirdCategory(index1, index) {
      this.categoryTreeList[index].children.map(item => {
        item.showThirdCategory = false;
      });
      this.categoryTreeList[index].children[index1].showThirdCategory = true;
    },
    categoryTree() {
      categoryTree({})
        .then(res => {
          res.data.children.map(item => {
            item.children.map((item1, index) => {
              if (index === 0) {
                item1.showThirdCategory = true;
              } else {
                item1.showThirdCategory = false;
              }
            });
          });
          //均分categoryTreeList里面的item的children
          res.data.children.map(item => {
            item.child = [];
            let average = Math.ceil(item.children.length / 3);
            for (var i = 0, len = item.children.length; i < len; i += average) {
              item.child.push(item.children.slice(i, i + average));
            }
          });
          console.info(res.data.children, "res.data.children");

          this.categoryTreeList = res.data.children;
          this.loading = false;
        })
        .catch(res => {
          console.log(res);
        });
    },
    routeToSpecial(id) {
      sessionStorage.setItem("specialId", id);
      this.$router.push("special");
    },

    specialList() {
      specialList({
        pageNumber: 1,
        pageSize: 10,
        keyword: ""
      }).then(res => {
        this.specialListData = res.data.records;
      });
    },
    entryStatistical() {
      entryStatistical({}).then(res => {
        this.entryStatisticalData = res.data;
        this.$nextTick(() => {
          var list = document.querySelectorAll(".data");
          var ary = [];
          for (let i = 0; i < list.length; i++) {
            ary.push(list[i].offsetWidth);
          }
          ary.sort(function(a, b) {
            return a - b;
          });

          for (let i = 0; i < list.length; i++) {
            list[i].style.width = ary[ary.length - 1] + 1 + "px";
          }
        });
      });
    },
    getCategoryList(id) {
      let vm = this;
      vm.$axios
        .post("/wiki-backend/api/entry/list", {
          pageNumber: 1,
          pageSize: 6,
          categoryIds: id
        })
        .then(res => {
          console.log(res);
          vm.categoryList = res.data.records;
          vm.panelLoading = false;
        });
    },
    handleClick() {
      this.panelLoading = true;
      console.log(this.activeName);
      this.getCategoryList(this.activeName);
    },
    seeEntry(hash) {
      console.log(hash);
      this.$router.push({
        name: "viewEntry",
        query: {
          entryId: hash.ENTRY_ID,
          //                    versionId: hash.ID,
          viewType: "view"
        }
      });
    },
    gotoCreate() {
      this.$router.push({
        name: "createEntry"
      });
    },
    gotoMyEntry() {
      this.$router.push({
        name: "myEntry"
      });
    },
    gotoManager() {
      this.$router.push({
        name: "categoryManage"
      });
    },
    // 数字转格式
    toThousands(num) {
      if (num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      } else {
        return 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.categoryOrigin {
  font-size: 26px;
  color: white;
  background: #338de6;
  position: relative;
  display: inline-block;
  line-height: 40px;
  padding: 0 20px;
  margin-bottom: 20px;
  i {
    color: #338de6;
    font-size: 40px;
    position: absolute;
    bottom: -25px;
    left: calc(50% - 25px);
  }
}
.noData {
  text-align: center;
  line-height: 354px;
}
.categoryListItem {
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  .ellipsis3 {
    line-height: 1.5;
    font-size: 28px;
    color: #959595;
  }
  .entry-title {
    line-height: 1.5;
    font-size: 28px;
    color: #5a5a5a;
    margin-bottom: 10px;
  }
  .text-desc {
    padding: 0;
    padding-left: 10px;
  }
  .cat-img {
    .image-slot {
      width: 120px;
      height: 90px;
    }
  }
}
.main-page {
  padding-top: 30px;
  // background: url('/static/image/index-bg.png') 0 0 no-repeat;
  // background-size: 100% 550px;
  .w1280 {
    width: 1280px;
    margin: 0 auto;
  }
  .w1340 {
    width: 1340px;
    margin: 0 auto;
  }
  .w800 {
    width: 800px;
  }
  .w480 {
    width: 540px;
    /*padding: 0 30px;*/
    /*margin: 0 -150px;*/
  }
}
.title + .el-row {
  margin-bottom: 25px;
}
.category-container {
  /*display: flex;
	flex-wrap: nowrap;
	flex-direction: row;*/
  margin-bottom: 50px;
  background: #ebf3f6;
  /*overflow-x: auto;*/
  /*// justify-content: center;*/
}
.category-item {
  min-width: 400px;
  display: inline-block;
  vertical-align: top;
  /*margin-bottom: 20px;*/
  height: 260px;
  .categoryTreeList {
    height: 100%;
  }
  ul {
    overflow-y: scroll;
    height: 195px;
  }
}
.category-item ul::-webkit-scrollbar {
  width: 0px;
}
.category-item ul::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
.category-item ul::-webkit-scrollbar-thumb {
  background-color: white;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
.category-item {
  /*padding: 10px 0 10px 15px;*/
  border-top: 1px solid #9cc6ec;
  &:nth-child(5) {
    /*border-bottom: none;*/
  }
  &:nth-child(6) {
    /*border-bottom: none;*/
  }
  &:nth-child(7) {
    /*border-bottom: none;*/
  }
  .categoryTreeList {
    border-right: 1px solid #9cc6ec;
    padding: 0px 0 0px 15px;
  }
  &:nth-child(3n + 1) {
    .categoryTreeList {
      /*border-right: 0;*/
    }
  }
  /*&:nth-child(5n+1){*/
  /*margin-left: 25px;*/
  /*}*/
}
.category-item {
  &:nth-child(3n + 3) {
    border-right: none;
  }
}
.categoryTreeList {
  /*padding-bottom: 10px;*/
  font-size: 14px;
  color: #99acae;

  p {
    font-size: 28px;
    /*font-weight: bold;*/
    line-height: 1.5;
    color: white;
    text-align: center;
    /*box-shadow: 0 2px 5px 1px #848484;*/
    margin-bottom: 5px;
  }
  .ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-block;
    /*height: 165px;*/
    height: 200px;
    width: 400px;
    /*border-right: 1px solid #ccc;*/

    ul {
      height: 200px;
      display: inline-block;
      width: calc(33% - 1px);
      border-right: 1px solid #c9cdce;
      &:nth-child(2n + 3) {
        border-right: none;
      }
    }

    li {
      margin: 0;
      padding: 0 12px;
      /*display: inline-block;
			width: calc(33% - 1px);*/
      line-height: 1.5;
      font-size: 26px;
      color: #7d7e7e;
      text-align: left;
      vertical-align: top;
      /*border-right: 1px solid #C9CDCE;*/
      /*overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;*/
      // &:nth-child(2n+1){
      // border-right: 1px solid white;
      // }
      &:hover {
        color: #338ce6;
        cursor: pointer;
      }
    }
  }
  .secondCategory {
    position: relative;
    /*border-right: 1px solid white;*/
    ul {
      position: absolute;
      right: -100%;
      top: 0;
      width: 100%;
    }
  }
}

.el-carousel {
  &/deep/ .el-carousel__container {
    height: 400px;
  }
}

/*.entryList{*/
/*&:hover{*/
/*cursor: pointer;*/
/*opacity: 0.8;*/
/*}*/
/*position: relative;*/
/*width: 800px;*/
/*height: 400px;*/

/*image {*/
/*width: 100%;*/
/*height: 100%;*/
/*}*/

/*>div{*/
/*position: absolute;*/
/*left: 0;*/
/*bottom: 0;*/
/*background: rgba(0,0,0,0.3);*/
/*color: white;*/
/*width: calc(100% - 30px);*/
/*padding: 0 15px;*/
/*line-height: 25px;*/
/*font-size: 16px;*/
/*.entry-title{*/
/*line-height: 1.5;*/
/*font-size: 14px;*/
/*font-weight: bold;*/
/*}*/
/*}*/
/*}*/
.entryList {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  margin: 0 5px;
  position: relative;
  width: 256px;
  height: 460px;
  background: #ffffff;

  .carousel-image {
    width: calc(100% - 25px);
    height: 240px;
  }
  > .carousel-image {
    width: 256px;
    min-width: 256px;
    height: 240px;
    min-height: 240px;
    overflow: visible;
    background: #eee;
    /deep/ .image-slot {
      width: 256px;
      min-width: 256px;
      height: 240px;
      min-height: 240px;
      .el-icon-picture-outline {
        margin-left: 117px;
        margin-top: 112px;
      }
    }
  }
  > div {
    /*position: absolute;*/
    left: 0;
    bottom: 0;
    background: white;
    color: black;
    width: 100%;
    /*padding: 0 10px;*/
    line-height: 1.5;
    font-size: 16px;
    .entry-title {
      line-height: 1.5;
      font-size: 28px;
      font-weight: bold;
      padding-left: 10px;
    }
  }
  .ellipsis3 {
    font-size: 26px;
    line-height: 1.5;
    color: #7a7a7a;
    padding: 0 10px 0 10px;
  }
}
.specialList {
  /*border: 1px solid #ccc;*/
  background: #ebf1f1;
  width: 360px;
  height: 480px;
  /*background: #f6fafb;*/
  margin: auto;
  position: relative;
  &/deep/ img {
    width: 100%;
    height: 200px;
  }
  > div:not(.el-image) {
    width: 324px;
    height: 260px;
    padding: 20px 0 30px 0;
    background: white;
    border-radius: 5px;
    position: absolute;
    top: 160px;
    left: calc(50% - 162px);
    box-shadow: 0 0 8px 0 #ccc;
    p {
      text-align: center;
      font-size: 28px;
      font-family: "仿宋";
      font-weight: bold;
      margin-bottom: 10px;
    }
    div {
      font-size: 26px;
      font-family: "仿宋";
      padding: 0 30px;
      line-height: 1.5;
      color: #7d7e7e;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      line-clamp: 5;
      word-wrap: break-word;
    }
  }
}
.el-carousel__item {
  // background: white;
}
.title {
  margin: 15px 0;
  padding-left: 90px;
  color: #338ce6;
  font-weight: bold;
  font-size: 28px;
  line-height: 55px;
  background: url("./title.png") no-repeat;
}
#entryStatisticalData {
  /*display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	height: 330px;*/
  padding: 0 0 0 50px;
  box-sizing: border-box;
  color: #338ce6;
  font-size: 28px;
  .left {
    display: inline-block;
    div {
      width: 100%;
      padding: 15px 0;
      /*text-align: center;*/
    }
  }

  img {
    vertical-align: baseline;
  }
  p {
    // margin: 0 10%;
    // width: 90%;
    // vertical-align: middle;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    display: inline-block;
    img {
      margin-right: 16px;
    }
    .data {
      margin-right: 16px;
      font-size: 30px;
      text-align: right;
      display: inline-block;
      // min-width: 140px;
      max-width: 320px;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 1.5;
      vertical-align: bottom;
      text-align: right;
    }
    span:last-child {
      margin-left: 0px;
      color: #666666;
      line-height: 1.5;
      float: right;
    }
  }
  .rightBtnArea {
    display: inline-block;
    margin-top: 10px;
    margin-left: 15px;
    vertical-align: top;
    .el-button {
      display: block;
      margin: 10px 0;
    }
  }
}

// .el-row+.title{
// 	margin-top: 60px;
// }

.page-index {
  width: 1280px;
  margin: 0 auto;
}
.bgf6fafb::after {
  content: "";
  width: calc(100vw - 5px);
  left: 0;
  transform: translateY(-100%);
  position: absolute;
  min-height: 530px;
  z-index: -10;
  background: #f6fafb;
}
.cat-img {
  width: 150px;
  height: 96px;
  overflow: visible;
  background: #eee;
  /deep/ .image-slot {
    width: 150px;
    height: 96px;
    .el-icon-picture-outline {
      margin-left: 68px;
      margin-top: 41px;
    }
  }
}
.text-desc {
  display: flex;
  flex-direction: column;
  padding: 10px;
  line-height: 1.5;
}
body {
  overflow-x: hidden;
}
.el-tabs {
  height: 354px;
  padding-bottom: 40px;
  /deep/ .el-tabs__item {
    height: 58px;
    line-height: 1.5;
    width: 100px;
    text-align: center;
    color: #333333;
  }
  /deep/ .el-tabs__item.is-active {
    background: #eee;
    color: #333333;
  }
}
</style>
