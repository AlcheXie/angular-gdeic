module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicIeWarning', gdeicIeWarningDirective);

    gdeicIeWarningDirective.$inject = ['$window'];

    function gdeicIeWarningDirective($window) {
        return {
            restrict: 'EA',
            scope: {
                warningText: '@'
            },
            template: '<div class="gdeic-ie-warning" ng-if="isIE">'
            + '{{warningText || \'注意：为达到最好的使用效果，请使用【Chrome浏览器】或【双核浏览器极速模式】访问！\'}}'
            + '</div>',
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                if ('ActiveXObject' in $window) {
                    scope.isIE = true;

                    angular.element(document.querySelectorAll('body')).css('padding-top', '50px');
                }
            }
        }
    }

    require('./ie-warning.scss');
};