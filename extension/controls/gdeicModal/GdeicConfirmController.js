module.exports = function(ngModule) {

    ngModule.controller('GdeicConfirmController', GdeicConfirmController);

    GdeicConfirmController.$inject = ['$scope', '$uibModalInstance', 'title', 'message'];

    function GdeicConfirmController($scope, $uibModalInstance, _title, _message) {

        this.title = _title;
        this.message = _message;

        this.ok = () => $uibModalInstance.close('ok');
        this.cancel = () => $uibModalInstance.dismiss('cancel');
    }
};