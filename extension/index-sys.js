var ngModule = angular.module('ngGdeicSys', ['ngResource', 'ngGdeic']);

// based on ngResource
require('./sys/$gdeicSysResource')(ngModule);

require('./sys/GdeicAccountRole')(ngModule);

require('./sys/GdeicOutree')(ngModule);