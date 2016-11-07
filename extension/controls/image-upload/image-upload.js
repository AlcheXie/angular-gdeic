module.exports = function(ngModule, options) {

    ngModule.directive('gdeicImageUpload', gdeicImageUploadDirective);

    gdeicImageUploadDirective.$inject = ['$rootScope', '$templateCache', '$log', '$window', '$gdeic'];

    function gdeicImageUploadDirective($rootScope, $templateCache, $log, $window, $gdeic) {

        options = options || {};
        let templateName = 'gdeic/template/image-upload.html';
        if (options.defaultTemplate) {
            $templateCache.put(templateName, require('./template.html'));
        }
        if (options.defaultStyle) {
            require('./image-upload.scss');
        }

        return {
            restrict: "EA",
            scope: {
                templateUrl: '@',
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
            replace: true,
            controller: ['$scope', '$gdeic',
                function($scope, $gdeic) {
                    let _timestamp = (new Date()).getTime();
                    let _n = 0;

                    this.fileInputId = `gdeic_image_file_${_timestamp}`;
                    this.imageList = [];
                    this.previewing = false;
                    this.previewingImage;

                    this.addImage = img => {
                        img.id = _n++;
                        this.imageList.push(img);
                    }

                    this.deleteImage = ($event, img) => {
                        this.imageList.splice(this.imageList.map(x => x.id).indexOf(img.id), 1);
                        this.previewing = false;
                        $event.stopPropagation();
                    }

                    this.previewImage = img => {
                        this.previewingImage = img
                        this.previewing = true;
                    };

                    if (angular.isUndefined($scope.method) || ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'].indexOf($scope.method.toUpperCase() < 0)) {
                        $scope.method = 'POST';
                    }
                }
            ],
            controllerAs: 'vm',
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                $gdeic.execAsync(() => {
                    let $fileInput = angular.element(document.getElementById(controller.fileInputId));

                    $fileInput.bind('change', e => {
                        let _url = $window.URL || $window.webkitURL || $window.mozURL,
                            _src;

                        for (let file of[...e.target.files]) {
                            if (_url) {
                                _src = _url.createObjectURL(file);
                            } else {
                                _src = e.target.result;
                            }

                            controller.addImage({
                                file: file,
                                src: _src
                            });
                        }
                        scope.$apply();
                        $fileInput.val('');
                    });
                });

                scope.upload = () => {
                    let fd = new FormData();
                    for (let img of controller.imageList) {
                        fd.append(`image_${img.id}`, img.file);
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
                    xhr.open('POST', scope.action);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                let data = angular.fromJson(xhr.responseText);
                                if (data.StatusCode < 0) {
                                    $log.warn(data);
                                    $rootScope.$broadcast('httpErrMsg', data);
                                } else {
                                    scope.success({ $data: data.Data });
                                    controller.imageList = [];
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
            }
        };
    }
};