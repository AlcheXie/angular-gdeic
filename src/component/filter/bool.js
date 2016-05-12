module.exports = function (ngModule) {
    'use strict';

    ngModule.filter('bool', bool);

    bool.$inject = [];

    function bool() {
        return function (input, rule) {
            rule = rule || '是|否';
            var params = rule.split('|');
            return (input === true) ? params[0].trimAll() : params[1].trimAll();
        };
    }
};