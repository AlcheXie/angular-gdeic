var ngModule = angular.module('ngGdeicSys', ['ngResource', 'ngGdeic']);

// based on ngResource
require('./sys/sys-resource')(ngModule);

require('./sys/account-role-model')(ngModule);

require('./sys/outree-model')(ngModule);