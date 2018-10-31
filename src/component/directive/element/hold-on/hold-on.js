module.exports = function (ngModule) {
    'use strict';

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
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/hold-on.html';
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                scope.$on('holdOn', function (event, data) {
                    var _modal = angular.element(document.querySelectorAll('[modal-render]'));
                    if (data) {
                        _modal.css('z-index', 1000);
                    } else {
                        _modal.css('z-index', 1050);
                    }
                    scope.isHoldingOn = data;
                });
            }
        };
    }
};