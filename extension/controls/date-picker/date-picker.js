module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicDatePicker', gdeicDatePickerDirective);

    gdeicDatePickerDirective.$inject = ['$templateCache'];

    function gdeicDatePickerDirective($templateCache) {

        $templateCache.put('gdeic/controls/template/date-picker.html', require('./template.html'));

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                ngModel: '=',
                ngRequired: '=',
                ngDisabled: '=',
                minDate: '=',
                maxDate: '=',
                dateDisabled: '&'
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/date-picker.html';
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                scope.ngModel = scope.ngModel || null;

                scope.open = function () {
                    scope.opened = true;
                }

                var input = iElement.children().eq(0), date, time = 0;
                input.bind('keypress', function () {
                    time++;
                    if (time === 1) {
                        date = scope.ngModel;
                    }
                }).bind('keyup', function () {
                    if (angular.isDefined(date)) {
                        time = 0;
                        scope.ngModel = date;
                        scope.$apply();
                    }
                });
            }
        };
    }
};