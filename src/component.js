module.exports = function(ngModule) {

    /* directives of element */

    require('./component/directive/element/gdeicError/gdeicError')(ngModule, { defaultTemplate: true, defaultStyle: true });

    require('./component/directive/element/gdeicHoldOn/gdeicHoldOn')(ngModule, { defaultTemplate: true, defaultStyle: true });

    require('./component/directive/element/gdeicIeWarning/gdeicIeWarning')(ngModule);

    require('./component/directive/element/gdeicLoading/gdeicLoading')(ngModule, { defaultTemplate: true, defaultStyle: true });

    require('./component/directive/element/gdeicPaging/gdeicPaging')(ngModule, { defaultTemplate: true });

    require('./component/directive/element/gdeicArrayText/gdeicArrayText')(ngModule);

    /* directives of attribute */

    require('./component/directive/attribute/autoResize/autoResizePaddingX')(ngModule);

    require('./component/directive/attribute/autoResize/autoResizePaddingY')(ngModule);

    require('./component/directive/attribute/gradualShow/gradualShow')(ngModule);
    
    require('./component/directive/attribute/preventEdit')(ngModule);
    
    require('./component/directive/attribute/preventPropagation')(ngModule);

    /* providers */

    require('./component/provider/$gdeic')(ngModule);

    /* filters */

    require('./component/filter/bool')(ngModule);
    
    require('./component/filter/switch')(ngModule);
    
    require('./component/filter/dateInterval')(ngModule);

    /* factories */

    require('./component/factory/$gdeicHttpInterceptor')(ngModule);

    require('./component/factory/$gdeicCache')(ngModule);

    /* factories - classes */

    require('./component/factory/class/GdeicPage')(ngModule);

    require('./component/factory/class/GdeicGroup')(ngModule);

    require('./component/factory/class/GdeicPulling')(ngModule);

    require('./component/factory/class/GdeicToggle')(ngModule);

    require('./component/factory/class/GdeicEdit')(ngModule);
};