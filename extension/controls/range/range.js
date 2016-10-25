module.exports = function(ngModule) {

    ngModule.directive('gdeicRange', gdeicRangeDirective);

    gdeicRangeDirective.$inject = ['$templateCache'];

    function gdeicRangeDirective($templateCache) {

        $templateCache.put('gdeic/controls/template/range.html', require('./template.html'));

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                ngModel: '=',
                labelText: '@',
                minValue: '=',
                maxValue: '=',
                step: '=',
                isModifyMinValue: '='
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/range.html';
            },
            replace: true,
            controller: ['$scope',
                function($scope) {
                    this.change = angular.noop;

                    if ($scope.isModifyMinValue) {
                        let _minValue;
                        this.change = () => {
                            if (angular.isUndefined(_minValue)) {
                                _minValue = $scope.minValue;
                            }

                            if (parseFloat($scope.ngModel) - _minValue < 1) {
                                $scope.minValue = _minValue;
                            } else {
                                $scope.minValue = Math.ceil($scope.minValue);
                            }
                        }
                    }
                }
            ],
            controllerAs: 'vm'
        };
    }

    require('./range.scss');
}