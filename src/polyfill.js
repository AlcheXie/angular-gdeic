module.exports = function(angular) {

    require('./polyfill/Object')(angular);
    require('./polyfill/Array')(angular);
    require('./polyfill/String')(angular);
    require('./polyfill/Date')(angular);

};