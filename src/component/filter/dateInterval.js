module.exports = function (ngModule) {
    'use strict';

    ngModule.filter('dateInterval', dateInterval);

    dateInterval.$inject = [];

    function dateInterval() {
        return function (input, rule, type) {
            type = type || 'day';

            var startDate, endDate, interval;

            if (angular.isArray(input) && input.length === 2) {
                if (!angular.isDate(input[0]) && (new Date(input[0])).toString() === 'Invalid Date') {
                    return '';
                }
                if (!angular.isDate(input[1]) && (new Date(input[1])).toString() === 'Invalid Date') {
                    return '';
                }

                startDate = data[0].getTime();
                endDate = data[1].getTime();
            }
            if (!angular.isDate(input) && (new Date(input)).toString() === 'Invalid Date') {
                return '';
            }

            switch (rule) {
                case 'fromToday':
                    startDate = new Date();
                    endDate = input;
                    break;
                case 'fromMonthStart':
                    startDate = new Date();
                    startDate.setDate(1);
                    endDate = input;
                    break;
                case 'fromSeasonStart':
                    startDate = new Date();
                    startDate.setMonth((startDate.getQuarter() - 1) * 3, 1);
                    endDate = input;
                    break;
                case 'fromYearStart':
                    startDate = new Date();
                    startDate.setMonth(0, 1);
                    endDate = input;
                    break;
                case 'toToday':
                    startDate = input;
                    endDate = new Date();
                    break;
                case 'toMonthEnd':
                    startDate = input;
                    endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 1, 0);
                    break;
                case 'toSeasonEnd':
                    startDate = input;
                    endDate = new Date();
                    endDate.setMonth(endDate.getQuarter() * 3, 0);
                    break;
                case 'toYearEnd':
                    startDate = input;
                    endDate = new Date();
                    endDate.setMonth(12, 0);
            }

            if (angular.isUndefined(startDate) && angular.isUndefined(endDate)) {
                return '';
            } else {
                interval = endDate.getTime() - startDate.getTime();
                interval = interval / 1000;
            }

            switch (type) {
                case 'year':
                    interval = (interval / (60 * 60 * 24)) / 365;
                    break;
                case 'month':
                    interval = (interval / (60 * 60 * 24)) / 30;
                    break;
                case 'day':
                    interval = interval / (60 * 60 * 24);
                    break;
                case 'hour':
                    interval = interval / (60 * 60);
                    break;
                case 'minute':
                    interval = interval / 60;
                    break;
            }

            return interval.toFixed(0);
        };
    }
};