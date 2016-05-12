module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cPullingModel', $cPullingModelFactory);

    $cPullingModelFactory.$inject = [];

    function $cPullingModelFactory() {
        function $cPullingModel(source, itemsPerTime) {
            if (!angular.isArray(source)) {
                source = [];
            }

            var _source = angular.copy(source);
            this.getSource = function () {
                return angular.copy(_source);
            }

            this.showingList = source.slice(0, itemsPerTime);
            this.hidingList = source.slice(itemsPerTime, source.length);
            this.itemsPerTime = itemsPerTime || 20;
        }

        $cPullingModel.prototype.pulling = function () {
            if (this.hidingList.length === 0) {
                return;
            }

            this.tempList = angular.copy(this.hidingList);
            for (var i = 0, max = this.hidingList.length > this.itemsPerTime ? this.itemsPerTime : this.hidingList.length; i < max; i++) {
                var tempObj = this.tempList[i];
                this.showingList.push(tempObj);
            }
            this.hidingList = this.tempList.slice(this.itemsPerTime, this.tempList.length);
            delete this.tempList;

            return this;
        };

        return $cPullingModel;
    }
};