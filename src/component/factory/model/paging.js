module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cPagingModel', $cPagingModelFactory);

    $cPagingModelFactory.$inject = ['$linq'];

    function $cPagingModelFactory($linq) {
        function $cPagingModel(source, itemsPerPage) {
            if (!angular.isArray(source)) { source = []; }

            var _source = angular.copy(source.map(function (item, index) {
                item.$$index = index;
                return item;
            }));
            this.getSource = function () {
                return angular.copy(_source);
            }

            this.pagingList = [];
            this.currentList = [];
            this.pagingListLength = 0;
            this.itemsPerPage = itemsPerPage || 10;
            this.currentPage = 1;
            this.searchParams = {};

            $cPagingModel.prototype.update.call(this, _source);

            this.setSource = function (newSourece, searchParams) {
                _source = angular.copy(newSourece);
                this.filter(searchParams);
            }
        }

        $cPagingModel.prototype.paging = function (currentPage) {
            var maxPage = Math.ceil(this.pagingList.length / this.itemsPerPage), startPage;
            if (currentPage > maxPage) {
                currentPage = maxPage;
            }
            startPage = currentPage - 1 < 0 ? 0 : currentPage - 1;

            this.currentList = angular.copy(this.pagingList).splice(startPage * this.itemsPerPage, this.itemsPerPage);

            return this;
        };
        $cPagingModel.prototype.update = function (pagingList, isSetSource) {
            isSetSource = isSetSource || false;

            this.pagingList = pagingList || this.getSource();
            this.pagingListLength = this.pagingList.length;

            var pageCount = Math.ceil(this.pagingListLength / this.itemsPerPage);
            if (pageCount < this.currentPage) {
                this.currentPage = pageCount;
            }
            this.paging(this.currentPage);

            if (isSetSource) {
                this.setSource(pagingList);
            }

            return this;
        };
        $cPagingModel.prototype.filter = function (searchParams) {
            searchParams = searchParams || this.searchParams;
            var condition = _getCondition(searchParams);

            if (angular.toJson(condition) === '{}') {
                this.update();
                return false;
            }
            condition = {
                and: condition.and || {},
                or: condition.or || {}
            }
            if (angular.toJson(condition.and) === '{}' && !angular.isArray(condition.or)) {
                this.update();
                return false;
            }

            var source = $linq.Enumerable().From(this.getSource()), strCondition = '';
            var p, i, max, or, keys, value, arrPs;

            for (p in condition.and) {
                if (condition.and.hasOwnProperty(p)) {
                    strCondition += 'x.' + p + '.indexOf("' + condition.and[p] + '") > -1 &&';
                }
            }

            max = condition.or.length;
            if (max === 0) {
                strCondition = strCondition.substr(0, strCondition.length - 2);
            } else {
                for (i = 0; i < max; i++) {
                    or = condition.or[i];
                    keys = or.keys = or.keys || '';
                    value = or.value = or.value || '';
                    arrPs = keys.replace(/\s/g, '').split(',');
                    arrPs = arrPs.filter(function (str) {
                        return str !== '';
                    });

                    if (arrPs.length > 0) {
                        var j = 0, max2 = arrPs.length;
                        strCondition += '(';
                        for (; j < max2; j++) {
                            strCondition += 'x.' + arrPs[j] + '.indexOf("' + value + '") > -1 ||';
                        }
                        strCondition = strCondition.substr(0, strCondition.length - 2) + ') &&';
                    }
                }
                strCondition = strCondition.substr(0, strCondition.length - 2);
            }

            source = source.Where(function (x) {
                return eval(strCondition);
            });
            this.update(source.ToArray());

            return this;
        };

        function _getCondition(searchParams) {
            searchParams = searchParams || {};

            var arrAnd = [], arrOr = [], condition = {}, p, i, max;
            for (p in searchParams) {
                if (searchParams.hasOwnProperty(p)) {
                    if (p.indexOf('_') < 0) {
                        arrAnd.push(p);
                    } else {
                        arrOr.push(p);
                    }
                }
            }
            if (arrAnd.length > 0) {
                condition.and = {};
                for (i = 0, max = arrAnd.length; i < max; i++) {
                    p = arrAnd[i];
                    condition.and[p] = searchParams[p];
                }
            }
            if (arrOr.length > 0) {
                condition.or = [];
                for (i = 0, max = arrOr.length; i < max; i++) {
                    p = arrOr[i];
                    if (searchParams[p].toString() !== '') {
                        condition.or.push({
                            keys: p.replace(/_/g, ','),
                            value: searchParams[p]
                        });
                    }
                }
                if (condition.or.length === 0) {
                    delete condition.or;
                }
            }

            return condition;
        }

        return $cPagingModel;
    }
};