module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicError', gdeicError);

    gdeicError.$inject = ['$window'];

    function gdeicError($window) {
        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@'
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/error.html';
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                scope.isShowError = false;
                scope.error = null;

                scope.clearMsg = clearMsg;

                scope.$on('httpErrMsg', function (event, data) {
                    if (scope.isShowError) {
                        return;
                    }
                    scope.isShowError = true;
                    scope.error = data;
                });

                function clearMsg() {
                    if (scope.error.StatusCode === -1) {
                        $window.location = 'api/account';
                    } else if (scope.error.StatusCode === 500) {
                        $window.location.reload();
                    }
                    scope.isShowError = false;
                }
            }
        };
    }
};