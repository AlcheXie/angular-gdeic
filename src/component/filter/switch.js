module.exports = function (ngModule) {
    'use strict';

    ngModule.filter('switch', switch_);

    switch_.$inject = [];

    function switch_() {
        return function (input, rule) {
            var params = rule.split('|'), i = 0, max = params.length, result = '';
            if (angular.isNumber(input)) {
                for (; i < max; i++) {
                    rule = params[i].split(',');
                    if (eval('input' + rule[0])) {
                        result = rule[1].trimAll();
                    }
                }
            } else {
                for (; i < max; i++) {
                    rule = params[i].split(',');
                    if (input === rule[0]) {
                        result = rule[1].trimAll();
                    }
                }
            }
            return result;
        }
    }
};