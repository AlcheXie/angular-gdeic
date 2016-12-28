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
                config = {
                    size: 'sm'
                }
            }) {
                if (!/^(xs|sm|md|lg)$/.test(config.size)) { config.size = 'sm'; }

                return $uibModal.open(Object.assign({
                    template: $templateCache.get(templateName) || $templateCache.get('gdeic/template/directive-blank.html'),
                    controller: 'GdeicConfirmController',
                    controllerAs: 'vm',
                    resolve: {
                        title: () => title,
                        message: () => message
                    },
                    backdrop: 'static'
                }, config));
            },
            edit(config = {}) {
                config = Object.assign({
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md'
                }, config);

                return $uibModal.open(config);
            }
        }
    }
}