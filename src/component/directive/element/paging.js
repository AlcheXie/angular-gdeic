module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicPaging', gdeicPaging);

    gdeicPaging.$inject = ['$cPagingModel', '$cGroupingModel'];

    function gdeicPaging($cPagingModel, $cGroupingModel) {
        return {
            restrict: 'EA',
            scope: {
                templateUrl: '@',
                hideAlert: '=',
                pagingModel: '=',
                editMode: '='
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/template/paging.html';
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                if (scope.editMode === true) {
                    scope.$watch('pagingModel.currentList', function (newValue, oldValue) {
                        var source, pagingIndexes;
                        if (angular.isDefined(oldValue) && newValue.length > 0) {
                            if (scope.pagingModel.constructor === $cPagingModel) {
                                source = scope.pagingModel.getSource();
                                pagingIndexes = scope.pagingModel.pagingList.map(function (item) {
                                    return item.$$index;
                                });

                                if (angular.equals(oldValue.map(function (item) { return item.$$index; }), newValue.map(function (item) { return item.$$index; }))) {
                                    angular.forEach(newValue, function (item) {
                                        var idx = item.$$index;
                                        source[idx] = item;
                                        scope.pagingModel.pagingList[pagingIndexes.indexOf(idx)] = item;
                                    });
                                    scope.pagingModel.setSource(source);
                                }
                            } else if (scope.pagingModel.constructor === $cGroupingModel) {
                                angular.forEach(newValue, function (item) {
                                    scope.pagingModel.pagingList[item.$$index].isExpand = item.isExpand;
                                });
                            }
                        }
                    }, true);
                }
            }
        };
    }
};