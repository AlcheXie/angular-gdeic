module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicLoading', gdeicLoading);

    gdeicLoading.$inject = [];

    function gdeicLoading() {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                templateUrl: '@',
                isLoading: '=',
                loadingClass: '@',
                loadingStyle: '@',
                loadingText: '@'
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/loading.html';
            },
            replace: true
        };
    }
};