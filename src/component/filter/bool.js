module.exports = function(ngModule) {

    ngModule.filter('bool', boolFilter);

    boolFilter.$inject = [];

    function boolFilter() {
        return function(input, rule = '是|否') {
            let _aRules = rule.split('|');
            return input === true ? _aRules[0].trimAll() : _aRules[1].trimAll();
        };
    }
};