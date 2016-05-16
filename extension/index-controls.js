var ngModule = angular.module('ngGdeicControls', ['ngGdeic']);

require('./controls/cascade')(ngModule);
require('./controls/date-picker')(ngModule);
require('./controls/file-upload')(ngModule);
require('./controls/modal-panel')(ngModule);
require('./controls/modal-select-panel')(ngModule);
require('./controls/tree-view')(ngModule);

require('./controls/template')(ngModule);