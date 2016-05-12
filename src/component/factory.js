module.exports = function (ngModule) {

    require('./factory/httpErrorInterceptor')(ngModule);
    require('./factory/cache')(ngModule);
    require('./factory/model')(ngModule);

}