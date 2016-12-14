module.exports = function(ngModule, options) {

    ngModule.directive('gdeicModalSelectPanel', gdeicModalSelectPanelDirective);

    gdeicModalSelectPanelDirective.$inject = ['$templateCache', '$gdeic'];

    function gdeicModalSelectPanelDirective($templateCache, $gdeic) {

        options = options || {};
        let templateName = 'gdeic/controls/template/gdeicModalSelectPanel.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('../gdeicModalPanel/styles.scss');
        }

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
            template: function(tElement, tAttrs) {
                var template = require('../../../src/common/set-directive-template')($templateCache, tAttrs.templateUrl, templateName);
                template = template.replace(/\[\[key\]\]/g, tAttrs.keyProperty);
                template = template.replace(/\[\[value\]\]/g, tAttrs.valueProperty);
                template = template.replace(/\[\[filter\]\]/g, tAttrs.filterProperty);

                return template;
            },
            replace: true,
            controller: ['$scope', '$attrs',
                function($scope, $attrs) {
                    this.originalValue;
                    this.search = {};
                    this.selectItem;

                    this.isCheck = item => {
                        if (angular.isUndefined(this.selectedItem) ||
                            angular.isUndefined(item[$attrs.keyProperty])) {
                            return false;
                        }

                        if ($scope.multiSelect === true) {
                            return this.selectedItem.some(x => x[$scope.keyProperty] === item[$scope.keyProperty]);
                        } else {
                            return this.selectedItem[$attrs.keyProperty] === item[$attrs.keyProperty];
                        }
                    }

                    this.selectItem = item => {
                        if ($scope.multiSelect === true) {
                            $gdeic.toggleItem(this.selectedItem, item);
                        } else {
                            this.selectedItem = item;
                        }
                    }

                    this.clear = () => this.selectedItem = angular.copy(this.originalValue);

                    this.ok = () => {
                        if (angular.toJson(this.selectedItem) === angular.toJson(this.originalValue)) {
                            if ($scope.multiSelect === true) {
                                $scope.ngModel = [];
                            } else {
                                $scope.ngModel = null;
                            }
                        } else {
                            $scope.ngModel = angular.copy(this.selectedItem);
                        }
                        $scope.isShow = false;
                    }

                    if ($scope.multiSelect === true) {
                        this.originalValue = [];
                    } else {
                        this.originalValue = {};
                        Object.defineProperty(this.originalValue, $attrs.keyProperty, {
                            value: ''
                        });
                    }
                }
            ],
            controllerAs: 'vm',
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                scope.$watch('isShow', newVal => {
                    if (newVal) {
                        if (scope.multiSelect === true) {
                            controller.selectedItem = angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : angular.copy(controller.originalValue);
                        } else {
                            controller.selectedItem = angular.isObject(scope.ngModel) && !angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : angular.copy(controller.originalValue);
                        }

                        if (angular.isUndefined(scope.templateUrl)) {
                            $gdeic.execAsync(() => {
                                let $panel = iElement.children(),
                                    $panelChildren = $panel.children(),
                                    $panelHeader = $panelChildren.eq(0),
                                    $panelFilter = $panelChildren.eq(1),
                                    $panelBody = $panelChildren.eq(angular.isUndefined(scope.filterProperty) ? 1 : 2),
                                    $panelFooter = $panelChildren.eq($panelChildren.length - 1);

                                if (angular.isUndefined(scope.filterProperty)) {
                                    $panelBody.css('height', (iElement[0].offsetHeight - $panelHeader[0].offsetHeight - $panelFooter[0].offsetHeight) + 'px');
                                } else {
                                    $panelBody.css('height', (iElement[0].offsetHeight - $panelHeader[0].offsetHeight - $panelFilter[0].offsetHeight - $panelFooter[0].offsetHeight) + 'px');
                                }
                            })
                        }
                    }
                });
            }
        };
    }
};