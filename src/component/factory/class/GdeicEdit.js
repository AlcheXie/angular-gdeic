module.exports = function(ngModule) {

    ngModule.factory('GdeicEdit', GdeicEditFactory);

    GdeicEditFactory.$inject = ['$q', '$http', '$gdeic', 'GdeicToggle'];

    function GdeicEditFactory($q, $http, $gdeic, GdeicToggle) {
        class GdeicEdit {
            constructor(source) {
                if (angular.isArray(source)) {
                    source = angular.copy(source);
                    source.fire = GdeicEdit.prototype.fire;
                    return source;
                } else if (angular.isObject(source)) {
                    for (let key of Object.keys(source)) {
                        if (angular.isArray(source[key])) {
                            this[`$$${key}`] = new GdeicToggle(source[key], 'Id');
                            this[`$$${key}`].$$isBind = true;
                            this[key] = this[`$$${key}`].items;
                        } else {
                            this[key] = source[key];
                        }
                    }
                }
            }

            setToggle(name, { properties = 'Id', isBind = false }) {
                if (angular.isArray(this)) { return this; }

                this[`$$${name}`] = new GdeicToggle(this[name], properties);
                this[`$$${name}`].$$isBind = isBind;
                if (isBind === true) {
                    this[name] = this[`$$${name}`].items;
                }

                return this;
            }

            unbindToggle(name) {
                this[`$$${name}`].$$isBind = false;

                return this;
            }

            fire({ url, config = {}, action, params, method } = {}) {
                let deferred = $q.defer(),
                    _promise;
                let _getType = () => {
                    if (angular.isDefined(url)) {
                        config = Object.assign({ url: url }, config);
                        return 0;
                    } else if (angular.isDefined(action)) {
                        return 1;
                    } else if (angular.isDefined(method)) {
                        return 2;
                    } else {
                        return -1;
                    }
                }

                if (angular.isArray(this)) {
                    let _data;
                    if (params.constructor === Object) {
                        _data = this.map(x => {
                            let _obj = angular.copy(params);
                            for (let key of Object.keys(_obj)) {
                                _obj[key] = x[_obj[key].substr(1)];
                            }
                            return _obj;
                        });
                    } else if (params === true) {
                        _data = angular.copy(this);
                    }

                    switch (_getType()) {
                        case 0:
                            if (params.constructor === Object) {
                                config = Object.assign({ method: 'GET' }, config);
                            } else {
                                config = Object.assign({ method: 'POST' }, config);
                            }
                            _promise = _data.map(x => $gdeic.httpPromise($http(Object.assign(config, { data: x }))));
                            break;
                        case 1:
                            _promise = _data.map(x => $gdeic.httpPromise(action(x)));
                            break;
                        case 2:
                            _promise = _data.map(x => method(x));
                            break;
                        default:
                            _data = angular.copy(this);
                            for (let key of Object.keys(_data)) {
                                if (/\$\$/.test(key)) {
                                    delete _data[key];
                                }
                            }
                            _promise = _data.map(x => $q.when(x));
                            break;
                    }

                    return $q.all(_promise);
                } else if (angular.isObject(this)) {
                    let _data;
                    if (angular.isUndefined(params) || params === true) {
                        _data = angular.copy(this);
                        for (let key of Object.keys(_data)) {
                            if (angular.isDefined(_data[key]) && _data[key] !== null && _data[key].constructor === Object && _data[key].isClear()) {
                                delete _data[key];
                            }
                            if (/\$\$/.test(key) && _data.hasOwnProperty(key.substr(2)) && _data[key].$$isBind) {
                                _data[key.substr(2)] = _data[key].items;
                            }
                        }
                    } else if (params.constructor === Object) {
                        _data = angular.copy(params);
                        for (let key of Object.keys(params)) {
                            _data[key] = this[_data[key].substr(1)];
                        }
                    }

                    switch (_getType()) {
                        case 0:
                            if (params.constructor === Object) {
                                config = Object.assign({ method: 'GET' }, config, { data: _data });
                            } else {
                                config = Object.assign({ method: 'POST' }, config, { data: _data });
                            }
                            _promise = $gdeic.httpPromise($http(config));
                            break;
                        case 1:
                            _promise = $gdeic.httpPromise(action(_data));
                            break;
                        case 2:
                            _promise = method(_data);
                            break;
                        default:
                            for (let key of Object.keys(_data)) {
                                if (/\$\$/.test(key)) {
                                    delete _data[key];
                                }
                            }
                            _promise = $q.when(_data);
                            break;
                    }

                    _promise.then(deferred.resolve, deferred.reject);
                    return deferred.promise;
                } else {
                    deferred.reject('No object to edit.');
                    return deferred.promise;
                }
            }
        }

        return GdeicEdit;
    }
};