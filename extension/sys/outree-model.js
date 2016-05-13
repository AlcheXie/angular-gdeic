module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cOutreeModel', $cOutreeModelFactory);

    $cOutreeModelFactory.$inject = ['$q', '$gdeic', '$gdeicSysResource'];

    function $cOutreeModelFactory($q, $gdeic, $gdeicSysResource) {
        function $cOutreeModel(outree) {
            var _source = outree;

            this.getSource = function () {
                return _source;
            }

            this.Id = outree.Id;
            this.OuName = outree.OuName;
            this.DnName = outree.DnName;
            this.ParentId = outree.ParentId;
            this.SubOus = null;
            this.Accounts = null;
        }

        $cOutreeModel.prototype.setSubOus = function () {
            var outree = this.getSource();
            this.SubOus = outree.SubOus.map(function (ou, i) {
                return new $cOutreeModel(outree.SubOus[i]);
            });
        }
        $cOutreeModel.prototype.setAccounts = function () {
            var ou = this, deferred = $q.defer();

            if (!ou.Accounts) {
                $gdeic.httpPromise($gdeicSysResource.queryOuAccounts({ ouId: ou.Id })).then(function (data) {
                    ou.Accounts = data;
                    deferred.resolve(data);
                }, function (reason) {
                    deferred.reject(reason);
                });
            } else {
                deferred.resolve(ou.Accounts);
            }

            return deferred.promise;
        }

        return $cOutreeModel;
    }
};