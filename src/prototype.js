module.exports = function (angular) {

    require('./prototype/Object')(angular);
    require('./prototype/Array')(angular);
    require('./prototype/String')(angular);
    require('./prototype/Date')(angular);

};