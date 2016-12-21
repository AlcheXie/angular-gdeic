module.exports = function(ngModule, options) {

    ngModule.directive('gdeicHoldOn', gdeicHoldOnDirective);

    gdeicHoldOnDirective.$inject = ['$templateCache'];

    function gdeicHoldOnDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/template/gdeicHoldOn.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('./styles.scss');
        }

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                holdOnText: '@'
            },
            templateUrl: function(tElement, tAttrs) {
                return require('../../../../common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
            },
            replace: true,
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                scope.$on('holdOn', (event, data) => {
                    let $modal = angular.element(document.querySelectorAll('[modal-render]'));
                    if (data) {
                        $modal.css('z-index', 1000);
                    } else {
                        $modal.css('z-index', 1050);
                    }
                    scope.isHoldingOn = data;
                });
            }
        };
    }
};