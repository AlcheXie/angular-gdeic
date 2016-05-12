module.exports = function (ngModule) {
    'use strict';

    ngModule.service('$gdeic', $gdeic);

    $gdeic.$inject = ['$rootScope', '$q', '$location', '$timeout', '$uibModal'];

    function $gdeic($rootScope, $q, $location, $timeout, $uibModal) {
        this.finishInit = function () {
            $rootScope.finishInit = true;
        };
        this.doAfterInit = function (callback) {
            $rootScope.finishInit = $rootScope.finishInit || false;

            if (!$rootScope.finishInit) {
                var _unbindWatcher = $rootScope.$watch('finishInit', function (newValue) {
                    if (newValue === true) {
                        callback();
                        _unbindWatcher();
                    }
                });
            } else {
                callback();
            }
        };

        this.httpDone = function (data, successCallback, successWithCodeCallback) {
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
        };
        this.httpPromise = function (action) {
            var httpDone = this.httpDone, deferred = $q.defer();
            action.$promise.then(function (data) {
                httpDone(data, function (data) {
                    deferred.resolve(data);
                }, function (err) {
                    deferred.notify(err);
                });
            }, function (response) {
                deferred.reject(response);
            });

            return deferred.promise;
        };
        this.holdOn = function (promise, successCallback, errorCallback) {
            var deferred = $q.defer();
            successCallback = successCallback || angular.noop;
            errorCallback = errorCallback || angular.noop;
            $rootScope.$broadcast('holdOn', true);

            promise.then(function (data) {
                successCallback(data);
                $rootScope.$broadcast('holdOn', false);
                deferred.resolve(data);

            }, function (response) {
                errorCallback(response);
                $rootScope.$broadcast('holdOn', false);
                deferred.reject(response);
            });

            return deferred.promise;
        };
        this.execAsync = function (callback) {
            $timeout(callback);
        };

        this.toggleItem = function (source, item, property) {
            var _array = source || [], _idx, _objToToggle;

            if (angular.isUndefined(property)) {
                _objToToggle = item;
                _idx = _array.map(function (item) {
                    return angular.toJson(item);
                }).indexOf(angular.toJson(_objToToggle));
            } else if (angular.isString(property)) {
                if (item.hasOwnProperty(property)) {
                    _objToToggle = item[property];
                    _idx = _array.indexOf(_objToToggle);
                } else {
                    return false;
                }
            } else {
                return false;
            }

            if (_idx > -1) {
                _array.splice(_idx, 1);
            } else {
                _array.push(_objToToggle);
            }

            return true;
        };

        this.goto = function (path, isReplace) {
            isReplace = isReplace || false;
            $location.path(path);
            if (isReplace) {
                $location.replace();
            }
        };

        this.showConfirmDialog = function (a1, a2, a3) {
            var _title, _message, _size, _reg = /^(xs|sm|md|lg)$/;
            if (arguments.length === 1) {
                if (_reg.test(a1)) {
                    _size = a1;
                } else {
                    _title = a1;
                }
            } else if (arguments.length === 2) {
                _title = a1;
                if (_reg.test(a2)) {
                    _size = a2;
                } else {
                    _message = a2;
                }
            } else {
                _title = a1;
                _message = a2;
                _size = a3;
            }

            _title = _title || '确认删除';
            _message = _message || '当前操作不可撤销， 确认要继续吗？';
            _size = _size || 'sm';

            return $uibModal.open({
                templateUrl: 'gdeic/template/confirm.html',
                controller: 'gdeicConfirmController',
                controllerAs: 'app',
                size: _size,
                backdrop: 'static',
                resolve: {
                    title: function () { return _title; },
                    message: function () { return _message; }
                }
            });
        };
        this.showEditDialog = function (config) {
            config = config || { setting: {}, resolve: {} };
            config.setting.controllerAs = config.setting.controllerAs || 'app';

            var modalObj = {
                size: 'md',
                backdrop: 'static',
                resolve: {}
            },
                setting = config.setting,
                resolve = config.resolve,
                p;
            for (p in setting) {
                modalObj[p] = setting[p];
            }
            modalObj.resolve = resolve;

            return $uibModal.open(modalObj);
        };

        this.makeKeyAccept = function (callback, keyCode) {
            keyCode = keyCode || [13];

            function keyFunc($event) {
                var args = [];
                for (var i = 1, max = arguments.length; i < max; i++) {
                    args[i - 1] = arguments[i];
                }

                if (keyCode.indexOf($event.keyCode) > -1) {
                    callback.apply(args);
                }
            }

            return keyFunc;
        };
    }
};