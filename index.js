var ngApp = angular.module('ngGdeic', ['ngAnimate', 'ui.bootstrap', 'ngResource', 'angular-linq']);

require('./src/config')(ngApp);
require('./src/prototype')(angular);
require('./src/component')(ngApp);

require('./scss/common.scss');