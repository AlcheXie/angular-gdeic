module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicArrayText', gdeicArrayText);

    gdeicArrayText.$inject = [];

    function gdeicArrayText() {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                source: '=',
                property: '@',
                splitOf: '@'
            },
            template: '<span>{{showText}}</span>',
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                var properties = scope.property.split('.'), strProperties = '';
                for (var i = 0, max = properties.length; i < max; i++) {
                    strProperties += '[\'' + properties[i] + '\']';
                }

                scope.showText = scope.source.map(function (item) {
                    return eval('item' + strProperties);
                }).join(scope.splitOf);
            }
        };
    }
};