(function (window, undefined) {

    var Cetc10Auth = function (config) {
        if (!(this instanceof Cetc10Auth)) {
            return new Cetc10Auth(config);
        }

        var c10Auth = this;

        c10Auth.init = function() {
            c10Auth.authenticated = false;
            //生成最终传递出闭包方法的异步对象
            var promise = createPromise();
            
            //生成初始异步对象
            var initPromise = createPromise();
            initPromise.promise.success(function(){
                promise.setSuccess(c10Auth.authenticated);
            }).error(function(errorData) {
                promise.setError(errorData);
            });

            //加载配置对象
            var configPromise = loadConfig(config);
            //加载配置成功，进行初始化处理
            configPromise.success(processInit);
            configPromise.error(function () {
                promise.setError();
            });

            /**
             * 处理token验证及跳转
             */
            function processInit() {
                //1. 从浏览器获取token数据
                var sHerf = window.location.href;
                var herfArray = sHerf.split('?');
                var token = null;
                if(herfArray.length > 1){
                    var arr = herfArray[1].split('&');
                    for (var i = 0; i < arr.length; i++) {
                        var arg = arr[i].split('=');

                        //bs variable
                        if (arg[0] === 'token') {
                            token = decodeURIComponent(arg[1]);
							sessionStorage.setItem('token', token);
                        }
                        
                        //一体化跳转参数
						if (arg[0] === 'tokenId') {
                            token = decodeURIComponent(arg[1]);
							sessionStorage.setItem('token', token);
                        }

                    }
                }
                
                //假如没有token值，就从sessionStorage取token的值
                if (!token) {
                    token = sessionStorage.getItem("token");
                }
            

                //验证token信息，并生成token验证异步对象
                var tokenValidatePromise = validateToken(token);
				tokenValidatePromise.success(processToken);
				tokenValidatePromise.error(function () {
                    initPromise.setError();
				});
            }

            function processToken(result) {
                if(result.status === 0){
                    sessionStorage.setItem("token", result.data.newToken);
                    c10Auth.authenticated = true;
                    initPromise.setSuccess();
                }else{
                    var sourceUrl = window.location.href;
                    window.location.href = c10Auth.authLoginUrl + "?callbackUrl=" + sourceUrl+ "&softwareFlag=" + c10Auth.softwareFlag;
                    initPromise.setError();
                }
            }
			
			return promise.promise;
        }


        /**
         * token校验
         * @param {} token 
         */
        function validateToken(token){

            var promise = createPromise();
    
            var req = createAjax();
            req.open('GET', c10Auth.authServerUrl, true);
            req.setRequestHeader('Accept', 'application/json');
			req.setRequestHeader('Authorization', token);
			req.setRequestHeader('softwareFlag', c10Auth.softwareFlag);

            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200 || fileLoaded(req)) {
                        var result = JSON.parse(req.responseText);
                        promise.setSuccess(result);
						sessionStorage.setItem('userData', JSON.stringify(result.data));
                    } else {
                        promise.setError();
                    }
                }
            };
            req.send();
            return promise.promise;
        }

        function loadConfig(url) {
            var promise = createPromise();
            var configUrl;

            if (!url) {
                configUrl = 'cetc10Auth_03.json';
            } else if (typeof url === 'string') {
                configUrl = config;
            }

            if (configUrl) {
                var req = createAjax();
                req.open('GET', configUrl, true);
                req.setRequestHeader('Accept', 'application/json');

                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        if (req.status == 200 || fileLoaded(req)) {
                            var config = JSON.parse(req.responseText);

                            c10Auth.authServerUrl = config['auth-server-url'];
                            c10Auth.authLoginUrl = config['auth-login-url'];
							c10Auth.softwareFlag = config['software-flag'];

                            promise.setSuccess();
                        } else {
                            promise.setError();
                        }
                    }
                };
                req.send();
            } else {
				throw 'config missing';
			}

            return promise.promise;
        }
		
		function fileLoaded(xhr) {
            return xhr.status == 0 && xhr.responseText && xhr.responseURL.startsWith('file:');
        }

        function createPromise() {
            var p = {
                setSuccess: function (result) {
                    p.success = true;
                    p.result = result;
                    if (p.successCallback) {
                        p.successCallback(result);
                    }
                },

                setError: function (result) {
                    p.error = true;
                    p.result = result;
                    if (p.errorCallback) {
                        p.errorCallback(result);
                    }
                },

                promise: {
                    success: function (callback) {
                        if (p.success) {
                            callback(p.result);
                        } else if (!p.error) {
                            p.successCallback = callback;
                        }
                        return p.promise;
                    },
                    error: function (callback) {
                        if (p.error) {
                            callback(p.result);
                        } else if (!p.success) {
                            p.errorCallback = callback;
                        }
                        return p.promise;
                    }
                }
            }
            return p;
        }

        function createAjax() { 
            var xhr = null;
            try {
                xhr = new ActiveXObject("Microsoft.xmlhttp");
            } catch (error1) {
                try {
                    xhr = new XMLHttpRequest();
                } catch (error2) {
                    window.alert("您的浏览器不支持ajax！");
                }
            }
            return xhr;
        }

        c10Auth.logout = function () {
            var sourceUrl = window.location.href;
            window.location.href = c10Auth.authLoginUrl + "?callbackUrl=" + sourceUrl + "&softwareFlag=" + c10Auth.softwareFlag;
            return createPromise().promise;
        }
    }

    

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Cetc10Auth;
    } else {
        window.Cetc10Auth = Cetc10Auth;

        if (typeof define === "function" && define.amd) {
            define("Cetc10Auth", [], function () { return Cetc10Auth; });
        }
    }
})(window);