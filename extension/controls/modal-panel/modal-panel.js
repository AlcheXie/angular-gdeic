module.exports = function(ngModule, options) {

    ngModule.directive('gdeicModalPanel', gdeicModalPanelDirective);

    gdeicModalPanelDirective.$inject = ['$templateCache'];

    function gdeicModalPanelDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/template/modal-panel.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('./modal-panel.scss');
        }

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
                return require('../../../src/common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
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