module.exports = function($templateCache, userDefinedTemplateUrl, templateName) {

    return userDefinedTemplateUrl || angular.isUndefined($templateCache.get(templateName)) ? 'gdeic/template/directive-blank.html' : templateName;
}