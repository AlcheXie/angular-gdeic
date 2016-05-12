module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cEditModel', $cEditModelFactory);

    $cEditModelFactory.$inject = ['$q', '$gdeic', '$cToggleModel'];

    function $cEditModelFactory($q, $gdeic, $cToggleModel) {
        function $cEditModel(source) {
            var p;
            if (angular.isArray(source)) {
                var array = angular.copy(source), prototype = $cEditModel.prototype;
                for (p in prototype) {
                    if (prototype.hasOwnProperty(p)) {
                        array[p] = prototype[p];
                    }
                }
                return array;
            }

            for (p in source) {
                if (source.hasOwnProperty(p)) {
                    if (angular.isArray(source[p])) {
                        this['$$' + p] = new $cToggleModel(source[p], 'Id');
                        this['$$' + p].$$isBind = true;
                        this[p] = this['$$' + p].items;
                    } else {
                        this[p] = source[p];
                    }
                }
            }
            return this;
        }

        $cEditModel.prototype.setToggle = function (name, a2, a3) {
            var properties, isBind;
            if (angular.isUndefined(a2)) {
                properties = 'Id';
                isBind = false;
            } else {
                if (angular.isString(a2)) {
                    properties = a2;
                    isBind = a3 || false;
                } else {
                    properties = 'Id';
                    isBind = a2 || false;
                }
            }

            this['$$' + name] = new $cToggleModel(this[name], properties);
            this['$$' + name].$$isBind = isBind;
            if (isBind === true) {
                this[name] = this['$$' + name].items;
            }

            return this;
        };
        $cEditModel.prototype.unbindToggle = function (name) {
            this['$$' + name].$$isBind = false;

            return this;
        };
        $cEditModel.prototype.fire = function (actionFunc, paramsConfig) {
            var deferred = $q.defer(), promise, obj, p, i = 0, max, arrPromises = [], that;

            if (arguments.length === 0) {
                that = angular.copy(this);
                if (angular.isArray(that)) {
                    for (p in that) {
                        if (that.hasOwnProperty(p) && !/^\d+$/.test(p)) {
                            delete that[p];
                        }
                    }
                    deferred.resolve(that);
                } else {
                    for (p in that) {
                        if (that.hasOwnProperty(p) && angular.isObject(that[p]) && !angular.isArray(that[p]) && !angular.isDate(that[p]) && that[p].isClear()) {
                            delete that[p];
                        }
                        if (that.hasOwnProperty(p) && /\$\$/.test(p) && that.hasOwnProperty(p.substr(2)) && that[p].$$isBind) {
                            that[p.substr(2)] = that[p].items;
                        }
                    }
                    for (p in that) {
                        if (that.hasOwnProperty(p) && /\$\$/.test(p)) {
                            delete that[p];
                        }
                    }
                    deferred.resolve(that);
                }
                return deferred.promise;
            }

            if (angular.isArray(this)) {
                max = this.length;
                if (paramsConfig.constructor === Object) {
                    for (; i < max; i++) {
                        obj = angular.copy(paramsConfig);
                        for (p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                obj[p] = this[i][obj[p].substr(1)];
                            }
                        }
                        arrPromises.push($gdeic.httpPromise(actionFunc(obj)));
                    }
                    return $q.all(arrPromises);
                } else if (paramsConfig === true) {
                    for (; i < max; i++) {
                        arrPromises.push($gdeic.httpPromise(actionFunc(this[i])));
                    }
                    return $q.all(arrPromises);
                } else {
                    for (; i < max; i++) {
                        arrPromises.push($gdeic.httpPromise(actionFunc()));
                    }
                    return $q.all(arrPromises);
                }
            } else if (angular.isObject(this)) {
                if (paramsConfig.constructor === Object) {
                    obj = angular.copy(paramsConfig);
                    for (p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            obj[p] = this[obj[p].substr(1)];
                        }
                    }
                    promise = $gdeic.httpPromise(actionFunc(obj));
                } else if (paramsConfig === true) {
                    that = angular.copy(this);
                    for (p in that) {
                        if (that.hasOwnProperty(p) && angular.isObject(that[p]) && !angular.isArray(that[p]) && !angular.isDate(that[p]) && that[p].isClear()) {
                            delete that[p];
                        }
                        if (that.hasOwnProperty(p) && /\$\$/.test(p) && that.hasOwnProperty(p.substr(2)) && that[p].$$isBind) {
                            that[p.substr(2)] = that[p].items;
                        }
                    }
                    promise = $gdeic.httpPromise(actionFunc(that));
                } else {
                    promise = $gdeic.httpPromise(actionFunc());
                }

                promise.then(function (data) {
                    deferred.resolve(data);
                }, function (reason) {
                    deferred.reject(reason);
                }, function (msg) {
                    deferred.notify(msg);
                });

                return deferred.promise;
            } else {
                deferred.reject('No object to edit.');
                return deferred.promise;
            }
        };

        return $cEditModel;
    }
};