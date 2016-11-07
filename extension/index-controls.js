var ngModule = angular.module('ngGdeicControls', ['ui.bootstrap', 'ngGdeic']);

require('./controls/cascade/cascade')(ngModule, { defaultTemplate: true });

// based on ui.bootstrap
require('./controls/date-picker/date-picker')(ngModule, { defaultTemplate: true });

require('./controls/file-upload/file-upload')(ngModule, { defaultTemplate: true, defaultStyle: true });

require('./controls/image-upload/image-upload')(ngModule, { defaultTemplate: true, defaultStyle: true });

// based on ui.bootstrap
require('./controls/modal/modal-factory')(ngModule, { defaultTemplate: true });
require('./controls/modal/confirm-controller')(ngModule);

// based on ngGdeic's gradualShowDirective
require('./controls/modal-panel/modal-panel')(ngModule, { defaultTemplate: true, defaultStyle: true });

// based on ngGdeic's gradualShowDirective
require('./controls/modal-select-panel/modal-select-panel')(ngModule, { defaultTemplate: true });

require('./controls/paging-ahead/paging-ahead')(ngModule, { defaultTemplate: true });

require('./controls/range/range')(ngModule, { defaultTemplate: true, defaultStyle: true });

require('./controls/tree-view/tree-view')(ngModule, { defaultTemplate: true });