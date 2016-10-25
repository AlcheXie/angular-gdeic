module.exports = function(ngModule) {

    ngModule.controller('gdeicConfirmController', gdeicConfirmController);

    gdeicConfirmController.$inject = ['$scope', '$uibModalInstance', 'title', 'message'];

    function gdeicConfirmController($scope, $uibModalInstance, _title, _message) {

        this.title = _title;
        this.message = _message;

        this.ok = () => { $uibModalInstance.close('ok'); };
        this.cancel = () => { $uibModalInstance.dismiss('cancel'); }
    }
};