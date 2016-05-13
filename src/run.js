module.exports = function (ngModule) {
    'use strict';

    ngModule.run(runFunc);

    runFunc.$inject = ['$templateCache'];

    function runFunc($templateCache) {

        require('./run/template')($templateCache);

    }
};