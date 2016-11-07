module.exports = function($templateCache, userDefinedTemplateUrl, templateName) {
    let defaultTemplate = $templateCache.get(templateName),
        userDefinedTemplate = `<span ng-include="'${userDefinedTemplateUrl}'"></span>`;

    return userDefinedTemplateUrl ? userDefinedTemplate : (angular.isUndefined(defaultTemplate) ? `<span ng-include="'gdeic/template/directive-blank.html'"></span>` : defaultTemplate);
}