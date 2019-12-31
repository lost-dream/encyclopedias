<template>
  <div class="admin-header">
    <span>
      <!--<img src="../../public/static/image/icon/logo.png" alt="LOGO.png">-->
      <span>信息百科</span>
    </span>

    <div class="action-box">
      <a>
        <img
          style="margin-right: 5px;width: 20px;vertical-align: top;margin-top: 22px;"
          src="./admin.png"
          alt=""
        />
        <!-- todo 姓名取那个字段-->
        你好，{{ user.userChineseName }}同志
      </a>
      <a href=""><i class="el-icon-s-home"></i>首页</a>
      <a @click="exit"><i class="el-icon-switch-button"></i>退出</a>
    </div>
  </div>
</template>

<script>
const LOGIN_URL = 'http://192.168.1.186:8081/text/aa'

export default {
  data() {
    return {
      content: '',
      user: JSON.parse(sessionStorage.getItem('user'))
    }
  },
  watch: {},
  created() {},
  methods: {
    exit() {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('source')
      sessionStorage.removeItem('user')
      window.location.href = LOGIN_URL
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-header {
  background: #5b7dd8;
  height: 64px;
  color: #fff;
  margin: 0 -20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  img {
    margin-right: 10px;
    vertical-align: middle;
  }
  span {
    font-weight: bold;
    font-size: 28px;
    vertical-align: sub;
    display: inline-block;
    width: 210px;
    text-align: center;
  }
  .action-box {
    height: 64px;
    line-height: 64px;
    a {
      color: white;
      text-decoration: none;
      text-align: center;
      cursor: pointer;
      display: inline-block;
      /*width: 60px;*/
      padding: 0 15px;
      i {
        margin-right: 5px;
      }
    }
    a:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #a7d3ff;
    }
  }
}
</style>
