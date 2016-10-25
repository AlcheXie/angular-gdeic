module.exports = function(ngModule) {

    ngModule.directive('gdeicModalPanel', gdeicModalPanelDirective);

    gdeicModalPanelDirective.$inject = ['$templateCache'];

    function gdeicModalPanelDirective($templateCache) {

        $templateCache.put('gdeic/controls/template/modal-panel.html', require('./template.html'));

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
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/modal-panel.html';
            },
            replace: true,
            controller: ['$scope', '$attrs',
                function($scope, $attrs) {
                    this.$$hasClear = angular.isDefined($attrs.clear);
                }
            ],
            controllerAs: 'vm'
        };
    }
};