module.exports = function(ngModule, options) {

    ngModule.directive('gdeicError', gdeicErrorDirective);

    gdeicErrorDirective.$inject = ['$templateCache'];

    function gdeicErrorDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/template/gdeicError.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('./styles.scss');
        }

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@'
            },
            templateUrl: function(tElement, tAttrs) {
                return require('../../../../common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
            },
            replace: true,
            controller: ['$scope', '$window', '$gdeic',
                function($scope, $window, $gdeic) {
                    this.isShowError = false;
                    this.error = null;

                    this.clearMsg = () => {
                        if (this.error.StatusCode === -1 && angular.isDefined($gdeic.appData.loginUrl)) {
                            $window.location = $gdeic.appData.loginUrl;
                        } else if (this.error.StatusCode === 500) {
                            $window.location.reload();
                        }
                        this.isShowError = false;
                    }

                    $scope.$on('httpErrMsg', (event, data) => {
                        if (this.isShowError) { return; }
                        this.isShowError = true;
                        this.error = data;
                    });
                }
            ],
            controllerAs: 'vm'
        };
    }
};