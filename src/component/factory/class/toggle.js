module.exports = function(ngModule) {

    ngModule.factory('GdeicToggle', GdeicToggleFactory);

    GdeicToggleFactory.$inject = ['$gdeic'];

    function GdeicToggleFactory($gdeic) {
        class GdeicToggle {
            constructor(argument1, argument2) {
                let _source = [],
                    _properties = '';
                if (arguments.length === 1) {
                    if (angular.isArray(argument1)) {
                        _source = argument1;
                    } else if (angular.isString(argument1)) {
                        _properties = argument1;
                    }
                } else if (arguments.length === 2) {
                    _source = argument1;
                    _properties = argument2;
                }

                let _arrProperty = _properties.trimAll().split(',');
                this.getProperties = () => angular.copy(_arrProperty);
                this.items = [];

                for (let value of _arrProperty) {
                    this[`${value}s`] = [];
                }
                for (let value of _source) {
                    this.toggle(value);
                }
            }

            has(item) {
                return this.items.some(x => angular.toJson(x) === angular.toJson(item));
            }

            toggle(item) {
                let _toggleItem = item => {
                    $gdeic.toggleItem(this.items, item);
                    for (let property of this.getProperties()) {
                        $gdeic.toggleItem(this[`${property}s`], item, property);
                    }
                }

                if (angular.isArray(item)) {
                    angular.forEach(angular.copy(item), x => _toggleItem(x));
                } else {
                    _toggleItem(item);
                }
                return this;
            }

            toggleAll(isSelectAll, itemList, isCover = false) {
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
            }

            all(itemList, isCover = false) {
                itemList = angular.copy(itemList);
                if (isCover) {
                    this.clear();
                    this.items = itemList;

                    let _arrProperties = this.getProperties();
                    for (let property of _arrProperties) {
                        this[`${property}s`] = itemList.map(x => x[property]);
                    }
                } else {
                    for (let item of itemList) {
                        if (!this.has(item)) {
                            this.toggle(item);
                        }
                    }
                }
                return this;
            }

            clear() {
                this.items = [];
                let _arrProperties = this.getProperties();
                for (let property of _arrProperties) {
                    this[`${property}s`] = [];
                }
                return this;
            }

            getStringByProperty(propertyName, splitOf = ',') {
                if (this.hasOwnProperty(`${propertyName}s`)) {
                    return this[`${propertyName}s`].join(splitOf);
                } else {
                    return this.items.map(x => eval(`x.${propertyName}`)).join(splitOf);
                }
            }
        }

        return GdeicToggle;
    }
};