module.exports = function (ngModule) {

    require('./component/controller/confirm/confirm')(ngModule);

    require('./component/directive/element/ie-warning/ie-warning')(ngModule);
    require('./component/directive/element/error/error')(ngModule);
    require('./component/directive/element/hold-on/hold-on')(ngModule);
    require('./component/directive/element/loading/loading')(ngModule);
    require('./component/directive/element/paging/paging')(ngModule);
    require('./component/directive/element/array-text/array-text')(ngModule);

    require('./component/directive/attribute/auto-resize')(ngModule);
    require('./component/directive/attribute/gradual-show')(ngModule);
    require('./component/directive/attribute/prevent-edit')(ngModule);
    require('./component/directive/attribute/prevent-propagation')(ngModule);

    require('./component/factory/gdeicHttpInterceptor')(ngModule);
    require('./component/factory/cache')(ngModule);
    // models
    require('./component/factory/model/paging')(ngModule);
    require('./component/factory/model/grouping')(ngModule);
    require('./component/factory/model/pulling')(ngModule);
    require('./component/factory/model/toggle')(ngModule);
    require('./component/factory/model/edit')(ngModule);

    require('./component/filter/bool')(ngModule);
    require('./component/filter/switch')(ngModule);
    require('./component/filter/dateInterval')(ngModule);

    require('./component/service/gdeic')(ngModule);
};