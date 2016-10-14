module.exports = function(ngModule) {

    ngModule.provider('$gdeic', $gdeicProvider);

    $gdeicProvider.$inject = [];

    function $gdeicProvider() {
        let _appTitle = '';

        this.setAppTitle = title => {
            _appTitle = title;
            document.title = _appTitle;
        }

        this.$get = $get;

        $get.$inject = ['$rootScope', '$q', '$location', '$timeout', '$uibModal'];

        function $get($rootScope, $q, $location, $timeout, $uibModal) {
            let $gdeic = {
                version: '1.1.0',
                appTitle: _appTitle
            };

            $gdeic.finishInit = () => { $rootScope.finishInit = true; }
            $gdeic.doAfterInit = (callback = angular.noop) => {
                $rootScope.finishInit = $rootScope.finishInit || false;
                if (!$rootScope.finishInit) {
                    let _unbindWatcher = $rootScope.$watch('finishInit', (newValue) => {
                        if (newValue === true) {
                            callback();
                            _unbindWatcher();
                        }
                    });
                } else {
                    callback();
                }
            }

            $gdeic.httpDone = (data = { StatusCode: -9999, ErrorMsg: '没找到数据' }, successCallback = angular.noop, successWithCodeCallback = angular.noop) => {
                if (data.StatusCode >= 0) {
                    if (angular.isFunction(successCallback)) {
                        successCallback(data.Data);
                    }
                } else {
                    if (angular.isFunction(successWithCodeCallback)) {
                        successWithCodeCallback({
                            StatusCode: data.StatusCode,
                            ErrorMsg: data.ErrorMsg
                        });
                    }
                }
            }
            $gdeic.httpPromise = action => {
                let deferred = $q.defer();
                action.$promise
                    .then((data) => {
                        $gdeic.httpDone(data, deferred.resolve, deferred.reject);
                    }, deferred.reject);
                return deferred.promise;
            }
            $gdeic.holdOn = (promise, successCallback = angular.noop, errorCallback = angular.noop) => {
                let deferred = $q.defer();
                $rootScope.$broadcast('holdOn', true);
                promise
                    .then((data) => {
                        successCallback(data);
                        $rootScope.$broadcast('holdOn', false);
                        deferred.resolve(data);
                    }, (response) => {
                        errorCallback(response);
                        $rootScope.$broadcast('holdOn', false);
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            $gdeic.execAsync = callback => $timeout.callback;

            $gdeic.toggleItem = (source = [], item, property) => {
                let _idx, _objToToggle;

                if (angular.isUndefined(property)) {
                    _objToToggle = item;
                    _idx = source.map(item => angular.toJson(item)).indexOf(angular.toJson(_objToToggle));
                } else if (angular.isString(property)) {
                    if (item.hasOwnProperty(property)) {
                        _objToToggle = item[property];
                        _idx = source.indexOf(_objToToggle);
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

                if (_idx > -1) {
                    source.splice(_idx, 1);
                } else {
                    source.push(_objToToggle);
                }

                return true;
            }

            $gdeic.goto = (path, isReplace = false) => {
                $location.path(path);
                if (isReplace) {
                    $location.replace();
                }
            }

            $gdeic.showConfirmDialog = ({
                title = '确认操作',
                message = '当前操作不可撤销， 确认要继续吗？',
                option = {
                    size: 'sm'
                }
            }) => {
                if (!/^(xs|sm|md|lg)$/.test(option.size)) { option.size = 'sm'; }

                return $uibModal.open(Object.assign({
                    template: require('../controller/confirm/template.html'),
                    controller: 'gdeicConfirmController',
                    controllerAs: 'vm',
                    resolve: {
                        title: function() { return title; },
                        message: function() { return message; }
                    },
                    backdrop: 'static'
                }, option));
            }
            $gdeic.showEditDialog = (config = {}, option = {
                size: 'md'
            }) => {
                option = Object.assign({
                    controllerAs: 'vm',
                    backdrop: 'static'
                }, option);

                return $uibModal.open(Object.assign(config, option))
            };

            $gdeic.makeKeyAccept = (callback = angular.noop, keyCode = [13]) => function keyFunc($event) {
                if (keyCode.indexOf($event.keyCode) > -1) {
                    let args = [];
                    for (let i = 1, max = arguments.length; i < max; i++) {
                        args[i - 1] = arguments[i];
                    }
                    callback.apply(args);
                }
            };

            return $gdeic;
        }
    }
};