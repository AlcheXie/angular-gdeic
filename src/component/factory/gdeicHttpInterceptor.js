module.exports = function(ngModule) {

    ngModule.factory('$gdeicHttpInterceptor', $gdeicHttpInterceptorFactory);

    $gdeicHttpInterceptorFactory.$inject = ['$q', '$rootScope', '$log'];

    function $gdeicHttpInterceptorFactory($q, $rootScope, $log) {
        var httpInterceptor = {
            'request': function(config) {
                if (config.url.indexOf('.') < 0) {
                    if (angular.isObject(config.data)) {
                        config.data.addHours(8);
                    }
                }
                return config;
            },
            'response': function(response) {
                if (response.config.url.indexOf('.') < 0) {
                    if (response.data.StatusCode < 0) {
                        let _error = {
                            StatusCode: response.data.StatusCode,
                            ErrorMsg: response.data.ErrorMsg
                        };
                        $log.warn(_error);
                        $rootScope.$broadcast('httpErrMsg', _error);
                    }

                    if (angular.isObject(response.data.Data)) {
                        response.data.Data.formatDate();
                        response.data.Data.addHours(-8);
                    }
                }
                return response;
            },
            'responseError': function(response) {
                if (response.config.url.indexOf('.') < 0) {
                    $log.error('RequestError: ' + response.config.url, response.status, response);
                }
                return $q.reject(response);
            }
        }
        return httpInterceptor;
    }
};