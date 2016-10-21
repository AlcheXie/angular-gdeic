module.exports = function(ngModule) {

    ngModule.directive('preventPropagation', preventPropagationDirective);

    preventPropagationDirective.$inject = [];

    function preventPropagationDirective() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                iElement.bind(iAttrs.preventPropagation, function(e) {
                    e.stopPropagation();
                });
            }
        };
    }
};