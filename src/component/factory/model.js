module.exports = function (ngModule) {

    require('./model/paging')(ngModule);
    require('./model/grouping')(ngModule);
    require('./model/pulling')(ngModule);
    require('./model/toggle')(ngModule);
    require('./model/edit')(ngModule);

}