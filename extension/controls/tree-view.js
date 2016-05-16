module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicTreeView', gdeicTreeView);

    gdeicTreeView.$inject = ['$templateCache', '$gdeic'];

    function gdeicTreeView($templateCache, $gdeic) {
        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                treeData: '=',
                isExpandRoot: '=',
                isMultiChecked: '=',
                selectedModel: '=',
                itemToggle: '&',
                itemSelect: '&',
                itemDisabled: '=',
                extendMethods: '='
            },
            template: function (tElement, tAttrs) {
                var template = $templateCache.get(tAttrs.templateUrl) || '<div ng-include="\'' + tAttrs.templateUrl + '\'"></div>';
                return template;
            },
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                (function () {
                    if (scope.isMultiChecked) {
                        if (angular.isUndefined(scope.selectedModel)) {
                            scope.selectedItems = [];
                        } else {
                            if (angular.isArray(scope.selectedModel)) {
                                scope.selectedItems = scope.selectedModel;
                            } else {
                                scope.selectedItems = [];
                            }
                        }
                    } else {
                        if (angular.isUndefined(scope.selectedModel)) {
                            scope.selectedItems = null;
                        } else {
                            if (scope.selectedModel === null || scope.selectedModel.constructor === Object) {
                                scope.selectedItems = scope.selectedModel;
                            } else {
                                scope.selectedItems = null;
                            }
                        }
                    }

                    if (scope.isExpandRoot) {
                        var _unbindWatcher = scope.$watch('treeData', function (newValue) {
                            if (newValue) {
                                scope.treeData.$$isExpand = true;
                                _unbindWatcher();
                            }
                        }, true);
                    }

                    if (scope.extendMethods) {
                        for (var p in scope.extendMethods) {
                            if (scope.extendMethods.hasOwnProperty(p)) {
                                scope[p] = scope.extendMethods[p];
                            }
                        }
                    }
                } ());

                scope.toggleExpand = function (item, $event) {
                    item.$$isExpand = !item.$$isExpand;
                    $event.stopPropagation();
                }

                scope.doCallback = function (callbackName, item, $event) {
                    if (!scope[callbackName]) { return; }

                    if (callbackName === 'itemSelect') {
                        if (scope.isMultiChecked) {
                            $gdeic.toggleItem(scope.selectedItems, item);
                        } else {
                            scope.selectedItems = item;
                        }

                        if (angular.isDefined(scope.selectedModel)) {
                            scope.selectedModel = scope.selectedItems;
                        }
                    }

                    scope[callbackName]({
                        $item: item,
                        $event: $event
                    });
                }
            }
        };
    }
};