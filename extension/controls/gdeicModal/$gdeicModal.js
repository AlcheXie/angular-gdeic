module.exports = function(ngModule, options) {

    ngModule.factory('$gdeicModal', $gdeicModal);

    $gdeicModal.$inject = ['$templateCache', '$uibModal'];

    function $gdeicModal($templateCache, $uibModal) {

        options = options || {};
        let templateName = 'gdeic/controls/template/confirm.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }

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
                    template: $templateCache.get(templateName) || $templateCache.get('gdeic/template/directive-blank.html'),
                    controller: 'GdeicConfirmController',
                    controllerAs: 'vm',
                    resolve: {
                        title: () => title,
                        message: () => message
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