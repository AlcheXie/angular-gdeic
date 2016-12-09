module.exports = function(ngModule) {

    ngModule.factory('GdeicGrouping', GdeicGroupingFactory);

    GdeicGroupingFactory.$inject = ['$linq', 'GdeicPaging'];

    function GdeicGroupingFactory($linq, GdeicPaging) {

        class GdeicGrouping extends GdeicPaging {
            constructor(source = [], itemsPerPage = 10, itemsInitPerGroup = 0) {
                let _source,
                    _formatSource = [{ groupTag: null, source: source, isExpand: false, $$index: 0 }];

                super(_formatSource, itemsPerPage);
                this.sourcePaging = new GdeicPaging(source);
                this.groupSettings = null;
                this.itemsInitPerGroup = itemsInitPerGroup;

                _source = angular.copy(_formatSource);
                this.getSource = () => angular.copy(_source);
                this.setSource = newSource => _source = angular.copy(newSource);
            }

            group(groupSettings, isSetSource = false) {
                this.groupSettings = angular.copy(groupSettings);

                let linqSource = $linq.Enumerable().From(this.sourcePaging.pagingList),
                    resultList;

                if (angular.isUndefined(groupSettings)) {
                    resultList = [{ groupTag: null, source: linqSource.ToArray() }];
                } else {
                    resultList = linqSource
                        .GroupBy(x => eval(`x.${groupSettings.key}`))
                        .OrderBy(x => x.Key())
                        .ToArray()
                        .map((x, idx) => {
                            let groupTag = groupSettings.key.indexOf('.') > -1 ? linqSource.Where(y => eval(`y.${groupSettings.name}`) === eval(`x.source[0].${groupSettings.name}`)).First() : `分组${idx + 1}`;

                            return {
                                groupTag: angular.isString(groupTag) ? groupTag : eval(`groupTag.${groupSettings.name}`),
                                source: x.source,
                                isExpand: false,
                                $$index: idx
                            };
                        });
                }

                super.update(resultList);
                if (isSetSource) {
                    this.setSource(resultList);
                }

                return this;
            }

            update(pagingList, isSetSource) {
                let expandList = this.pagingList.map(x => x.isExpand);
                this.sourcePaging.update(pagingList, isSetSource);
                this.group(this.groupSettings);
                this.pagingList = this.pagingList.map((x, idx) => {
                    x.isExpand = expandList[idx];
                    return x;
                });
                this.currentList = this.currentList.map(x => {
                    x.isExpand = this.pagingList[x.$$index].isExpand;
                    return x;
                });

                return this;
            }

            filter(searchParams = this.searchParams) {
                this.sourcePaging.searchParams = angular.copy(searchParams);
                this.sourcePaging.filter();
                this.group(this.groupSettings);

                return this;
            }
        }

        return GdeicGrouping;
    }
};