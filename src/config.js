module.exports = function (ngModule) {
    'use strict';

    ngModule.config(configFunc);

    configFunc.$inject = ['$httpProvider'];

    function configFunc($httpProvider) {
        $httpProvider.interceptors.push('$gdeicHttpErrorInterceptor');
    }
};