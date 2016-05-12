module.exports = function (ngModule) {
    'use strict';

    ngModule.controller('gdeicConfirmController', gdeicConfirmController);

    gdeicConfirmController.$inject = ['$scope', '$uibModalInstance', 'title', 'message'];

    function gdeicConfirmController($scope, $uibModalInstance, _title, _message) {
        $scope.title = _title;
        $scope.message = _message;

        $scope.ok = ok;
        $scope.cancel = cancel;

        function ok() {
            $uibModalInstance.close('ok');
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
};