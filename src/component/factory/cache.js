module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$gdeicCache', $gdeicCache);

    $gdeicCache.$inject = ['$cacheFactory', '$q', '$gdeic'];

    function $gdeicCache($cacheFactory, $q, $gdeic) {
        var _cacheKeyList = [],
            _cache = $cacheFactory('gdeicCache'),
            gdeicCache = {
                put: function (key, value) {
                    _cache.put(key, value);
                    $gdeic.toggleItem(_cacheKeyList, key);
                },
                putAsync: function (key, actionFunc, a3, a4) {
                    var params = {}, isAlways;

                    if (angular.isUndefined(a3) && angular.isUndefined(a4)) {
                        isAlways = false;
                    } else if (angular.isDefined(a3) && angular.isUndefined(a4)) {
                        if (angular.isObject(a3)) {
                            params = a3;
                            isAlways = false;
                        } else if (a3 === true || a3 === false) {
                            isAlways = a3;
                        }
                    } else if (angular.isDefined(a3) && angular.isDefined(a4)) {
                        params = a3;
                        isAlways = a4;
                    }
                    isAlways = isAlways || false;

                    var that = this, deferred = $q.defer(), promise;

                    if (isAlways) {
                        promise = $gdeic.httpPromise(actionFunc(params));
                    } else {
                        var value = that.get(key);
                        if (angular.isUndefined(value)) {
                            promise = $gdeic.httpPromise(actionFunc(params));
                        } else {
                            promise = value;
                        }
                    }

                    $q.when(promise).then(function (data) {
                        that.put(key, data);
                        deferred.resolve(data);
                    }, function (reason) {
                        deferred.reject(reason);
                    }, function (msg) {
                        deferred.notify(msg);
                    });

                    return deferred.promise;
                },
                get: _cache.get,
                remove: function (key) {
                    _cache.remove(key);
                    $gdeic.toggleItem(_cacheKeyList, key);
                },
                removeAll: function () {
                    _cache.removeAll();
                    _cacheKeyList = [];
                },
                info: function () {
                    var _info = _cache.info();
                    _info.keys = _cacheKeyList;
                    return _info;
                }
            };

        return gdeicCache;
    }
};