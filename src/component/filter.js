module.exports = function (ngModule) {

    require('./filter/bool')(ngModule);
    require('./filter/switch')(ngModule);
    require('./filter/dateInterval')(ngModule);

}