var ngApp = angular.module('ngGdeic', ['ngAnimate', 'ui.bootstrap', 'ngResource', 'angular-linq']);

require('./src/prototype')(angular);
require('./src/component')(ngApp);
require('./src/config')(ngApp);

require('./src/common.scss');