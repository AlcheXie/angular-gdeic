module.exports = function(ngModule) {

    ngModule.directive('autoResizePaddingX', autoResizePaddingXDirective);

    autoResizePaddingXDirective.$inject = ['$window', '$gdeic'];

    function autoResizePaddingXDirective($window) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                let _nPx = 0;
                try {
                    _nPx = parseInt(iAttrs.autoResizePaddingX);
                } catch (err) { throw (err); }

                if (_nPx > 0) {
                    iElement.css('overflow-x', 'auto');

                    let fnResize = () => { iElement.css('max-width', ($window.innerWidth - _nPx) + 'px'); };
                    let fnHashchange = () => { angular.element($window).unbind('resize', fnResize).unbind('hashchange', fnHashchange); }

                    fnResize();
                    angular.element($window).bind('resize', fnResize).bind('hashchange', fnHashchange);
                }
            }
        };
    }
};