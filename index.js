var ngApp = angular.module('ngGdeic', ['angular-linq']);

require('./src/polyfill')(angular);
require('./src/component')(ngApp);
require('./src/config')(ngApp);

require('./src/common.scss');