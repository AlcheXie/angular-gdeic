module.exports = function(ngModule) {

    ngModule.factory('GdeicAccountRole', GdeicAccountRoleFactory);

    GdeicAccountRoleFactory.$inject = ['$q', '$gdeic', 'GdeicToggle', '$gdeicSysResource'];

    function GdeicAccountRoleFactory($q, $gdeic, GdeicToggle, $gdeicSysResource) {
        class GdeicAccountRole {
            constructor(account = []) {
                this.Accounts = null;
                this.Roles = null;
                this.ManageOu = null;
                this.LockoutEnabled = false;

                if (account.constructor === Object) { account = [account]; }
                this.Accounts = new GdeicToggle(account, 'Sid');
                if (account.length === 1) {
                    this.Roles = new GdeicToggle(account[0].Roles, 'Id');
                    this.ManageOu = account[0].ManageOu;
                    this.LockoutEnabled = account[0].LockoutEnabled;
                } else {
                    this.Roles = new GdeicToggle('Id');
                    if (account.length > 0) {
                        this.LockoutEnabled = !(account.some(x => x.LockoutEnabled === false));
                    } else {
                        this.LockoutEnabled = false;
                    }
                }
            }

            save(isAdmin = false, isUnifyManageOu = false) {
                let _accounts = angular.copy(this.Accounts.items),
                    deferred = $q.defer();

                if (_accounts.length === 0) {
                    deferred.resolve(this.Accounts);
                } else {
                    for (let account of _accounts) {
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
                    $gdeic.httpPromise($gdeicSysResource.saveAccount(_accounts))
                        .then(deferred.resolve, deferred.reject);
                }

                return deferred.promise;
            }

            lock() {
                let _accountIds = this.Accounts.Ids,
                    _promises = [],
                    _lock = uid => {
                        let deferred = $q.defer();
                        $gdeic.httpPromise($gdeicSysResource.lockAccount({ uid: uid }))
                            .then(deferred.resolve, deferred.reject);
                        return deferred.promise;
                    }

                for (let id of _accountIds) {
                    _promises.push(_lock(id));
                }

                return $q.all(_promises);
            }

            getManageOuString() {
                if (!this.ManageOu) { return ''; }

                var _matches = (this.ManageOu.DnName || '').match(/[\u4e00-\u9fa5]+/g);
                if (!_matches) {
                    return this.ManageOu.OuName;
                } else {
                    if (this.ManageOu.OuName === _matches[0]) {
                        return _matches.reverse().join(' - ');
                    } else {
                        return _matches.reverse().join(' - ') + ' - ' + (this.ManageOu.OuName || '');
                    }
                }
            }
        }

        return GdeicAccountRole;
    }
};