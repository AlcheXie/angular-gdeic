module.exports = function (ngModule) {

    require('./directive/element/error')(ngModule);
    require('./directive/element/hold-on')(ngModule);
    require('./directive/element/loading')(ngModule);
    require('./directive/element/paging')(ngModule);
    require('./directive/element/array-text')(ngModule);

    require('./directive/attribute/auto-resize')(ngModule);
    require('./directive/attribute/gradual-show')(ngModule);
    require('./directive/attribute/prevent-edit')(ngModule);
    require('./directive/attribute/prevent-propagation')(ngModule);

}