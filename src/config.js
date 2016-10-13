module.exports = function(ngModule) {

    ngModule.config(['$httpProvider', function configFunc($httpProvider) {
        $httpProvider.interceptors.push('$gdeicHttpInterceptor');
    }]);
};