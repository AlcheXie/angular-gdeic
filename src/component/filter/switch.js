module.exports = function(ngModule) {

    ngModule.filter('switch', switchFilter);

    switchFilter.$inject = [];

    function switchFilter() {
        return function(input, rule) {
            let _aRules = rule.split('|'),
                result = '';

            if (angular.isNumber(input)) {
                for (let rule of _aRules) {
                    rule = rule.split(',');
                    if (eval('input' + rule[0])) {
                        result = rule[1].trimAll();
                    }
                }
            } else {
                for (let rule of _aRules) {
                    rule = rule.split(',');
                    if (input === rule[0]) {
                        result = rule[1].trimAll();
                    }
                }
            }
            return result;
        }
    }
};