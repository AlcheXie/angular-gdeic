module.exports = function(ngModule) {

    /* directives of element */

    require('./component/directive/element/error/error')(ngModule, { defaultTemplate: true, defaultStyle: true });

    require('./component/directive/element/hold-on/hold-on')(ngModule, { defaultTemplate: true, defaultStyle: true });

    require('./component/directive/element/ie-warning/ie-warning')(ngModule);

    require('./component/directive/element/loading/loading')(ngModule, { defaultTemplate: true, defaultStyle: true });

    require('./component/directive/element/paging/paging')(ngModule, { defaultTemplate: true });

    require('./component/directive/element/array-text/array-text')(ngModule);

    /* directives of attribute */

    require('./component/directive/attribute/auto-resize/auto-resize-padding-x')(ngModule);

    require('./component/directive/attribute/auto-resize/auto-resize-padding-y')(ngModule);

    require('./component/directive/attribute/gradual-show/gradual-show')(ngModule);
    
    require('./component/directive/attribute/prevent-edit')(ngModule);
    
    require('./component/directive/attribute/prevent-propagation')(ngModule);

    /* factories */

    require('./component/factory/gdeicHttpInterceptor')(ngModule);

    require('./component/factory/gdeicCache')(ngModule);

    /* models */

    require('./component/factory/model/paging')(ngModule);

    require('./component/factory/model/grouping')(ngModule);

    require('./component/factory/model/pulling')(ngModule);

    require('./component/factory/model/toggle')(ngModule);
    
    require('./component/factory/model/edit')(ngModule);

    /* filters */

    require('./component/filter/bool')(ngModule);
    
    require('./component/filter/switch')(ngModule);
    
    require('./component/filter/dateInterval')(ngModule);

    /* providers */

    require('./component/provider/gdeic')(ngModule);
};