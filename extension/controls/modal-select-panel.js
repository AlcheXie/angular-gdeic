module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicModalSelectPanel', gdeicModalSelectPanel);

    gdeicModalSelectPanel.$inject = ['$templateCache', '$gdeic'];

    function gdeicModalSelectPanel($templateCache, $gdeic) {
        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                isShow: '=',
                headerTitle: '@',
                sourceList: '=',
                keyProperty: '@',
                valueProperty: '@',
                filterProperty: '@',
                ngModel: '=',
                multiSelect: '='
            },
            template: function (tElement, tAttrs) {
                var template;

                if (angular.isUndefined(tAttrs.templateUrl)) {
                    if (tAttrs.multiSelect === 'true') {
                        template = $templateCache.get('gdeic/controls/template/modal-select-panel-multi.html');
                    } else {
                        template = $templateCache.get('gdeic/controls/template/modal-select-panel.html');
                    }
                    template = template.replace(/\[\[key\]\]/g, tAttrs.keyProperty);
                    template = template.replace(/\[\[value\]\]/g, tAttrs.valueProperty);
                    template = template.replace(/\[\[filter\]\]/g, tAttrs.filterProperty);
                } else {
                    template = '<span ng-include="\'' + tAttrs.templateUrl + '\'"></span>';
                }

                return template;
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                var _originalValue;
                scope.search = {};
                if (scope.multiSelect === true) {
                    _originalValue = [];
                } else {
                    _originalValue = {};
                    Object.defineProperty(_originalValue, iAttrs.keyProperty, {
                        value: ''
                    });
                }

                scope.$watch('isShow', function (newValue) {
                    if (newValue) {
                        if (scope.multiSelect === true) {
                            scope.selectedItem = angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : _originalValue;
                        } else {
                            scope.selectedItem = angular.isObject(scope.ngModel) && !angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : _originalValue;
                        }
                    }
                });

                scope.isCheck = function (oItem) {
                    if (angular.isUndefined(scope.selectedItem)
                        || angular.isUndefined(oItem[iAttrs.keyProperty])) {
                        return false;
                    }

                    if (scope.multiSelect === true) {
                        return scope.selectedItem.some(function (item) {
                            return item[scope.keyProperty] === oItem[scope.keyProperty];
                        });
                    } else {
                        return scope.selectedItem[iAttrs.keyProperty] === oItem[iAttrs.keyProperty];
                    }
                }

                scope.selectItem = function (item) {
                    if (scope.multiSelect === true) {
                        $gdeic.toggleItem(scope.selectedItem, item);
                    } else {
                        scope.selectedItem = item;
                    }
                }

                scope.clear = function () {
                    scope.selectedItem = angular.copy(_originalValue);
                }

                scope.ok = function () {
                    if (scope.selectedItem === _originalValue) {
                        if (scope.multiSelect === true) {
                            scope.ngModel = [];
                        } else {
                            scope.ngModel = null;
                        }
                    } else {
                        scope.ngModel = angular.copy(scope.selectedItem);
                    }
                    scope.isShow = false;
                }
            }
        };
    }
};