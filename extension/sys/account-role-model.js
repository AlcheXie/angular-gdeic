module.exports = function (ngModule) {
    'use strict';

    ngModule.factory('$cAccountRoleModel', $cAccountRoleModelFactory);

    $cAccountRoleModelFactory.$inject = ['$q', '$gdeic', '$cToggleModel', '$gdeicSysResource'];

    function $cAccountRoleModelFactory($q, $gdeic, $cToggleModel, $gdeicSysResource) {
        function $cAccountRoleModel(account) {
            account = account || [];

            this.Accounts = null;
            this.Roles = null;
            this.ManageOu = null;
            this.LockoutEnabled = false;

            if (account.constructor === Object) {
                account = [account];
            }
            this.Accounts = new $cToggleModel(account, 'Id');
            if (account.length === 1) {
                this.Roles = new $cToggleModel(account[0].Roles, 'Id');
                this.ManageOu = account[0].ManageOu;
                this.LockoutEnabled = account[0].LockoutEnabled;
            } else {
                this.Roles = new $cToggleModel('Id');
                if (account.length > 0) {
                    this.LockoutEnabled = !(account.some(function (u) {
                        return u.LockoutEnabled === false;
                    }));
                } else {
                    this.LockoutEnabled = false;
                }
            }
        }

        $cAccountRoleModel.prototype.save = function (isAdmin, isUnifyManageOu) {
            isAdmin = isAdmin || false;
            isUnifyManageOu = isUnifyManageOu || false;

            var accounts = angular.copy(this.Accounts.items), deferred = $q.defer();

            if (accounts.length === 0) {
                deferred.resolve(this.Accounts);
            } else {
                var i = 0, max = accounts.length, account;
                for (; i < max; i++) {
                    account = accounts[i];
                    if (this.Roles.items.length > 0) {
                        account.Roles = this.Roles.items;
                    }
                    if (isAdmin) {
                        if (isUnifyManageOu) {
                            account.ManageOu = this.ManageOu;
                        } else {
                            account.ManageOu = account.Ou;
                        }
                    } else {
                        account.ManageOu = null;
                    }
                    account.LockoutEnabled = this.LockoutEnabled;
                }

                $gdeic.httpPromise($gdeicSysResource.saveAccount(accounts)).then(function (data) {
                    deferred.resolve(data);
                }, function (reason) {
                    deferred.reject(reason);
                });
            }

            return deferred.promise;
        }
        $cAccountRoleModel.prototype.lock = function () {
            var accountIds = this.Accounts.Ids, promises = [];
            for (var i = 0, max = accountIds.length; i < max; i++) {
                promises.push(_lock(accountIds[i]));
            }
            return $q.all(promises);

            function _lock(uid) {
                var deferred = $q.defer();
                $gdeic.httpPromise($gdeicSysResource.lockAccount({ uid: uid })).then(function (data) {
                    deferred.resolve(data);
                }, function (reason) {
                    deferred.reject(reason);
                }, function (msg) {
                    deferred.notify(msg);
                });

                return deferred.promise;
            }
        }
        $cAccountRoleModel.prototype.getManageOuString = function () {
            if (!this.ManageOu) {
                return '';
            }

            var arr = (this.ManageOu.DnName || '').match(/[\u4e00-\u9fa5]+/g);
            if (!arr) {
                return this.ManageOu.OuName;
            } else {
                if (this.ManageOu.OuName === arr[0]) {
                    return arr.reverse().join(' - ');
                } else {
                    return arr.reverse().join(' - ') + ' - ' + (this.ManageOu.OuName || '');
                }
            }
        }

        return $cAccountRoleModel;
    }
};