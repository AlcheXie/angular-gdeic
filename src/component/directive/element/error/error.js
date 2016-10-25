module.exports = function(ngModule) {

    ngModule.directive('gdeicError', gdeicErrorDirective);

    gdeicErrorDirective.$inject = ['$templateCache', '$window'];

    function gdeicErrorDirective($templateCache, $window) {

        $templateCache.put('gdeic/template/error.html', require('./template.html'));

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@'
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/error.html';
            },
            replace: true,
            controller: ['$scope', '$window', function($scope, $window) {
                this.isShowError = false;
                this.error = null;

                this.clearMsg = () => {
                    if (this.error.StatusCode === -1) {
                        $window.location = 'api/account';
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
            }],
            controllerAs: 'vm'
        };
    }

    require('./error.scss');
};