module.exports = function(ngModule) {

    ngModule.factory('$gdeicModal', $gdeicModal);

    $gdeicModal.$inject = ['$uibModal'];

    function $gdeicModal($uibModal) {
        return {
            confirm({
                title = '确认操作',
                message = '当前操作不可撤销， 确认要继续吗？',
                option = {
                    size: 'sm'
                }
            }) {
                if (!/^(xs|sm|md|lg)$/.test(option.size)) { option.size = 'sm'; }

                return $uibModal.open(Object.assign({
                    template: require('./confirm-template.html'),
                    controller: 'gdeicConfirmController',
                    controllerAs: 'vm',
                    resolve: {
                        title: function() { return title; },
                        message: function() { return message; }
                    },
                    backdrop: 'static'
                }, option));
            },
            edit(config = {}, option = {
                size: 'md'
            }) {
                option = Object.assign({
                    controllerAs: 'vm',
                    backdrop: 'static'
                }, option);

                return $uibModal.open(Object.assign(config, option));
            }
        }
    }
}