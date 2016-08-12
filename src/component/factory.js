module.exports = function (ngModule) {

    require('./factory/gdeicHttpInterceptor')(ngModule);
    require('./factory/cache')(ngModule);
    require('./factory/model')(ngModule);

}