module.exports = function(ngModule) {

    ngModule.factory('GdeicPage', GdeicPageFactory);

    GdeicPageFactory.$inject = ['$linq'];

    function GdeicPageFactory($linq) {

        let _getCondition = (searchParams = {}) => {
            let _arrAnd = [],
                _arrOr = [],
                condition = {};

            for (let key of Object.keys(searchParams)) {
                if (key.indexOf('_') < 0) {
                    _arrAnd.push(key);
                } else {
                    _arrOr.push(key);
                }
            }
            if (_arrAnd.length > 0) {
                condition.and = {};
                for (let p of _arrAnd) {
                    condition.and[p] = searchParams[p];
                }
            }
            if (_arrOr.length > 0) {
                condition.or = [];
                for (let p of _arrOr) {
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

        class GdeicPage {
            constructor(source, itemsPerPage = 10) {
                if (!angular.isArray(source)) { source = []; }

                let _source = angular.copy(source.map((x, idx) => {
                    x.$$index = idx;
                    return x;
                }));
                this.getSource = () => angular.copy(_source);

                this.pagingList = [];
                this.currentList = [];
                this.pagingListLength = 0;
                this.itemsPerPage = itemsPerPage;
                this.currentPage = 1;
                this.searchParams = {};

                GdeicPage.prototype.update.call(this, _source);

                this.setSource = (newSource, searchParams) => {
                    _source = angular.copy(newSource);
                    this.filter(searchParams);
                }
            }

            paging(pageIndex) {
                let maxPage = Math.ceil(this.pagingList.length / this.itemsPerPage),
                    startPage;
                if (pageIndex > maxPage) { pageIndex = maxPage; }

                this.currentPage = pageIndex;
                startPage = pageIndex - 1 < 0 ? 0 : pageIndex - 1;
                this.currentList = angular.copy(this.pagingList).splice(startPage * this.itemsPerPage, this.itemsPerPage);

                return this;
            }

            update(pagingList = this.getSource()) {
                this.pagingList = pagingList;
                this.pagingListLength = this.pagingList.length;

                let pageCount = Math.ceil(this.pagingListLength / this.itemsPerPage);
                if (pageCount < this.currentPage && pageCount > 0) { this.currentPage = pageCount; }
                if (this.currentPage === 0) { this.currentPage = 1; }
                this.paging(this.currentPage);

                return this;
            }

            filter(searchParams = this.searchParams) {
                let condition = _getCondition(searchParams);

                if (angular.toJson(condition) === '{}') {
                    this.update();
                    return false;
                }
                condition = {
                    and: condition.and || {},
                    or: condition.or || []
                }
                if (angular.toJson(condition.and) === '{}' && !angular.isArray(condition.or)) {
                    this.update();
                    return false;
                }

                let _linqSource = $linq.Enumerable().From(this.getSource()),
                    strCondition = '';

                for (let key of Object.keys(condition.and)) {
                    if (condition.and[key] === undefined || condition.and[key] === null || condition.and[key] === '') { continue; }
                    strCondition += `x.${key}.toString().indexOf('${condition.and[key]}') > -1 &&`;
                }
                if (condition.or.length === 0) {
                    strCondition = strCondition.substr(0, strCondition.length - 2);
                } else {
                    for (let or of condition.or) {
                        let keys = or.keys = or.keys || '',
                            value = or.value = or.value || '',
                            arrPs = keys.replace(/\s/g, '').split(',').filter(x => x !== '');

                        if (arrPs.length > 0) {
                            strCondition += '(';
                            for (let item of arrPs) {
                                if (value === undefined || value === null || value === '') { continue; }
                                strCondition += `x.${item}.toString().indexOf('${value}') > -1 ||`;
                            }
                            strCondition = `${strCondition.substr(0, strCondition.length - 2)}) &&`;
                        }
                    }
                    strCondition = strCondition.substr(0, strCondition.length - 2);
                }
                if (strCondition !== '') {
                    _linqSource = _linqSource.Where(x => eval(strCondition));
                }
                this.update(_linqSource.ToArray());

                return this;
            }
        }

        return GdeicPage;
    }
};