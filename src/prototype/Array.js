module.exports = function (angular) {
    'use strict';

    (function (_) {
        Object.defineProperties(_.prototype, {
            intersect: {
                value: function intersect(arr) {
                    var array = [], i = 0, max = this.length, currItem;
                    arr = arr.map(function (item) {
                        return angular.toJson(item);
                    });
                    for (; i < max; i++) {
                        currItem = angular.toJson(this[i]);
                        if (arr.indexOf(currItem) > -1) {
                            array.push(angular.copy(currItem));
                        }
                    }
                    return array.map(function (item) {
                        return angular.fromJson(item);
                    });
                },
                writable: false,
                enumerable: false
            },
            differentiate: {
                value: function difference(arr) {
                    var array = [], i = 0, max = this.length, currItem;
                    arr = arr.map(function (item) {
                        return angular.toJson(item);
                    });
                    for (; i < max; i++) {
                        currItem = angular.toJson(this[i]);
                        if (arr.indexOf(currItem) < 0) {
                            array.push(angular.copy(currItem));
                        }
                    }
                    return array.map(function (item) {
                        return angular.fromJson(item);
                    });
                },
                writable: false,
                enumerable: false
            }
        });
    } (Array));
};