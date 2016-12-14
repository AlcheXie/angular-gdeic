var ngModule = angular.module('ngGdeicControls', ['ui.bootstrap', 'ngGdeic']);

require('./controls/gdeicCascade/gdeicCascade')(ngModule, { defaultTemplate: true });

// based on ui.bootstrap
require('./controls/gdeicDatePicker/gdeicDatePicker')(ngModule, { defaultTemplate: true });

require('./controls/gdeicFileUpload/gdeicFileUpload')(ngModule, { defaultTemplate: true, defaultStyle: true });

require('./controls/gdeicImageUpload/gdeicImageUpload')(ngModule, { defaultTemplate: true, defaultStyle: true });

// based on ui.bootstrap
require('./controls/gdeicModal/$gdeicModal')(ngModule, { defaultTemplate: true });
require('./controls/gdeicModal/GdeicConfirmController')(ngModule);

// based on ngGdeic's gradualShowDirective
require('./controls/gdeicModalPanel/gdeicModalPanel')(ngModule, { defaultTemplate: true, defaultStyle: true });

// based on ngGdeic's gradualShowDirective
require('./controls/gdeicModalSelectPanel/gdeicModalSelectPanel')(ngModule, { defaultTemplate: true });

require('./controls/gdeicPagingAhead/gdeicPagingAhead')(ngModule, { defaultTemplate: true });

require('./controls/gdeicRange/gdeicRange')(ngModule, { defaultTemplate: true, defaultStyle: true });

require('./controls/gdeicTreeView/gdeicTreeView')(ngModule, { defaultTemplate: true });