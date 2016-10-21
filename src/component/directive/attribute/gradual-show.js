module.exports = function(ngModule) {

    ngModule.directive('gradualShow', gradualShowDirective);

    gradualShowDirective.$inject = ['$animateCss'];

    function gradualShowDirective($animateCss) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                var _isInit = false;

                scope.$watch(iAttrs.gradualShow, function(newValue, oldValue) {
                    if (!_isInit) {
                        if (angular.isUndefined(oldValue) || !oldValue) {
                            iElement.css({ 'opacity': '0', 'zIndex': '-1' });
                        }
                        _isInit = true;
                    }

                    if (angular.isUndefined(oldValue) || newValue === oldValue) { return; }

                    $animateCss(iElement, {
                        to: {
                            opacity: newValue ? 1 : 0,
                            zIndex: newValue ? 99 : -1
                        },
                        duration: 0.2
                    }).start();
                });
            }
        };
    }
};