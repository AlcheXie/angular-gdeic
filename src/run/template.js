module.exports = function ($templateCache) {
    'use strict';

    var templates = [
        'error.html',
        'hold-on.html',
        'loading.html',
        'paging.html',
        'confirm.html'
    ],
        url = 'gdeic/template/',
        entry = './template/';

    var i = 0, max = templates.length, curr;

    $templateCache.put(url + 'blank.html', '<div></div>');
    for (; i < max; i++) {
        curr = templates[i];
        $templateCache.put(url + curr, require(entry + curr));
    }
};