module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicRange', gdeicRangeDirective);

    gdeicRangeDirective.$inject = [];

    function gdeicRangeDirective() {
        return {
            restrict: 'EA',
            scope: {
                ngModel: '=',
                labelText: '@',
                minValue: '=',
                maxValue: '=',
                step: '=',
                isModifyMinValue: '='
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/range.html';
            },
            replace: true,
            controller: function () {
                this.change = angular.noop;
            },
            controllerAs: 'vm',
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                var _minValue;

                if (scope.isModifyMinValue) {
                    controller.change = function () {
                        if (angular.isUndefined(_minValue)) {
                            _minValue = scope.minValue;
                        }

                        if (parseFloat(scope.ngModel) - _minValue < 1) {
                            scope.minValue = _minValue;
                        } else {
                            scope.minValue = Math.ceil(scope.minValue);
                        }
                    }
                }
            }
        }
    }
}