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
            template: '<span>{{vm.showText}}</span>',
            replace: true,
            controller: ['$scope',
                function($scope) {
                    $scope.splitOf = $scope.splitOf || ',';

                    let _aProperties = $scope.property.split('.'),
                        _sProperties = '';
                    for (let p of _aProperties) {
                        _sProperties += `['${p}']`;
                    }
                    this.showText = $scope.source.map(x => eval(`x${_sProperties}`)).join($scope.splitOf);

                }
            ],
            controllerAs: 'vm'
        };
    }
};