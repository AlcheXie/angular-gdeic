(function (angular) {
    var ngApp = angular.module('ngGdeic', ['ngAnimate', 'ui.bootstrap', 'angular-linq']);

    require('./src/prototype')(angular);

} (angular));