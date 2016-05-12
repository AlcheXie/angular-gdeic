module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$gdeicHttpErrorInterceptor', $gdeicHttpErrorInterceptor);

    $gdeicHttpErrorInterceptor.$inject = ['$q', '$rootScope', '$log'];

    function $gdeicHttpErrorInterceptor($q, $rootScope, $log) {
        var httpInterceptor = {
            'responseError': function (response) {
                if (response.config.url.indexOf('.') < 0) {
                    $log.error('RequestError: ' + response.config.url, response.status, response);
                }
                return $q.reject(response);
            },
            'response': function (response) {
                if (response.config.url.indexOf('.') < 0) {
                    if (response.data.StatusCode < 0) {
                        var error = {
                            StatusCode: response.data.StatusCode,
                            ErrorMsg: response.data.ErrorMsg
                        };
                        $log.warn(error);
                        $rootScope.$broadcast('httpErrMsg', error);
                    }

                    if (angular.isObject(response.data.Data)) {
                        response.data.Data.formatDate();
                    }
                }
                return response;
            }
        }
        return httpInterceptor;
    }
};