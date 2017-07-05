module.exports = function(ngModule, options) {

    ngModule.directive('gdeicPaging', gdeicPagingDirective);

    gdeicPagingDirective.$inject = ['$templateCache'];

    function gdeicPagingDirective($templateCache) {

        options = options || {};
        let templateName = 'gdeic/template/gdeicPaging.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }

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
                return require('../../../../common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
            },
            replace: true,
            controller: ['$scope', 'GdeicPage', 'GdeicGroup',
                function($scope, GdeicPage, GdeicGroup) {
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

                    $scope.$watch('pagingModel', (newVal, oldVal) => {
                        if (angular.isObject(newVal)) {
                            this.pageCount = Math.ceil(newVal.pagingListLength / newVal.itemsPerPage);
                            if (_isInit) {
                                let _pageIdx = 1;
                                if (this.pageCount < oldVal.currentPage) {
                                    _pageIdx = this.pageCount;
                                } else {
                                    _pageIdx = oldVal.currentPage ? oldVal.currentPage : 1;
                                }
                                this.setPage(_pageIdx);
                                this.showingPages = _aDefaultPages.map(x => (Math.ceil(_pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);
                            } else {
                                this.setPage(1);
                                _isInit = true;
                            }
                        }
                    });

                    if ($scope.editMode) {
                        $scope.$watch('pagingModel.currentList', (newVal, oldVal) => {
                            let _source, _aPageIdx;
                            if (!(angular.isDefined(oldVal) && newVal.length > 0)) { return; }

                            if ($scope.pagingModel.constructor === GdeicPage) {
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
                            } else if ($scope.pagingModel.constructor === GdeicGroup) {
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