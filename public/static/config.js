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
  //外网
  // serviceBaseUrl: 'http://106.12.208.84:8080',
  // IMG_PREFIX: 'http://106.12.208.84:8888',
  // UPLOAD_URL: 'http://106.12.208.84:8888/wiki-backend/upload/uploadImg'

  //192
  serviceBaseUrl: 'http://192.168.1.186:8080',
  IMG_PREFIX: 'http://192.168.1.106:8888',
  UPLOAD_URL: 'http://192.168.1.82:8080/wiki-backend/upload/uploadImg'

  // CETC
  // serviceBaseUrl: 'http://192.168.0.35:8080',
  // IMG_PREFIX: 'http://192.168.0.35:8888',
  // UPLOAD_URL: 'http://192.168.0.35:22122/wiki-backend/upload/uploadImg'

  //10.24.1.21:8080
  //	serviceBaseUrl:'http://10.24.1.21:8080',
  //	IMG_PREFIX:'http://10.24.1.21:8888',
  //	UPLOAD_URL:'http://10.24.1.21:8080/wiki-backend/upload/uploadImg',

  //http://10.24.1.110:30360
  //	serviceBaseUrl:'http://10.24.1.110:30360',
  //	IMG_PREFIX:'http://10.24.1.110:30362',
  //	UPLOAD_URL:'http://10.24.1.110:30361/wiki-backend/upload/uploadImg',
}
