module.exports = function(ngModule) {

    ngModule.factory('$gdeicCache', $gdeicCacheFactory);

    $gdeicCacheFactory.$inject = ['$cacheFactory', '$q', '$gdeic'];

    function $gdeicCacheFactory($cacheFactory, $q, $gdeic) {
        let _cacheKeyList = [],
            _cache = $cacheFactory('gdeicCache');

        let $gdeicCache = {
            put(key, value) {
                _cache.put(key, value);
                $gdeic.toggleItem(_cacheKeyList, key);
            },
            putAsync({ key, actionFn, params, isAlways = false }) {
                let deferred = $q.defer(),
                    _promise;

                if (isAlways) {
                    _promise = $gdeic.httpPromise(actionFn(params));
                } else {
                    let _value = this.get(key);
                    if (angular.isUndefined(value)) {
                        _promise = $gdeic.httpPromise(actionFn(params));
                    } else {
                        _promise = value;
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