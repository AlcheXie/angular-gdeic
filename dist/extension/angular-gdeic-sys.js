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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ngModule = angular.module('ngGdeicSys', ['ngResource', 'ngGdeic']);

	// based on ngResource
	__webpack_require__(33)(ngModule);

	__webpack_require__(34)(ngModule);

	__webpack_require__(35)(ngModule);

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

	'use strict';

	module.exports = function (ngModule) {

	    ngModule.factory('$gdeicSysResource', $gdeicSysResourceFactory);

	    $gdeicSysResourceFactory.$inject = ['$resource'];

	    function $gdeicSysResourceFactory($resource) {
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
	            deleteAccount: {
	                url: 'api/account/del-account/:uid',
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
	            getOuTree: {
	                url: 'api/account/ou-tree',
	                method: 'GET'
	            },
	            initOutree: {
	                url: 'api/account/init-ou',
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

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function (ngModule) {

	    ngModule.factory('GdeicAccountRole', GdeicAccountRoleFactory);

	    GdeicAccountRoleFactory.$inject = ['$q', '$gdeic', 'GdeicToggle', '$gdeicSysResource'];

	    function GdeicAccountRoleFactory($q, $gdeic, GdeicToggle, $gdeicSysResource) {
	        var GdeicAccountRole = function () {
	            function GdeicAccountRole() {
	                var account = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	                _classCallCheck(this, GdeicAccountRole);

	                this.Accounts = null;
	                this.Roles = null;
	                this.ManageOu = null;
	                this.LockoutEnabled = false;

	                if (account.constructor === Object) {
	                    account = [account];
	                }
	                this.Accounts = new GdeicToggle(account, 'Sid');
	                if (account.length === 1) {
	                    this.Roles = new GdeicToggle(account[0].Roles, 'Id');
	                    this.ManageOu = account[0].ManageOu;
	                    this.LockoutEnabled = account[0].LockoutEnabled;
	                } else {
	                    this.Roles = new GdeicToggle('Id');
	                    if (account.length > 0) {
	                        this.LockoutEnabled = !account.some(function (x) {
	                            return x.LockoutEnabled === false;
	                        });
	                    } else {
	                        this.LockoutEnabled = false;
	                    }
	                }
	            }

	            _createClass(GdeicAccountRole, [{
	                key: 'save',
	                value: function save() {
	                    var isAdmin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	                    var isUnifyManageOu = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	                    var _accounts = angular.copy(this.Accounts.items),
	                        deferred = $q.defer();

	                    if (_accounts.length === 0) {
	                        deferred.resolve(this.Accounts);
	                    } else {
	                        var _iteratorNormalCompletion = true;
	                        var _didIteratorError = false;
	                        var _iteratorError = undefined;

	                        try {
	                            for (var _iterator = _accounts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                                var account = _step.value;

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
	                        } catch (err) {
	                            _didIteratorError = true;
	                            _iteratorError = err;
	                        } finally {
	                            try {
	                                if (!_iteratorNormalCompletion && _iterator.return) {
	                                    _iterator.return();
	                                }
	                            } finally {
	                                if (_didIteratorError) {
	                                    throw _iteratorError;
	                                }
	                            }
	                        }

	                        $gdeic.httpPromise($gdeicSysResource.saveAccount(_accounts)).then(deferred.resolve, deferred.reject);
	                    }

	                    return deferred.promise;
	                }
	            }, {
	                key: 'lock',
	                value: function lock() {
	                    var _accountIds = this.Accounts.Ids,
	                        _promises = [],
	                        _lock = function _lock(uid) {
	                        var deferred = $q.defer();
	                        $gdeic.httpPromise($gdeicSysResource.lockAccount({ uid: uid })).then(deferred.resolve, deferred.reject);
	                        return deferred.promise;
	                    };

	                    var _iteratorNormalCompletion2 = true;
	                    var _didIteratorError2 = false;
	                    var _iteratorError2 = undefined;

	                    try {
	                        for (var _iterator2 = _accountIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                            var id = _step2.value;

	                            _promises.push(_lock(id));
	                        }
	                    } catch (err) {
	                        _didIteratorError2 = true;
	                        _iteratorError2 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                                _iterator2.return();
	                            }
	                        } finally {
	                            if (_didIteratorError2) {
	                                throw _iteratorError2;
	                            }
	                        }
	                    }

	                    return $q.all(_promises);
	                }
	            }, {
	                key: 'getManageOuString',
	                value: function getManageOuString() {
	                    if (!this.ManageOu) {
	                        return '';
	                    }

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
	            }]);

	            return GdeicAccountRole;
	        }();

	        return GdeicAccountRole;
	    }
	};

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	module.exports = function (ngModule) {

	    ngModule.factory('GdeicOutree', GdeicOutreeFactory);

	    GdeicOutreeFactory.$inject = ['$q', '$gdeic', '$gdeicSysResource'];

	    function GdeicOutreeFactory($q, $gdeic, $gdeicSysResource) {
	        var GdeicOutree = function () {
	            function GdeicOutree(outree) {
	                _classCallCheck(this, GdeicOutree);

	                var _source = outree;

	                this.Id = outree.Id;
	                this.OuName = outree.OuName;
	                this.DnName = outree.DnName;
	                this.ParentId = outree.ParentId;
	                this.SubOus = null;
	                this.Accounts = null;

	                this.getSource = function () {
	                    return _source;
	                };
	            }

	            _createClass(GdeicOutree, [{
	                key: 'setSubOus',
	                value: function setSubOus() {
	                    var _outree = this.getSource();
	                    this.SubOus = _outree.SubOus.map(function (x, i) {
	                        return new GdeicOutree(_outree.SubOus[i]);
	                    });
	                }
	            }, {
	                key: 'setAccounts',
	                value: function setAccounts() {
	                    var _this = this;

	                    var deferred = $q.defer();

	                    if (!this.Accounts) {
	                        $gdeic.httpPromise($gdeicSysResource.queryOuAccounts({ ouId: this.Id })).then(function (data) {
	                            _this.Accounts = data;
	                            deferred.resolve(data);
	                        }, deferred.reject);
	                    } else {
	                        deferred.resolve(this.Accounts);
	                    }

	                    return deferred.promise;
	                }
	            }]);

	            return GdeicOutree;
	        }();

	        return GdeicOutree;
	    }
	};

/***/ })

/******/ });