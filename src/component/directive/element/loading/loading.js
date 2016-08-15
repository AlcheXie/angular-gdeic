module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicLoading', gdeicLoadingDirective);

    gdeicLoadingDirective.$inject = ['$templateCache'];

    function gdeicLoadingDirective($templateCache) {

        $templateCache.put('gdeic/template/loading.html', require('./template.html'));

        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                templateUrl: '@',
                isLoading: '=',
                loadingClass: '@',
                loadingText: '@'
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/loading.html';
            },
            replace: true
        };
    }
};