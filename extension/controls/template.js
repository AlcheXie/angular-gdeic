module.exports = function (ngModule) {
    'use strict';

    ngModule.run(runFunc);

    runFunc.$inject = ['$templateCache'];

    function runFunc($templateCache) {
        var templates = [
            'cascade.html',
            'date-picker.html',
            'file-upload.html',
            'modal-panel.html',
            'modal-select-panel.html',
            'modal-select-panel-multi.html'
        ],
            url = 'gdeic/controls/template/',
            entry = './template/';

        var i = 0, max = templates.length, curr;

        for (; i < max; i++) {
            curr = templates[i];
            $templateCache.put(url + curr, require(entry + curr));
        }
    }
};