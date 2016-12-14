module.exports = function(ngModule, options) {

    ngModule.directive('gdeicDatePicker', gdeicDatePickerDirective);

    gdeicDatePickerDirective.$inject = ['$templateCache'];

    function gdeicDatePickerDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/controls/template/gdeicDatePicker.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }

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
                return require('../../../src/common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
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