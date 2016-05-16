module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicCascade', gdeicCascade);

    gdeicCascade.$inject = ['$templateCache', '$linq', '$gdeic'];

    function gdeicCascade($templateCache, $linq, $gdeic) {
        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                inputClass: '@',
                ngRequired: '=',
                ngDisabled: '=',
                showWhenNoOption: '=',
                modelIsObject: '=',
                keyProperty: '@',
                valueProperty: '@',
                initRefModel: '=',
                initCondition: '@',
                referenceModel: '=',
                targetModel: '=',
                queryList: '&',
                queryParams: '@',
                queryListAsync: '&',
                queryParamsAsync: "@"
            },
            template: function (tElement, tAttrs) {
                var template;

                if (angular.isUndefined(tAttrs.templateUrl)) {
                    template = $templateCache.get('gdeic/controls/template/cascade.html');
                    template = template.replace(/\[\[key\]\]/g, tAttrs.keyProperty);
                    template = template.replace(/\[\[value\]\]/g, tAttrs.valueProperty);
                } else {
                    template = '<span ng-include="\'' + tAttrs.templateUrl + '\'"></span>';
                }

                return template;
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                var _isAsync, _isInit, _initRefModel;

                if (angular.isDefined(scope.queryParams)) {
                    _isAsync = false;
                } else if (angular.isDefined(scope.queryParamsAsync)) {
                    _isAsync = true;
                } else {
                    return;
                }

                _isInit = false;
                if (angular.isDefined(iAttrs.initRefModel)) {
                    var _unbindWatcher = scope.$watch('initRefModel', function (newValue, oldValue) {
                        if (angular.isDefined(newValue) && newValue !== null) {
                            _initRefModel = angular.copy(newValue);
                            _unbindWatcher();
                            _watchModel();
                        } else if (angular.isUndefined(oldValue) && angular.isDefined(newValue)) {
                            _unbindWatcher();
                            _watchModel();
                        }
                    }, true);
                } else {
                    _watchModel();
                    _isInit = true;
                }

                scope.setValue = function () {
                    if (scope.modelIsObject) {
                        scope.targetModel = angular.copy(scope.itemList.filter(function (item) {
                            return item[scope.keyProperty].toString() === scope.selectedModel.toString();
                        })[0]);
                    } else {
                        scope.targetModel = scope.selectedModel;
                    }
                }

                function _watchModel() {
                    if (angular.isDefined(iAttrs.referenceModel) && iAttrs.referenceModel !== '') {
                        scope.$watch('referenceModel', function (newValue, oldeValue) {
                            if (angular.isUndefined(newValue)
                                || (angular.isDefined(newValue) && (newValue === null || newValue === ''))) {
                                scope.itemList = [];
                                scope.selectedModel = '';
                                scope.targetModel = '';
                                return;
                            }

                            if (!_isAsync) {
                                var args = [],
                                    arrProperties = scope.queryParams.trimAll().split(','),
                                    i = 0,
                                    max = arrProperties.length;
                                for (; i < max; i++) {
                                    args.push(newValue[arrProperties[i]]);
                                }

                                scope.itemList = scope.queryList.apply(args);
                                initModel();
                            } else {
                                var obj = angular.fromJson(scope.queryParamsAsync.replace(/'/g, '"'));
                                for (var p in obj) {
                                    if (obj.hasOwnProperty(p)) {
                                        obj[p] = newValue[obj[p].substr(1)];
                                    }
                                }
                                $gdeic.httpPromise(scope.queryListAsync({
                                    $params: obj
                                })).then(function (data) {
                                    scope.itemList = data;
                                    scope.selectedModel = '';
                                    scope.targetModel = '';

                                    initModel();
                                });
                            }

                            function initModel() {
                                if (!_isInit && _initRefModel) {
                                    _isInit = true;
                                    var _linqResult = $linq.Enumerable().From(scope.itemList).Where(function (x) {
                                        return eval(scope.initCondition.replace(/\$\$item/g, 'x').replace(/\$\$initModel/g, '_initRefModel'));
                                    }).ToArray();

                                    if (_linqResult.length > 0) {
                                        scope.targetModel = _linqResult[0];
                                        scope.selectedModel = scope.targetModel[scope.keyProperty].toString();
                                    }
                                }
                            }
                        }, true);
                    }
                }
            }
        };
    }
};