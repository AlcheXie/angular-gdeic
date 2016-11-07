module.exports = function(ngModule) {

    ngModule.config(['$httpProvider', function configFunc($httpProvider) {
        $httpProvider.interceptors.push('$gdeicHttpInterceptor');
    }]);

    ngModule.run(['$templateCache', function($templateCache) {
        $templateCache.put('gdeic/template/directive-blank.html',
            `<p style="text-align: center; color: red">This directive has no template.</p>`)
    }])
};