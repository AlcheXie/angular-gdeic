module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('autoResize', autoResize);

    autoResize.$inject = ['$window'];

    function autoResize($window) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                var _params = iAttrs.autoResize.trimAll().split(','),
                    _direction = _params[0],
                    _size = parseInt(_params[1]);

                iElement.css('overflow', 'auto');
                resize();
                angular.element($window).bind('resize', resize).bind('hashchange', hashchange);

                function resize() {
                    if (_direction === 'width') {
                        iElement.css('max-width', ($window, innerWidth - _size) + 'px');
                    } else if (_direction === 'height') {
                        iElement.css('max-height', ($window, innerHeight - _size) + 'px');
                    }
                }

                function hashchange() {
                    angular.element($window).unbind('resize', resize).unbind('hashchange', hashchange);
                }
            }
        };
    }
};