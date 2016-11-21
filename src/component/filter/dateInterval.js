module.exports = function(ngModule) {

    ngModule.filter('dateInterval', dateIntervalFilter);

    dateIntervalFilter.$inject = [];

    function dateIntervalFilter() {
        return function(input, rule, type = 'day') {
            let _dStart, _dEnd, _nInterval;

            if (angular.isArray(input) && input.length === 2) {
                if (!angular.isDate(input[0]) && (new Date(input[0])).toString() === 'Invalid Date') {
                    return '';
                }
                if (!angular.isDate(input[1]) && (new Date(input[1])).toString() === 'Invalid Date') {
                    return '';
                }

                _dStart = input[0].getTime();
                _dEnd = input[1].getTime();
            } else if (!angular.isDate(input) && (new Date(input)).toString() === 'Invalid Date') {
                return '';
            }

            switch (rule) {
                case 'fromToday':
                    _dStart = new Date();
                    _dEnd = input;
                    break;
                case 'fromMonthStart':
                    _dStart = new Date();
                    _dStart.setDate(1);
                    _dEnd = input;
                    break;
                case 'fromSeasonStart':
                    _dStart = new Date();
                    _dStart.setMonth((_dStart.getQuarter() - 1) * 3, 1);
                    _dEnd = input;
                    break;
                case 'fromYearStart':
                    _dStart = new Date();
                    _dStart.setMonth(0, 1);
                    _dEnd = input;
                    break;
                case 'toToday':
                    _dStart = input;
                    _dEnd = new Date();
                    break;
                case 'toMonthEnd':
                    _dStart = input;
                    _dEnd = new Date();
                    _dEnd.setMonth(_dEnd.getMonth() + 1, 0);
                    break;
                case 'toSeasonEnd':
                    _dStart = input;
                    _dEnd = new Date();
                    _dEnd.setMonth(_dEnd.getQuarter() * 3, 0);
                    break;
                case 'toYearEnd':
                    _dStart = input;
                    _dEnd = new Date();
                    _dEnd.setMonth(12, 0);
                    break;
                case 'interval':
                    break;
            }

            if (angular.isDate(_dStart)) {
                _dStart = _dStart.getTime();
            }
            if (angular.isDate(_dEnd)) {
                _dEnd = _dEnd.getTime();
            }
            _nInterval = _dEnd - _dStart;
            _nInterval = _nInterval / 1000;

            switch (type) {
                case 'year':
                    _nInterval = (_nInterval / (60 * 60 * 24)) / 365;
                    break;
                case 'month':
                    _nInterval = (_nInterval / (60 * 60 * 24)) / 30;
                    break;
                case 'day':
                    _nInterval = _nInterval / (60 * 60 * 24);
                    break;
                case 'hour':
                    _nInterval = _nInterval / (60 * 60);
                    break;
                case 'minute':
                    _nInterval = _nInterval / 60;
                    break;
                default:
                    break;
            }

            return _nInterval.toFixed(0);
        };
    }
};