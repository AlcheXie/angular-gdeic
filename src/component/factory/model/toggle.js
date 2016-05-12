module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cToggleModel', $cToggleModelFactory);

    $cToggleModelFactory.$inject = ['$gdeic'];

    function $cToggleModelFactory($gdeic) {
        function $cToggleModel(a1, a2) {
            var source = [], properties = '';
            if (arguments.length === 1) {
                if (angular.isArray(a1)) {
                    source = a1;
                } else if (angular.isString(a1)) {
                    properties = a1;
                }
            } else if (arguments.length === 2) {
                source = a1;
                properties = a2;
            }

            var _arrProperty = properties.trimAll().split(',');

            this.getProperties = function () {
                return angular.copy(_arrProperty);
            };

            this.items = [];

            var i = 0, max = _arrProperty.length;
            for (; i < max; i++) {
                this[_arrProperty[i] + 's'] = [];
            }
            i = 0;
            max = source ? source.length : 0;
            for (; i < max; i++) {
                this.toggle(source[i]);
            }
        }

        $cToggleModel.prototype.has = function (oItem) {
            return this.items.some(function (item) {
                return angular.toJson(item) === angular.toJson(oItem);
            });
        };
        $cToggleModel.prototype.toggle = function (oItem) {
            var that = this;

            if (angular.isArray(oItem)) {
                angular.forEach(angular.copy(oItem), function (item) {
                    toggleItem(item);
                });
            } else {
                toggleItem(oItem);
            }

            function toggleItem(oItem) {
                var i = 0, arrProperties = that.getProperties(), max = arrProperties.length;
                $gdeic.toggleItem(that.items, oItem);
                for (; i < max; i++) {
                    var property = arrProperties[i];
                    $gdeic.toggleItem(that[property + 's'], oItem, property);
                }
            }

            return this;
        };
        $cToggleModel.prototype.all = function (itemList, isCover) {
            itemList = angular.copy(itemList);
            isCover = isCover || false;

            var i, max;
            if (isCover) {
                this.clear();
                var arrProperties = this.getProperties(), currProperty;
                i = 0; max = arrProperties.length;

                this.items = itemList;
                for (; i < max; i++) {
                    currProperty = arrProperties[i];
                    this[currProperty + 's'] = itemList.map(function (item) {
                        return item[currProperty];
                    });
                }
            } else {
                var currItem;
                i = 0; max = itemList.length;
                for (; i < max; i++) {
                    currItem = itemList[i];
                    if (!this.has(currItem)) {
                        this.toggle(currItem);
                    }
                }
            }

            return this;
        };
        $cToggleModel.prototype.clear = function () {
            this.items = [];
            var i = 0, arrProperties = this.getProperties(), max = arrProperties.length;
            for (; i < max; i++) {
                this[arrProperties[i] + 's'] = [];
            }

            return this;
        };
        $cToggleModel.prototype.toggleAll = function (isSelectAll, itemList, isCover) {
            isCover = isCover || false;
            if (isSelectAll) {
                this.all(itemList, isCover);
            } else {
                if (isCover) {
                    this.clear();
                } else {
                    this.toggle(itemList);
                }
            }

            return this;
        };
        $cToggleModel.prototype.getStringByProperty = function (pName, splitOf) {
            if (this.hasOwnProperty(pName + 's')) {
                return this[pName + 's'].join(splitOf);
            } else {
                return this.items.map(function (item) {
                    return eval('item.' + pName);
                }).join(splitOf);
            }
        };

        return $cToggleModel;
    }
};