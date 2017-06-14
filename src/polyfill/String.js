module.exports = function(angular) {
    'use strict';

    (function(_) {
        Object.defineProperties(_.prototype, {
            trimAll: {
                value: function trimAll() {
                    return this.replace(/\s/g, '');
                },
                writable: false,
                enumerable: false
            },
            padStart: {
                value: function padStart(length, padString = ' ') {
                    if (length <= this.length) {
                        return this;
                    }

                    let _padLength = length - this.length;
                    if (_padLength <= padString.length) {
                        return padString.substring(0, _padLength) + this;
                    } else {
                        let _len = Math.floor(_padLength / padString.length),
                            _n = 0,
                            _str = '';
                        while (_n < _len) {
                            _str += padString;
                            _n++;
                        }
                        return _str + padString.substring(0, _padLength - _len * padString.length) + this;
                    }
                },
                writable: false,
                enumerable: false
            },
            padEnd: {
                value: function padEnd(length, padString = ' ') {
                    if (length <= this.length) {
                        return this;
                    }

                    let _padLength = length - this.length;
                    if (_padLength <= padString.length) {
                        return this + padString.substring(0, _padLength);
                    } else {
                        let _len = Math.floor(_padLength / padString.length),
                            _n = 0,
                            _str = '';
                        while (_n < _len) {
                            _str += padString;
                            _n++;
                        }
                        return this + _str + padString.substring(0, _padLength - _len * padString.length);
                    }
                },
                writable: false,
                enumerable: false
            }
        });
    }(String));
};