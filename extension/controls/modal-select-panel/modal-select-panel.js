module.exports = function(ngModule) {

    ngModule.directive('gdeicModalSelectPanel', gdeicModalSelectPanelDirective);

    gdeicModalSelectPanelDirective.$inject = ['$templateCache', '$gdeic'];

    function gdeicModalSelectPanelDirective($templateCache, $gdeic) {

        $templateCache.put('gdeic/controls/template/modal-select-panel.html', require('./template.html'));
        $templateCache.put('gdeic/controls/template/modal-select-panel-multi.html', require('./template-multi.html'));

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
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                var _originalValue;

                (function() {
                    scope.search = {};
                    if (scope.multiSelect === true) {
                        _originalValue = [];
                    } else {
                        _originalValue = {};
                        Object.defineProperty(_originalValue, iAttrs.keyProperty, {
                            value: ''
                        });
                    }
                }());


                scope.$watch('isShow', newVal => {
                    if (newVal) {
                        if (scope.multiSelect === true) {
                            scope.selectedItem = angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : _originalValue;
                        } else {
                            scope.selectedItem = angular.isObject(scope.ngModel) && !angular.isArray(scope.ngModel) ? angular.copy(scope.ngModel) : _originalValue;
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

                scope.isCheck = item => {
                    if (angular.isUndefined(scope.selectedItem) ||
                        angular.isUndefined(item[iAttrs.keyProperty])) {
                        return false;
                    }

                    if (scope.multiSelect === true) {
                        return scope.selectedItem.some(x => x[scope.keyProperty] === item[scope.keyProperty]);
                    } else {
                        return scope.selectedItem[iAttrs.keyProperty] === item[iAttrs.keyProperty];
                    }
                }

                scope.selectItem = item => {
                    if (scope.multiSelect === true) {
                        $gdeic.toggleItem(scope.selectedItem, item);
                    } else {
                        scope.selectedItem = item;
                    }
                }

                scope.clear = () => scope.selectedItem = angular.copy(_originalValue);

                scope.ok = () => {
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