module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicLoading', gdeicLoadingDirective);

    gdeicLoadingDirective.$inject = [];

    function gdeicLoadingDirective() {
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