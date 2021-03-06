module.exports = function(ngModule, options) {

    ngModule.directive('gdeicRange', gdeicRangeDirective);

    gdeicRangeDirective.$inject = ['$templateCache'];

    function gdeicRangeDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/template/gdeicRange.html';
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
                ngModel: '=',
                showLabel: '=',
                labelText: '@',
                minValue: '=',
                maxValue: '=',
                step: '=',
                isModifyMinValue: '='
            },
            templateUrl: function(tElement, tAttrs) {
                return require('../../../src/common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
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
}