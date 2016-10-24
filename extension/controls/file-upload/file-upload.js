module.exports = function(ngModule) {

    ngModule.directive('gdeicFileUpload', gdeicFileUploadDirective);

    gdeicFileUploadDirective.$inject = ['$rootScope', '$templateCache', '$log', '$gdeic'];

    function gdeicFileUploadDirective($rootScope, $templateCache, $log, $gdeic) {

        $templateCache.put('gdeic/controls/template/file-upload.html', require('./template.html'));

        return {
            restrict: "EA",
            scope: {
                templateUrl: '@',
                accept: '@',
                multiple: '=',
                target: '=',
                success: '&',
                error: '&',
                progress: '&'
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || 'gdeic/controls/template/file-upload.html';
            },
            controller: function() {
                let _timestamp = (new Date()).getTime(),
                    _n = 0;
                this.fileInputId = `gdeic_file_file_${_timestamp}`;
                this.textInputId = `gdeic_file_text_${_timestamp}`;
                this.btnInputId = `gdeic_file_btn_${_timestamp}`;
                this.fileName = '';
            },
            controllerAs: 'vm',
            link: function(scope, iElement, iAttrs, controller, transcludeFn) {
                $gdeic.execAsync(() => {
                    let $fileInput = angular.element(document.getElementById(controller.fileInputId)),
                        $textInput = angular.element(document.getElementById(controller.textInputId)),
                        $btnBrowse = angular.element(document.getElementById(controller.btnInputId));

                    let openFile = () => { $fileInput[0].click(); }
                    if (scope.multiple) {
                        $fileInput.attr('multiple', true);
                    } else {
                        $textInput.bind('click', openFile);
                    }
                    $btnBrowse.bind('click', openFile);
                    $fileInput.bind('change', () => {
                        $textInput.removeClass('ng-invalid');
                        controller.fileName = [...$fileInput[0].files].map(x => x.name).join('; ');
                        scope.$apply();
                    });

                    scope.upload = () => {
                        $textInput.removeClass('ng-invalid').removeClass('ng-untouched');
                        if (controller.fileName === '') {
                            $textInput.addClass('ng-invalid');
                            return;
                        }

                        let fd = new FormData();
                        for (let i = 0, max = $fileInput[0].files.length; i < max; i++) {
                            fd.append(`files_${i}`, $fileInput[0].files[i]);
                        }

                        let xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', event => {
                            scope.progress({ $event: event });
                        }, false);
                        xhr.addEventListener('error', (event) => {
                            $log.error(event);
                            scope.error();
                        }, false);
                        xhr.open('POST', scope.target);
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    $fileInput.val('');
                                    controller.fileName = '';

                                    let data = angular.fromJson(xhr.responseText);
                                    if (data.StatusCode < 0) {
                                        $log.warn(data);
                                        $rootScope.$broadcast('httpErrMsg', data);
                                    } else {
                                        scope.success();
                                    }
                                    $rootScope.$apply();
                                } else if (xhr.status === 404) {
                                    $rootScope.$broadcast('httpErrMsg', {
                                        StatusCode: '-',
                                        ErrorMsg: '文件大小超过了限制'
                                    });
                                    $rootScope.$apply();
                                }
                            }
                        }
                        xhr.send(fd);
                    }
                });
            }
        };
    }
};