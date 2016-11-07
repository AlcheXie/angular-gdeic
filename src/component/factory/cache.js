module.exports = function(ngModule) {

    ngModule.factory('$gdeicCache', $gdeicCacheFactory);

    $gdeicCacheFactory.$inject = ['$cacheFactory', '$q', '$http', '$gdeic'];

    function $gdeicCacheFactory($cacheFactory, $q, $http, $gdeic) {
        let _cacheKeyList = [],
            _cache = $cacheFactory('gdeicCache');

        let $gdeicCache = {
            put(key, value) {
                _cache.put(key, value);
                $gdeic.toggleItem(_cacheKeyList, key);
            },
            putAsync(key, { url, config = {}, action, data, promise, isAlways = false }) {
                let deferred = $q.defer(),
                    _promise;

                let _getPromise = () => {
                    let promise;
                    if (angular.isDefined(url)) {
                        config = Object.assign({ url: url, method: 'GET' }, config);
                        config.url = url;
                        promise = $gdeic.httpPromise($http(config));
                    } else if (angular.isDefined(action)) {
                        promise = $gdeic.httpPromise(action(data));
                    } else if (angular.isDefined(promise)) {
                        promise = promise;
                    } else {
                        throw new Error('No promise is deferred.')
                    }
                    return promise;
                }

                if (isAlways) {
                    _promise = _getPromise();
                } else {
                    let _value = this.get(key);
                    if (angular.isUndefined(_value)) {
                        _promise = _getPromise();
                    } else {
                        _promise = _value;
                    }
                }

                $q.when(_promise)
                    .then(data => {
                        this.put(key, data);
                        deferred.resolve(data);
                    }, deferred.reject);

                return deferred.promise;
            },
            get: _cache.get,
            remove(key) {
                _cache.remove(key);
                $gdeic.toggleItem(_cacheKeyList, key);
            },
            removeAll() {
                _cache.removeAll();
                _cacheKeyList = [];
            },
            info() {
                let _info = _cache.info();
                _info.keys = _cacheKeyList;
                return _info;
            }
        };

        return $gdeicCache;
    }
};