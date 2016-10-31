module.exports = function(ngModule) {

    ngModule.directive('gdeicPagingAhead', gdeicPagingAheadDirective);

    gdeicPagingAheadDirective.$inject = ['$templateCache'];

    function gdeicPagingAheadDirective($templateCache) {

        $templateCache.put('gdeic/template/paging-ahead.html', require('./template.html'));

        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                size: '@',
                hideAlert: '=',
                pagingList: '=',
                itemPerPages: '=',
                currentPage: '=',
                action: '=',
                method: '@',
                queryData: '=',
                isAlwaysRequest: '='
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/paging-ahead.html';
            },
            controller: ['$scope', '$attrs', '$http', '$q', '$gdeic',
                function($scope, $attrs, $http, $q, $gdeic) {
                    let _aDefaultPages = [1, 2, 3, 4, 5],
                        _queryData = {},
                        _queryPageSizeKey, _queryPageIdxKey,
                        _dataList;

                    let _httpGetData = () => {
                        let manageData = data => {
                            let _data = {};
                            for (let key of Object.keys(data)) {
                                let value = data[key];
                                if (angular.isNumber(value)) {
                                    _data.itemsCount = value;
                                } else if (angular.isArray(value)) {
                                    _data.currentList = value;
                                }
                            }
                            return _data;
                        }

                        let _promise;
                        if (angular.isString($scope.action)) {
                            _promise = $http({
                                url: $scope.action,
                                method: $scope.method,
                                data: _queryData
                            });
                        } else if (angular.isFunction($scope.action)) {
                            _promise = $scope.action(_queryData);
                        }

                        let deferred = $q.defer();

                        $gdeic.httpPromise(_promise)
                            .then(data => manageData(data),
                                err => {
                                    this.isSuccessRequest = false;
                                    deferred.reject(err);
                                })
                            .then((data) => {
                                if (angular.isDefined(data)) {
                                    this.isSuccessRequest = true;
                                    deferred.resolve(data);
                                } else {
                                    this.isSuccessRequest = false;
                                    deferred.reject(data);
                                }
                            });

                        return deferred.promise;
                    }

                    this.totalItemCount = 0;
                    this.pageCount = 0;
                    this.showingPages = _aDefaultPages;
                    this.isSuccessRequest = false;

                    this.setPage = (pageIdx, isResetQuery = false) => {
                        $scope.currentPage = pageIdx;

                        let _startIdx = $scope.itemPerPages * (pageIdx - 1);

                        if (isResetQuery) {
                            _queryData = angular.copy($scope.queryData);
                            _httpGetData()
                                .then(data => {
                                    this.totalItemCount = data.itemsCount;
                                    this.pageCount = Math.ceil(data.itemsCount / $scope.itemPerPages);
                                    this.showingPages = _aDefaultPages.map(x => (Math.ceil(pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);

                                    _dataList = new Array(data.itemsCount);
                                    for (let i = 0, max = $scope.itemPerPages; i < max; i++) {
                                        _dataList[_startIdx + i] = data.currentList[i];
                                    }
                                    $scope.pagingList = _dataList.slice(_startIdx, _startIdx + $scope.itemPerPages);
                                });
                        } else {
                            if ($scope.isAlwaysRequest) {
                                eval(`_queryData${_queryPageSizeKey} = $scope.itemPerPages`);
                                eval(`_queryData${_queryPageIdxKey} = $scope.currentPage`);

                                _httpGetData()
                                    .then(data => {
                                        this.totalItemCount = data.itemsCount;
                                        this.pageCount = Math.ceil(data.itemsCount / $scope.itemPerPages);
                                        this.showingPages = _aDefaultPages.map(x => (Math.ceil(pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);
                                        $scope.pagingList = data.currentList;
                                    });
                            } else {
                                if (angular.isDefined(_dataList[_startIdx])) {
                                    this.showingPages = _aDefaultPages.map(x => (Math.ceil(pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);
                                    $scope.pagingList = _dataList.slice(_startIdx, _startIdx + $scope.itemPerPages);
                                } else {
                                    eval(`_queryData${_queryPageSizeKey} = $scope.itemPerPages`);
                                    eval(`_queryData${_queryPageIdxKey} = $scope.currentPage`);

                                    _httpGetData()
                                        .then(data => {
                                            this.pageCount = Math.ceil(data.itemsCount / $scope.itemPerPages);
                                            this.showingPages = _aDefaultPages.map(x => (Math.ceil(pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);
                                            for (let i = 0, max = $scope.itemPerPages; i < max; i++) {
                                                _dataList[_startIdx + i] = data.currentList[i];
                                                $scope.pagingList = data.currentList;
                                            }
                                        });
                                }
                            }
                        }
                    }

                    (() => {
                        if (angular.isString($scope.action)) {
                            if (angular.isUndefined($scope.method) || ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'].indexOf($scope.method.toUpperCase() < 0)) {
                                $scope.method = 'POST';
                            }
                        } else if (!angular.isFunction($scope.action)) {
                            throw new Error('No url for dynamic paging.');
                        }
                        if ($attrs.itemPerPages.indexOf($attrs.queryData) > -1) {
                            _queryPageSizeKey = $attrs.itemPerPages.replace($attrs.queryData, '');
                        } else {
                            throw new Error('QueryData does not have a property to describe page size');
                        }
                        if ($attrs.currentPage.indexOf($attrs.queryData) > -1) {
                            _queryPageIdxKey = $attrs.currentPage.replace($attrs.queryData, '');
                        } else {
                            throw new Error('QueryData does not have a property to describe page index');
                        }

                        if (!angular.isObject($scope.queryData)) {
                            let _unbindWatcher = $scope.$watch('queryData', (newVal, oldVal) => {
                                if (angular.isObject(newVal)) {
                                    _unbindWatcher();
                                    this.setPage(1, true);
                                }
                            });
                        } else {
                            this.setPage(1, true);
                        }
                    })();

                    $scope.$on('$gdeicPagingAhead', () => {
                        this.setPage(1, true);
                    });
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