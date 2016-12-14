module.exports = function(ngModule, options) {

    ngModule.directive('gdeicFileUpload', gdeicFileUploadDirective);

    gdeicFileUploadDirective.$inject = ['$rootScope', '$templateCache', '$log', '$gdeic'];

    function gdeicFileUploadDirective($rootScope, $templateCache, $log, $gdeic) {

        options = options || {};
        let templateName = 'gdeic/template/gdeicFileUpload.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('./styles.scss');
        }

        return {
            restrict: "EA",
            scope: {
                templateUrl: '@',
                accept: '@',
                multiple: '=',
                action: '=',
                method: '@',
                extraData: '=',
                uploadTag: '@',
                success: '&',
                error: '&',
                progress: '&'
            },
            templateUrl: function(tElement, tAttrs) {
                return require('../../../src/common/set-directive-template-url')($templateCache, tAttrs.templateUrl, templateName);
            },
            controller: ['$scope',
                function($scope) {
                    let _timestamp = (new Date()).getTime(),
                        _n = 0;

                    this.fileInputId = `gdeic_file_file_${_timestamp}`;
                    this.textInputId = `gdeic_file_text_${_timestamp}`;
                    this.btnInputId = `gdeic_file_btn_${_timestamp}`;

                    this.fileList = [];

                    this.addFile = file => {
                        file.id = _n++;
                        this.fileList.push(file);
                    }

                    this.deleteFile = file => {
                        this.fileList.splice(this.fileList.map(x => x.id).indexOf(file.id), 1);
                    }

                    if (angular.isUndefined($scope.method) || ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'].indexOf($scope.method.toUpperCase() < 0)) {
                        $scope.method = 'POST';
                    }
                }
            ],
            controllerAs: 'vm',
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                $gdeic.execAsync(() => {
                    let $fileInput = angular.element(document.getElementById(controller.fileInputId)),
                        $textInput = angular.element(document.getElementById(controller.textInputId)),
                        $btnBrowse = angular.element(document.getElementById(controller.btnInputId));

                    let openFile = () => { $fileInput[0].click(); }
                    if (!scope.multiple) {
                        $textInput.bind('click', openFile);
                    }

                    $btnBrowse.bind('click', openFile);
                    $fileInput.bind('change', () => {
                        if (!scope.multiple) {
                            if ($fileInput[0].files.length > 0) {
                                $textInput.val($fileInput[0].files[0].name);
                                controller.addFile({
                                    file: $fileInput[0].files[0],
                                    name: $fileInput[0].files[0].name
                                });
                            } else {
                                $textInput.val('');
                                controller.fileList = [];
                            }
                        } else {
                            for (let file of[...$fileInput[0].files]) {
                                controller.addFile({
                                    file: file,
                                    name: file.name
                                });
                            }
                        }
                        scope.$apply();
                    });

                    scope.upload = () => {
                        let fd = new FormData();
                        for (let file of controller.fileList) {
                            fd.append(`file_${file.id}`, file.file);
                        }
                        let _aInvalidParams = [];
                        if (angular.isObject(scope.extraData)) {
                            if (angular.isDefined(scope.uploadTag)) {
                                Object.assign(scope.extraData, { 'uploadTag': scope.uploadTag });
                            }

                            for (let key of Object.keys(scope.extraData)) {
                                let value = scope.extraData[key];
                                if (angular.isString(value) || angular.isNumber(value) || angular.isDate(value)) {
                                    fd.append(key, value);
                                } else {
                                    _aInvalidParams.push(key);
                                }
                            }
                            if (_aInvalidParams.length > 0) {
                                $log.info(`Invalid params: ${_aInvalidParams.join(', ')}.`);
                            }
                        } else {
                            if (angular.isDefined(scope.uploadTag)) {
                                fd.append('uploadTag', scope.uploadTag);
                            }
                        }

                        let xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', event => {
                            scope.progress({ $event: event });
                            scope.$apply();
                        }, false);
                        xhr.addEventListener('error', event => {
                            $log.error(event);
                            scope.error();
                            scope.$apply();
                        }, false);
                        xhr.open(scope.method, scope.action);
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    let data = angular.fromJson(xhr.responseText);
                                    if (data.StatusCode < 0) {
                                        $log.warn(data);
                                        $rootScope.$broadcast('httpErrMsg', data);
                                    } else {
                                        scope.success({ $data: data.Data });

                                        $fileInput.val('');
                                        if (!scope.multiple) { $textInput.val(''); }
                                        controller.fileList = [];
                                    }
                                } else if (xhr.status === 404) {
                                    $rootScope.$broadcast('httpErrMsg', {
                                        StatusCode: '-',
                                        ErrorMsg: '文件大小超过了限制'
                                    });
                                }
                                $rootScope.$apply();
                            }
                        }
                        xhr.send(fd);
                    }
                });
            }
        };
    }
};