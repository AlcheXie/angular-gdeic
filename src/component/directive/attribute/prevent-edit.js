module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('preventEdit', preventEdit);

    preventEdit.$inject = [];

    function preventEdit() {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                if ((iElement[0].tagName === 'INPUT' && iElement.attr('type') === 'text') || iElement[0].tagName === 'TEXTAREA') {
                    iElement.bind('focus', function () {
                        iElement.attr('readonly', 'readonly');
                    })
                        .bind('blur', function () {
                            iElement.removeAttr('readonly');
                        });
                }
            }
        };
    }
};