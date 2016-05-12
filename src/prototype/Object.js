module.exports = function (angular) {
    'use strict';

    (function (_) {
        _.defineProperties(_.prototype, {
            formatDate: {
                value: function formatDate() {
                    var i, max, p, value;
                    if (angular.isArray(this)) {
                        for (i = 0, max = this.length; i < max; i++) {
                            value = this[i];
                            if (angular.isObject(value)) {
                                value.formatDate();
                            }
                        }
                    } else {
                        for (p in this) {
                            if (this.hasOwnProperty(p)) {
                                value = this[p];
                                if (angular.isString(value) && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                                    if (value === '1900-01-01T00:00:00' || value === '0001-01-01T00:00:00') {
                                        delete this[p];
                                    } else {
                                        this[p] = new Date(this[p]);
                                    }
                                } else if (angular.isObject(value)) {
                                    value.formatDate();
                                }
                            }
                        }
                    }
                },
                writable: false,
                enumerable: false
            },
            clearProperties: {
                value: function clear() {
                    var p, value;
                    if (angular.isArray(this)) {
                        this.splice(0, this.length);
                    } else {
                        for (p in this) {
                            if (this.hasOwnProperty(p)) {
                                value = this[p];
                                if (angular.isObject(value)) {
                                    this[p].clearProperties();
                                } else {
                                    this[p] = null;
                                }
                            }
                        }
                    }
                },
                writable: false,
                enumerable: false
            },
            isClear: {
                value: function () {
                    var p, value;
                    if (angular.isArray(this)) {
                        if (this.length > 0) {
                            return false;
                        }
                    } else {
                        for (p in this) {
                            if (this.hasOwnProperty(p)) {
                                value = this[p];
                                if (angular.isObject(value)) {
                                    if (!value.isClear()) {
                                        return false;
                                    }
                                } else if (!angular.isDate(value)) {
                                    if (angular.isDefined(value) && value !== null) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    return true;
                },
                writable: false,
                enumerable: false
            }
        });
    } (Object));
};