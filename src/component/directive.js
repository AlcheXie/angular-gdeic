module.exports = function (ngModule) {

    require('./directive/element/ie-warning/ie-warning')(ngModule);
    require('./directive/element/error/error')(ngModule);
    require('./directive/element/hold-on/hold-on')(ngModule);
    require('./directive/element/loading/loading')(ngModule);
    require('./directive/element/paging/paging')(ngModule);
    require('./directive/element/array-text/array-text')(ngModule);

    require('./directive/attribute/auto-resize')(ngModule);
    require('./directive/attribute/gradual-show')(ngModule);
    require('./directive/attribute/prevent-edit')(ngModule);
    require('./directive/attribute/prevent-propagation')(ngModule);

}