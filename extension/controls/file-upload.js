module.exports = function (ngModule) {
    'use strict';

    ngModule.directive('gdeicFileUpload', gdeicFileUpload);

    gdeicFileUpload.$inject = ['$gdeic'];

    function gdeicFileUpload($gdeic) {
        return {
            restrict: "EA",
            scope: {
                templateUrl: '@',
                fileId: '@',
                accept: '@',
                placeholder: '@',
                ngModel: '=',
                ngRequired: '=',
                hideFileName: '='
            },
            templateUrl: function (tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/file-upload.html';
            },
            replace: true,
            link: function (scope, iElement, iAttrs, controller, transcludeFn) {
                $gdeic.execAsync(function () {
                    var inputs = iElement.find('input'),
                        inputFile = inputs.eq(0),
                        inputText = inputs.eq(1),
                        button = iElement.find('button');

                    var fileId, fileUpload, extReg;
                    if (angular.isUndefined(scope.fileId)) {
                        fileId = 'file' + (new Date()).getTime();
                        inputFile.attr('id', fileId);
                    } else {
                        fileId = scope.fileId;
                    }
                    fileUpload = document.getElementById(fileId);

                    inputText.bind('click', openFile);
                    button.bind('click', openFile);
                    inputFile.bind('change', function () {
                        inputText.val(inputFile.val());

                        var base64data, ext;

                        if (inputFile.val() === '') {
                            scope.ngModel.clearProperties();
                            scope.$apply();
                        } else {
                            var reader = new FileReader(), fileObj = fileUpload.files[0];
                            reader.onload = function (e) {
                                var data = e.target.result;
                                base64data = data;
                                ext = fileObj.name.match(/\.[a-zA-Z0-9]+$/);

                                scope.ngModel = {
                                    name: fileObj.name,
                                    data: base64data,
                                    size: fileObj.size,
                                    type: fileObj.type,
                                    ext: ext ? ext[0] : 'unknown',
                                    getBase64: function () {
                                        if (angular.isString(this.data)) {
                                            return this.data.substr(this.data.indexOf('base64,') + 'base64,'.length);
                                        } else {
                                            return '';
                                        }
                                    }
                                };
                                extReg = eval('/\\' + ext + '$/');
                                scope.$apply();
                            }
                            reader.readAsDataURL(fileObj);
                        }
                    });

                    function openFile() {
                        fileUpload.click();
                    }

                    scope.$watch('ngModel', function (newValue, oldValue) {
                        if (angular.toJson(newValue) === '{}' || angular.isUndefined(newValue)) { return; }

                        if (angular.isDefined(newValue) && oldValue !== null && newValue.name === null) {
                            inputFile.val('');
                            inputText.val('');
                        }

                        if (oldValue !== null && newValue !== null && !newValue.isClear()) {
                            if (!extReg.test(newValue.name)) {
                                scope.ngModel = oldValue;
                            }
                        }
                    }, true);
                });
            }
        };
    }
};