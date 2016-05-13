var ngModule = angular.module('ngGdeicSys', ['ngGdeic']);

require('./sys/sys-resource')(ngModule);
require('./sys/account-role-model')(ngModule);
require('./sys/outree-model')(ngModule);