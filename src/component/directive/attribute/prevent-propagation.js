module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('preventPropagation', preventPropagation);

    preventPropagation.$inject = [];

    function preventPropagation() {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                iElement.bind(iAttrs.preventPropagation, function (e) {
                    e.stopPropagation();
                });
            }
        };
    }
};