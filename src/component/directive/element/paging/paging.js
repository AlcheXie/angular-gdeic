module.exports = function(ngModule) {

    ngModule.directive('gdeicPaging', gdeicPagingDirective);

    gdeicPagingDirective.$inject = ['$templateCache'];

    function gdeicPagingDirective($templateCache) {

        $templateCache.put('gdeic/template/paging.html', require('./template.html'));

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                size: '@',
                hideAlert: '=',
                pagingModel: '=',
                editMode: '='
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/paging.html';
            },
            replace: true,
            controller: ['$scope', '$cPagingModel', '$cGroupingModel',
                function($scope, $cPagingModel, $cGroupingModel) {
                    let _aDefaultPages = [1, 2, 3, 4, 5],
                        _isInit = false;

                    this.pageCount = 0;
                    this.showingPages = _aDefaultPages;

                    this.setPage = pageIdx => {
                        if (pageIdx < 1 || pageIdx > this.pageCount) { return; }

                        $scope.pagingModel.paging(pageIdx);

                        if (!_isInit || (_isInit && (pageIdx > this.showingPages[this.showingPages.length - 1] || pageIdx < this.showingPages[0]))) {
                            this.showingPages = _aDefaultPages.map(x => (Math.ceil(pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);
                        }
                    }

                    let _unbindWatcher = $scope.$watch('pagingModel', (newVal, oldVal) => {
                        if (angular.isObject(newVal)) {
                            _unbindWatcher();
                            this.pageCount = Math.ceil(newVal.pagingListLength / newVal.itemsPerPage);
                            this.setPage(1);
                            _isInit = true;
                        }
                    });

                    if ($scope.editMode) {
                        $scope.$watch('pagingModel.currentList', (newVal, oldVal) => {
                            let _source, _aPageIdx;
                            if (!(angular.isDefined(oldVal) && newVal.length > 0)) { return; }

                            if ($scope.pagingModel.constructor = $cPagingModel) {
                                _source = $scope.pagingModel.getSource();
                                _aPageIdx = $scope.pagingModel.pagingList.map(x => x.$$index);

                                if (angular.equals(oldVal.map(x => x.$$index), newVal.map(x => x.$$index))) {
                                    for (let item of newVal) {
                                        let _nidx = item.$$index;
                                        _source[_nidx] = item;
                                        $scope.pagingModel.pagingList[_aPageIdx.indexOf(_nidx)] = item;
                                    }
                                    $scope.pagingModel.setSource(_source);
                                }
                            } else if ($scope.pagingModel.constructor === $cGroupingModel) {
                                for (let item of newVal) {
                                    $scope.pagingModel.pagingList[item.$$index].isExpand = item.isExpand;
                                }
                            }
                        }, true)
                    }
                }
            ],
            controllerAs: 'vm',
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                let $elem = angular.element(iElement[0].previousElementSibling);
                if ($elem.hasClass('table')) {
                    $elem.css('margin-bottom', 0);
                }
            }
        };
    }
};