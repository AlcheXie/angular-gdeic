module.exports = function(ngModule) {

    ngModule.factory('GdeicPulling', GdeicPullingFactory);

    GdeicPullingFactory.$inject = [];

    function GdeicPullingFactory() {
        class GdeicPulling {
            constructor(source = [], itemsPerTime = 20) {
                if (!angular.isArray(source)) {
                    source = [];
                }

                this.itemsPerTime = itemsPerTime;
                this.showingList = source.slice(0, this.itemsPerTime);
                this.hidingList = source.slice(this.itemsPerTime, source.length);
            }

            getSoucrce() {
                return angular.copy(this.showingList.concat(this.hidingList));
            }

            pulling() {
                if (this.hidingList.length > 0) {
                    this.tempList = angular.copy(this.hidingList);
                    for (let i = 0, max = this.hidingList.length > this.itemsPerTime ? this.itemsPerTime : this.hidingList.length; i < max; i++) {
                        this.showingList.push(this.tempList[i]);
                    }
                    this.hidingList = this.tempList.slice(this.itemsPerTime, this.tempList.length);
                    delete this.tempList;
                }

                return this;
            }
        }

        return GdeicPulling;
    }
};