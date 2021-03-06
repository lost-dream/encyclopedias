//权限配置
var AuthConfig = {
  //192
  'auth-server-url': 'http://192.168.0.31:10002/apis/v1/ga/auth/token/validation',
  'auth-login-url': 'http://192.168.0.31:10002/#/login',
  'software-flag': 'QBBK'

  //10.24.1.31:10002
  //	"auth-server-url": "http://10.24.1.31:10002/apis/v1/ga/auth/token/validation",
  //	"auth-login-url": "http://10.24.1.31:10002/#/login",
  //	"software-flag": "xxfb",

  //10.24.1.110:30000
  //	"auth-server-url": "http://10.24.1.110:30000/apis/v1/ga/auth/token/validation",
  //	"auth-login-url": "http://10.24.1.110:30000/#/login",
  //	"software-flag": "QBBK",
}

//基础地址（接口：serviceBaseUrl、图片下载地址：IMG_PREFIX、上传地址：UPLOAD_URL）
var baseUrlConfig = {
  // DEV
  serviceBaseUrl: 'http://192.168.1.186:8080',
  IMG_PREFIX: 'http://192.168.1.106:8888',
  UPLOAD_URL: 'http://192.168.1.82:8080/wiki-backend/upload/uploadImg',
  LOGIN_URL: 'http://192.168.1.186:8081/text/aa',
  UPLOAD_URL1: 'http://192.168.1.189:8080/wiki-backend/api/backendTask/importTask'

  // CETC
  // serviceBaseUrl: 'http://192.168.0.35:8080',
  // IMG_PREFIX: 'http://192.168.0.35:8888',
  // UPLOAD_URL: 'http://192.168.0.35:8080/wiki-backend/upload/uploadImg',
  // LOGIN_URL: 'http://192.168.0.31:10002/#/login'

  // TEST
  // serviceBaseUrl: 'http://192.168.1.82:8080',
  // IMG_PREFIX: 'http://192.168.1.106:8888',
  // UPLOAD_URL: 'http://192.168.1.82:8080/wiki-backend/upload/uploadImg',
  // LOGIN_URL: 'http://192.168.1.186:8081/text/aa',
  // UPLOAD_URL1: 'http://192.168.1.189:8080/wiki-backend/api/backendTask/importTask'
}
