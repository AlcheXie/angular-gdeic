module.exports = function(ngModule) {

    ngModule.directive('preventPropagation', preventPropagationDirective);

    preventPropagationDirective.$inject = [];

    function preventPropagationDirective() {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                let _eventTypes = iAttrs.preventPropagation.split(',');
                for (let type of _eventTypes) {
                    type = type.trim();
                    iElement.bind(type, (e) => { e.stopPropagation(); });
                }
            }
        };
    }
};