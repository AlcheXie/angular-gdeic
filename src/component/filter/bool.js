module.exports = function (ngModule) {
    'use strict';

    ngModule.filter('bool', boolFilter);

    boolFilter.$inject = [];

    function boolFilter() {
        return function (input, rule) {
            rule = rule || '是|否';
            var params = rule.split('|');
            return (input === true) ? params[0].trimAll() : params[1].trimAll();
        };
    }
};