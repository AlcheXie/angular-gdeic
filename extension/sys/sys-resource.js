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