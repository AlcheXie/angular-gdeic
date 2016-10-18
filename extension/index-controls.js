var ngModule = angular.module('ngGdeicControls', ['ngGdeic']);

require('./controls/cascade/cascade')(ngModule);
require('./controls/date-picker/date-picker')(ngModule);
require('./controls/file-upload/file-upload')(ngModule);
require('./controls/modal-panel/modal-panel')(ngModule);
require('./controls/modal-select-panel/modal-select-panel')(ngModule);
require('./controls/range/range')(ngModule);
require('./controls/tree-view/tree-view')(ngModule);