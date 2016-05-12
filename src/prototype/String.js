module.exports = function (angular) {
    'use strict';

    (function (_) {
        Object.defineProperties(_.prototype, {
            trimAll: {
                value: function trimAll() {
                    return this.replace(/\s/g, '');
                },
                writable: false,
                enumerable: false
            },
            padStart: {
                value: function padStart(length, string) {
                    string = string || ' ';
                    if (length <= this.length) {
                        return this;
                    }

                    var padLength = length - this.length;
                    if (padLength <= string.length) {
                        return string.substring(0, padLength) + this;
                    } else {
                        var len = Math.floor(padLength / string.length), i = 0, str = '';
                        while (i < len) {
                            str += string;
                            i++;
                        }
                        return str + string.substring(0, padLength - len * string.length) + this;
                    }
                },
                writable: false,
                enumerable: false
            },
            padEnd: {
                value: function padEnd(string) {
                    string = string || ' ';
                    if (length <= this.length) {
                        return this;
                    }

                    var padLength = length - this.length;
                    if (padLength <= string.length) {
                        return this + string.substring(0, padLength);
                    } else {
                        var len = Math.floor(padLength / string.length), i = 0, str = '';
                        while (i < len) {
                            str += string;
                            i++;
                        }
                        return this + str + string.substring(0, padLength - len * string.length);
                    }
                },
                writable: false,
                enumerable: false
            }
        });
    } (String));
};