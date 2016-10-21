module.exports = function(ngModule) {

    ngModule.directive('gdeicHoldOn', gdeicHoldOnDirective);

    gdeicHoldOnDirective.$inject = ['$templateCache'];

    function gdeicHoldOnDirective($templateCache) {

        $templateCache.put('gdeic/template/hold-on.html', require('./template.html'));

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                holdOnText: '@'
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/hold-on.html';
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

    require('./hold-on.scss');
};