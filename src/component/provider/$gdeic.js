module.exports = function(ngModule) {

    ngModule.provider('$gdeic', $gdeicProvider);

    $gdeicProvider.$inject = [];

    function $gdeicProvider() {
        let _appTitle = '',
            _loginUrl = '';
        let _timeDiff = -((new Date()).getTimezoneOffset()) / 60;

        this.setAppData = options => {
            _appTitle = document.title = options.appTitle;
            _loginUrl = options.loginUrl;
        }

        this.setTimeDiff = diff => {
            if (angular.isNumber(diff) && (diff > 0 || diff < 24)) {
                _timeDiff = diff;
            }
        }

        this.$get = ['$rootScope', '$q', '$location', '$timeout',
            function($rootScope, $q, $location, $timeout) {
                let $gdeic = {
                    appData: {
                        version: '1.1.0',
                        appTitle: _appTitle,
                        loginUrl: _loginUrl
                    },
                    getTimeDiff() { return _timeDiff; }
                };

                $gdeic.finishInit = () => { $rootScope.finishInit = true; }
                $gdeic.doAfterInit = (callback = angular.noop) => {
                    $rootScope.finishInit = $rootScope.finishInit || false;
                    if (!$rootScope.finishInit) {
                        let _fUnbindWatcher = $rootScope.$watch('finishInit', (newVal) => {
                            if (newVal === true) {
                                callback();
                                _fUnbindWatcher();
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
                $gdeic.httpPromise = promise => {
                    let deferred = $q.defer();

                    if (angular.isDefined(promise.$promise)) {
                        promise = promise.$promise;
                    } else {
                        promise = promise.then(response => response.data);
                    }

                    promise
                        .then(data => {
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
                $gdeic.execAsync = callback => { $timeout(callback); }

                $gdeic.toggleItem = (source = [], item, property) => {
                    let _nIdx, _oToggle;

                    if (angular.isUndefined(property)) {
                        _oToggle = item;
                        _nIdx = source.map(item => angular.toJson(item)).indexOf(angular.toJson(_oToggle));
                    } else if (angular.isString(property)) {
                        if (item.hasOwnProperty(property)) {
                            _oToggle = item[property];
                            _nIdx = source.indexOf(_oToggle);
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }

                    if (_nIdx > -1) {
                        source.splice(_nIdx, 1);
                    } else {
                        source.push(_oToggle);
                    }

                    return true;
                }

                $gdeic.makeKeyAccept = (callback = angular.noop, keyCode = [13]) => function keyFunc($event) {
                    if (keyCode.indexOf($event.keyCode) > -1) {
                        let _aArg = [];
                        for (let i = 1, max = arguments.length; i < max; i++) {
                            _aArg[i - 1] = arguments[i];
                        }
                        callback.apply(_aArg);
                    }
                };

                return $gdeic;
            }
        ];
    }
};