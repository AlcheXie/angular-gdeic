module.exports = function(ngModule) {

    ngModule.directive('gradualShow', gradualShowDirective);

    gradualShowDirective.$inject = [];

    function gradualShowDirective() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                iElement.addClass('gradual-show');

                let _isInit = false;
                scope.$watch(iAttrs.gradualShow, (newVal, oldVal) => {
                    if (!_isInit) {
                        if (!oldVal) {
                            iElement.addClass('gradual-hide');
                        }
                        _isInit = true;
                    }

                    if (angular.isUndefined(oldVal) || newVal == oldVal) { return; }

                    if (newVal) {
                        iElement.removeClass('gradual-hide');
                    } else {
                        iElement.addClass('gradual-hide');
                    }
                });
            }
        };
    }

    require('./gradual-show.scss');
};