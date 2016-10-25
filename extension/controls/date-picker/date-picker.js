module.exports = function(ngModule) {

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
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/date-picker.html';
            },
            replace: true,
            controller: ['$scope',
                function($scope) {
                    $scope.ngModel = $scope.ngModel || null;
                    this.open = () => this.opened = true;
                }
            ],
            controllerAs: 'vm',
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                let $input = iElement.children().eq(0),
                    _date,
                    _time = 0;
                $input.bind('keypress', () => {
                    _time++;
                    if (_time === 1) {
                        _date = scope.ngModel;
                    }
                }).bind('keyup', () => {
                    if (angular.isDefined(_date)) {
                        _time = 0;
                        scope.ngModel = _date;
                        scope.$apply();
                    }
                });
            }
        };
    }
};