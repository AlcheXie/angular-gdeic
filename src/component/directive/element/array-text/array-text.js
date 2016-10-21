module.exports = function(ngModule) {

    ngModule.directive('gdeicArrayText', gdeicArrayTextDirective);

    gdeicArrayTextDirective.$inject = [];

    function gdeicArrayTextDirective() {
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
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                let _aProperties = scope.property.split('.'),
                    _sProperties = '';
                for (let p of _aProperties) {
                    _sProperties += `['${p}']`;
                }
                scope.showText = scope.source.map(x => eval(`x${_sProperties}`)).join(scope.splitOf);
            }
        };
    }
};