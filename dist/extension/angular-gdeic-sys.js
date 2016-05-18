/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	var ngModule = angular.module('ngGdeicSys', ['ngGdeic']);

	__webpack_require__(15)(ngModule);
	__webpack_require__(16)(ngModule);
	__webpack_require__(17)(ngModule);

/***/ },

/***/ 15:
/***/ function(module, exports) {

	module.exports = function (ngModule) {
	    'use strict';

	    ngModule.factory('$gdeicSysResource', $gdeicSysResource);

	    $gdeicSysResource.$inject = ['$resource'];

	    function $gdeicSysResource($resource) {
	        return $resource('api/account', {}, {
	            getAccountInfo: {
	                url: 'api/account/account',
	                method: 'GET'
	            },
	            getHeader: {
	                url: 'api/account/header',
	                method: 'GET'
	            },
	            queryAccount: {
	                url: 'api/account/get-accounts',
	                method: 'GET'
	            },
	            queryAccountByKeyword: {
	                url: 'api/account/ou-accounts/search/:keyword',
	                params: { keyword: '@keyword' },
	                method: 'GET'
	            },
	            saveAccount: {
	                url: 'api/account/add-accounts',
	                method: 'POST'
	            },
	            lockAccount: {
	                url: 'api/account/lock-account/:uid',
	                params: { uid: '@uid' },
	                method: 'GET'
	            },
	            queryRole: {
	                url: 'api/account/get-roles',
	                method: 'GET'
	            },
	            queryRoleAdmin: {
	                url: 'api/account/get-roles-admin',
	                method: 'GET'
	            },
	            saveRole: {
	                url: 'api/account/add-role',
	                method: 'POST'
	            },
	            removeRole: {
	                url: 'api/account/remove-role/:roleId',
	                params: { roleId: '@roleId' },
	                method: 'GET'
	            },
	            queryMenu: {
	                url: 'api/account/get-menus',
	                method: 'GET'
	            },
	            queryParentMenu: {
	                url: 'api/account/get-parentmenus',
	                method: 'GET'
	            },
	            saveMenu: {
	                url: 'api/account/add-menu',
	                method: 'POST'
	            },
	            removeMenu: {
	                url: 'api/account/remove-menu/:menuId',
	                params: { menuId: '@menuId' },
	                method: 'GET'
	            },
	            initOutree: {
	                url: 'api/account/init-ou',
	                method: 'GET'
	            },
	            getOuTree: {
	                url: 'api/account/ou-tree',
	                method: 'GET'
	            },
	            queryOuAccounts: {
	                url: 'api/account/ou-accounts/:ouId',
	                params: { ouId: '@ouId' },
	                method: 'GET'
	            }
	        });
	    }
	};

/***/ },

/***/ 16:
/***/ function(module, exports) {

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

/***/ },

/***/ 17:
/***/ function(module, exports) {

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

/***/ }

/******/ });