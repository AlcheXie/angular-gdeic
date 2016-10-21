module.exports = function(ngModule) {

    ngModule.directive('gdeicCascade', gdeicCascadeDirective);

    gdeicCascadeDirective.$inject = ['$templateCache', '$linq', '$gdeic'];

    function gdeicCascadeDirective($templateCache, $linq, $gdeic) {

        $templateCache.put('gdeic/controls/template/cascade.html', require('./template.html'));

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
            template: function(tElement, tAttrs) {
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
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                let _isAsync = false;
                if (angular.isDefined(scope.queryParams)) {
                    _isAsync = false;
                } else if (angular.isDefined(scope.queryParamsAsync)) {
                    _isAsync = true;
                } else {
                    throw new Error('Must have a query method');
                }

                let _isInit = false,
                    _initRefModel,
                    _watchModel = () => {
                        if (angular.isDefined(iAttrs.referenceModel) && iAttrs.referenceModel !== '') {
                            let _init = () => {
                                if (!_isInit && _initRefModel) {
                                    _isInit = true;
                                    let _linqResult = $linq.Enumerable().From(scope.itemList).Where(x => eval(scope.initCondition.replace(/\$\$item/g, 'x').replace(/\$\$initModel/g, '_initRefModel'))).ToArray();

                                    if (_linqResult.length > 0) {
                                        scope.targetModel = _linqResult[0];
                                        scope.selectedModel = scope.targetModel[scope.keyProperty].toString();
                                    }
                                }
                            }

                            scope.$watch('referenceModel', (newValue, oldeValue) => {
                                if (angular.isUndefined(newValue) ||
                                    (angular.isDefined(newValue) && (newValue === null || newValue === ''))) {
                                    scope.itemList = [];
                                    scope.selectedModel = '';
                                    scope.targetModel = '';
                                    return;
                                }
    
                                if (!_isAsync) {
                                    let args = [],
                                        arrProperties = scope.queryParams.trimAll().split(','),
                                        i = 0,
                                        max = arrProperties.length;
                                    for (; i < max; i++) {
                                        args.push(newValue[arrProperties[i]]);
                                    }
    
                                    scope.itemList = scope.queryList.apply(args);
                                    _init();
                                } else {
                                    let obj = angular.fromJson(scope.queryParamsAsync.replace(/'/g, '"'));
                                    for (let p of Object.keys(obj)) {
                                        obj[p] = newValue[obj[p].substr(1)];
                                    }
                                    $gdeic.httpPromise(scope.queryListAsync({
                                        $params: obj
                                    })).then(function(data) {
                                        scope.itemList = data;
                                        scope.selectedModel = '';
                                        scope.targetModel = '';
    
                                        _init();
                                    });
                                }
                            }, true);
                        }
                    }

                if (angular.isDefined(iAttrs.initRefModel)) {
                    let _unbindWatcher = scope.$watch('initRefModel', (newValue, oldValue) => {
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

                scope.setValue = () => {
                    if (scope.modelIsObject) {
                        scope.targetModel = angular.copy(scope.itemList.filter(x => x[scope.keyProperty].toString() === scope.selectedModel.toString())[0]);
                    } else {
                        scope.targetModel = scope.selectedModel;
                    }
                }
            }
        };
    }
};