module.exports = function(angular) {
    'use strict';

    (function(_) {
        _.defineProperties(_.prototype, {
            formatDate: {
                value: function formatDate() {
                    if (angular.isDate(this)) {
                        return;
                    } else if (angular.isArray(this)) {
                        for (let value of this) {
                            if (angular.isObject(value)) {
                                value.formatDate();
                            }
                        }
                    } else {
                        for (let key of Object.keys(this)) {
                            let value = this[key];
                            if (angular.isString(value) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                                if (value === '1900-01-01T00:00:00' || value === '0001-01-01T00:00:00') {
                                    delete this[key];
                                } else {
                                    if (/T\d{2}:\d{2}:\d{2}$/.test(value)) {
                                        value = `${value}.000Z`;
                                    }
                                    this[key] = new Date(value);
                                }
                            } else if (angular.isObject(value)) {
                                value.formatDate();
                            }
                        }
                    }
                    return this;
                },
                writable: false,
                enumerable: false
            },
            addHours: {
                value: function addHours(diff) {
                    if (angular.isArray(this)) {
                        for (let value of this) {
                            if (angular.isObject(value)) {
                                value.addHours(diff);
                            }
                        }
                    } else {
                        for (let key of Object.keys(this)) {
                            let value = this[key];
                            if (angular.isDate(value)) {
                                this[key] = value.addHours(diff);
                            } else if (angular.isObject(value)) {
                                value.addHours(diff);
                            }
                        }
                    }
                    return this;
                },
                writable: false,
                enumerable: false
            },
            clearProperties: {
                value: function clear() {
                    if (angular.isArray(this)) {
                        this.splice(0, this.length);
                    } else {
                        for (let key of Object.keys(this)) {
                            let value = this[key];
                            if (angular.isObject(value)) {
                                this[key].clearProperties();
                            } else {
                                this[key] = null;
                            }
                        }
                    }
                    return this;
                },
                writable: false,
                enumerable: false
            },
            isClear: {
                value: function() {
                    var p, value;
                    if (angular.isArray(this)) {
                        if (this.length > 0) {
                            return false;
                        }
                    } else {
                        for (let value of Object.values(this)) {
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
                    return true;
                },
                writable: false,
                enumerable: false
            }
        });
    }(Object));
};