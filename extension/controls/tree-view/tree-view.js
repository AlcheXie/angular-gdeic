module.exports = function(ngModule) {

    ngModule.directive('gdeicTreeView', gdeicTreeViewDirective);

    gdeicTreeViewDirective.$inject = ['$templateCache'];

    function gdeicTreeViewDirective($templateCache) {
        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                treeData: '=',
                isExpandRoot: '=',
                isSelectRoot: '=',
                isMultiChecked: '=',
                selectedModel: '=',
                itemToggle: '&',
                itemSelect: '&',
                itemDisabled: '=',
                extendMethods: '='
            },
            template: function(tElement, tAttrs) {
                var template = $templateCache.get(tAttrs.templateUrl) || `<div ng-include="'${tAttrs.templateUrl}'"></div>`;
                return template;
            },
            controller: ['$scope', '$gdeic',
                function($scope, $gdeic) {
                    (() => {
                        if ($scope.isMultiChecked) {
                            if (angular.isUndefined($scope.selectedModel)) {
                                $scope.selectedItems = [];
                            } else {
                                if (angular.isArray($scope.selectedModel)) {
                                    $scope.selectedItems = $scope.selectedModel;
                                } else {
                                    $scope.selectedItems = [];
                                }
                            }
                        } else {
                            if (angular.isUndefined($scope.selectedModel)) {
                                $scope.selectedItems = null;
                            } else {
                                if ($scope.selectedModel === null || angular.isObject($scope.selectedModel)) {
                                    $scope.selectedItems = $scope.selectedModel;
                                } else {
                                    $scope.selectedItems = null;
                                }
                            }
                        }

                        if ($scope.isExpandRoot) {
                            let _unbindWatcher = $scope.$watch('treeData', newVal => {
                                if (newVal) {
                                    $scope.treeData.$$isExpand = true;
                                    if ($scope.isSelectRoot) {
                                        $scope.doCallback('itemSelect', newVal)
                                    }
                                    _unbindWatcher();
                                }
                            }, true);
                        }

                        if ($scope.extendMethods) {
                            for (let key of Object.keys($scope.extendMethods)) {
                                $scope[key] = $scope.extendMethods[key];
                            }
                        }
                    })();

                    $scope.toggleExpand = (item, $event) => {
                        item.$$isExpand = !item.$$isExpand;
                        $event.stopPropagation();
                    };

                    $scope.doCallback = (callbackName, item, $event) => {
                        if (!$scope[callbackName]) { return; }

                        if (callbackName === 'itemSelect') {
                            if ($scope.isMultiChecked) {
                                $gdeic.toggleItem($scope.selectedItems, item);
                            } else {
                                $scope.selectedItems = item;
                            }

                            if (angular.isDefined($scope.selectedModel)) {
                                $scope.selectedModel = $scope.selectedItems;
                            }
                        }

                        $scope[callbackName]({
                            $item: item,
                            $event: $event
                        });
                    };
                }
            ],
            controllerAs: 'vm'
        };
    }
};