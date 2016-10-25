module.exports = function(ngModule) {

    ngModule.directive('autoResizePaddingY', autoResizePaddingYDirective);

    autoResizePaddingYDirective.$inject = ['$window'];

    function autoResizePaddingYDirective($window) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                let _nPx = 0;
                try {
                    _nPx = parseInt(iAttrs.autoResizePaddingY);
                } catch (err) { throw (err); }

                if (_nPx > 0) {
                    iElement.css('overflow-y', 'auto');

                    let fnResize = () => { iElement.css('max-height', ($window.innerHeight - _nPx) + 'px'); };
                    let fnHashchange = () => { angular.element($window).unbind('resize', fnResize).unbind('hashchange', fnHashchange); }

                    fnResize();
                    angular.element($window).bind('resize', fnResize).bind('hashchange', fnHashchange);
                }
            }
        };
    }
};