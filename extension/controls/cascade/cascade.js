module.exports = function(ngModule, options) {

    ngModule.directive('gdeicCascade', gdeicCascadeDirective);

    gdeicCascadeDirective.$inject = ['$templateCache'];

    function gdeicCascadeDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/controls/template/cascade.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                ngRequired: '=',
                ngDisabled: '=',
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
                var template = require('../../../src/common/set-directive-template')($templateCache, tAttrs.templateUrl, templateName);
                template = template.replace(/\[\[key\]\]/g, tAttrs.keyProperty);
                template = template.replace(/\[\[value\]\]/g, tAttrs.valueProperty);

                return template;
            },
            replace: true,
            controller: ['$scope', '$attrs', '$linq', '$gdeic',
                function($scope, $attrs, $linq, $gdeic) {
                    let _isAsync = false;
                    if (angular.isDefined($attrs.queryList)) {
                        _isAsync = false;
                    } else if (angular.isDefined($attrs.queryListAsync)) {
                        _isAsync = true;
                    } else {
                        throw new Error('Must have a query method');
                    }

                    let _isInit = false,
                        _initRefModel,
                        _watchModel = () => {
                            if (angular.isDefined($attrs.referenceModel) && $attrs.referenceModel !== '') {
                                let _init = () => {
                                    if (!_isInit && _initRefModel) {
                                        _isInit = true;
                                        let _linqResult = $linq.Enumerable().From(this.itemList).Where(x => eval($scope.initCondition.replace(/\$\$item/g, 'x').replace(/\$\$initModel/g, '_initRefModel'))).ToArray();

                                        if (_linqResult.length > 0) {
                                            $scope.targetModel = _linqResult[0];
                                            this.selectedModel = $scope.targetModel[$scope.keyProperty].toString();
                                        }
                                    }
                                }

                                $scope.$watch('referenceModel', (newVal, oldVal) => {
                                    if (angular.isUndefined(newVal) ||
                                        (angular.isDefined(newVal) && (newVal === null || newVal === ''))) {
                                        this.itemList = [];
                                        this.selectedModel = '';
                                        $scope.targetModel = '';
                                        return;
                                    }

                                    if (!_isAsync) {
                                        this.itemList = $scope.queryList({
                                            $param: newVal[$scope.queryParams.trimAll()]
                                        });
                                        this.selectedModel = '';
                                        $scope.targetModel = '';
                                        _init();
                                    } else {
                                        let _param = angular.fromJson($scope.queryParamsAsync.replace(/'/g, '"'));
                                        for (let key of Object.keys(_param)) {
                                            _param[key] = newVal[_param[key].substr(1)];
                                        }
                                        $gdeic.httpPromise($scope.queryListAsync({
                                            $param: _param
                                        })).then(data => {
                                            this.itemList = data;
                                            this.selectedModel = '';
                                            $scope.targetModel = '';
                                            _init();
                                        });
                                    }
                                }, true);
                            }
                        }

                    if (angular.isDefined($attrs.initRefModel)) {
                        let _unbindWatcher = $scope.$watch('initRefModel', (newVal, oldVal) => {
                            if (angular.isDefined(newVal) && newVal !== null) {
                                _initRefModel = angular.copy(newVal);
                                _unbindWatcher();
                                _watchModel();
                            } else if (angular.isUndefined(oldVal) && angular.isDefined(newVal)) {
                                _unbindWatcher();
                                _watchModel();
                            }
                        }, true);
                    } else {
                        _watchModel();
                        _isInit = true;
                    }

                    this.setValue = () => {
                        $scope.targetModel = angular.copy(this.itemList.filter(x => x[$scope.keyProperty].toString() === this.selectedModel.toString())[0]);
                    }
                }
            ],
            controllerAs: 'vm'
        };
    }
};