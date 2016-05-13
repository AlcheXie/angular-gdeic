var ngApp = angular.module('ngGdeic', ['ngAnimate', 'ui.bootstrap', 'angular-linq']);

require('./src/config')(ngApp);
require('./src/prototype')(angular);
require('./src/component')(ngApp);
require('./src/run')(ngApp);