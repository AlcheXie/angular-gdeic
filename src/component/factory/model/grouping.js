module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cGroupingModel', $cGroupingModelFactory);

    $cGroupingModelFactory.$inject = ['$linq', '$cPagingModel'];

    function $cGroupingModelFactory($linq, $cPagingModel) {
        function $cGroupingModel(source, itemPerPage, itemsInitPerGroup) {
            var _source;

            if (angular.isUndefined(source)) { source = []; }

            this.sourcePaging = new $cPagingModel(source);
            this.groupSettings = null;
            this.itemsInitPerGroup = itemsInitPerGroup || 0;

            source = [{ groupTag: null, source: source, isExpand: false, $$index: 0 }];
            $cPagingModel.call(this, source, itemPerPage);

            _source = angular.copy(source);

            this.getSource = function () {
                return angular.copy(_source);
            }
            this.setSource = function (newSource) {
                _source = angular.copy(newSource);
            }
        }

        $cGroupingModel.prototype.group = function (groupSettings, isSetSource) {
            isSetSource = isSetSource || false;

            this.groupSettings = angular.copy(groupSettings);

            var linqSource = $linq.Enumerable().From(this.sourcePaging.pagingList), resultList;

            if (angular.isUndefined(groupSettings)) {
                resultList = [{ groupTag: null, source: linqSource.ToArray() }];
            } else {
                resultList = linqSource
                    .GroupBy(function (x) {
                        return eval('x.' + groupSettings.key);
                    })
                    .OrderBy(function (x) {
                        return x.Key();
                    })
                    .ToArray()
                    .map(function (item, index) {
                        var groupTag = groupSettings.key.indexOf('.') > -1 ? linqSource.Where(function (x) {
                            return eval('x.' + groupSettings.name) === eval('item.source[0].' + groupSettings.name);
                        }).First() : '分组' + (index + 1);

                        return {
                            groupTag: angular.isString(groupTag) ? groupTag : eval('groupTag.' + groupSettings.name),
                            source: item.source,
                            isExpand: false,
                            $$index: index
                        };
                    });
            }

            $cPagingModel.prototype.update.call(this, resultList);
            if (isSetSource) {
                this.setSource(resultList);
            }
        };
        $cGroupingModel.prototype.paging = $cPagingModel.prototype.paging;
        $cGroupingModel.prototype.update = function (pagingList, isSetSource) {
            var expandList = this.pagingList.map(function (item) {
                return item.isExpand;
            }),
                that = this;
            this.sourcePaging.update(pagingList, isSetSource);
            this.group(this.groupSettings);
            this.pagingList = this.pagingList.map(function (item, index) {
                item.isExpand = expandList[index];
                return item;
            });
            this.currentList = this.currentList.map(function (item) {
                item.isExpand = that.pagingList[item.$$index].isExpand;
                return item;
            });
        };
        $cGroupingModel.prototype.filter = function () {
            this.sourcePaging.searchParams = angular.copy(this.searchParams);
            this.sourcePaging.filter();
            this.group(this.groupSettings);
        };

        return $cGroupingModel;
    }
};