module.exports = function(angular) {
    'use strict';

    (function(_) {
        Object.defineProperties(_.prototype, {
            intersect: {
                value: function intersect(array) {
                    let _array = [];
                    array = array.map(x => angular.toJson(x));
                    for (let item of this) {
                        let value = angular.copy(item);
                        value = angular.toJson(value);
                        if (array.indexOf(value) > -1) {
                            _array.push(value);
                        }
                    }
                    return _array.map(x => angular.fromJson(x));
                },
                writable: false,
                enumerable: false
            },
            differentiate: {
                value: function differentiate(array) {
                    let _array = [];
                    let that = this.map(x => angular.toJson(x));
                    for (let item of array) {
                        let value = angular.copy(item);
                        value = angular.toJson(value);
                        if (that.indexOf(value) < 0) {
                            _array.push(value);
                        }
                    }
                    array = array.map(x => angular.toJson(x));
                    for (let item of this.reverse()) {
                        let value = angular.copy(item);
                        value = angular.toJson(value);
                        if (array.indexOf(value) < 0) {
                            _array.unshift(value);
                        }
                    }
                    return _array.map(x => angular.fromJson(x));
                },
                writable: false,
                enumerable: false
            },
            union: {
                value: function union(array) {
                    let set = new Set(this.concat(array));
                    return [...set]
                },
                writable: false,
                enumerable: false
            }
        });
    }(Array));
};