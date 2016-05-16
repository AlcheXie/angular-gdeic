module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicModalPanel', gdeicModalPanel);

    gdeicModalPanel.$inject = [];

    function gdeicModalPanel() {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                templateUrl: '@',
                isShow: '=',
                headerTitle: '@',
                confirm: '&',
                clear: '&',
                cancel: '&'
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/modal-panel.html';
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                scope.$$isClear = angular.isDefined(iAttrs.clear);

                scope.ok = function () {
                    scope.confirm();
                    scope.isShow = false;
                }
            }
        };
    }
};