module.exports = function(ngModule, options) {

    ngModule.directive('gdeicLoading', gdeicLoadingDirective);

    gdeicLoadingDirective.$inject = ['$templateCache'];

    function gdeicLoadingDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/template/gdeicLoading.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('./styles.scss');
        }

        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                templateUrl: '@',
                isLoading: '=',
                loadingText: '@'
            },
            templateUrl: function(tElement, tAttrs) {
                return require('../../../../common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
            },
            replace: true
        };
    }
};
