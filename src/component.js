module.exports = function (ngModule) {

    require('./component/controller')(ngModule);
    require('./component/factory')(ngModule);
    require('./component/filter')(ngModule);
    require('./component/service')(ngModule);

};