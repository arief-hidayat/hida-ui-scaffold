<%@page expressionCodec="raw" %>
App.Uploadr = App.Uploadr || {};
%{--App.Uploadr.defaultDeleteOptions =  { async: false,--}%
%{--headers: { 'X-File-Name': encodeURIComponent(file.fileName),--}%
%{--'X-Uploadr-Name': encodeURIComponent(this.id) } };--}%

App.Uploadr.GlobalOptions = App.Uploadr.GlobalOptions || {
    <g:if test="${classname != 'uploadr'}"> dropableClass: '${classname}-dropable', hoverClass: '${classname}-hover',</g:if>
    uri: '${uri}',<g:if test="${sound}"> notificationSound: '${resource(dir:'sounds', file:'notify.wav')}', errorSound: '${resource(dir:'sounds', file:'error.wav')}', deleteSound: '${resource(dir:'sounds', file:'delete.wav')}',</g:if>
    labelDone: '<g:message code="uploadr.label.done" />',
    labelFailed: '<g:message code="uploadr.label.failed" />',
    labelAborted: '<g:message code="uploadr.label.aborted" />',
    fileSelectText: '<g:if test="${fileselect}">${fileselect}</g:if><g:else><g:message code="uploadr.button.select" /></g:else>',
    placeholderText: '<g:if test="${placeholder}">${placeholder}</g:if><g:else><g:message code="uploadr.placeholder.text" /></g:else>',
    fileDeleteText: '<g:message code="uploadr.button.delete" />',
    fileDeleteConfirm: '<g:message code="uploadr.button.delete.confirm" />',
    fileAbortText: '<g:message code="uploadr.button.abort" />',
    fileAbortConfirm: '<g:message code="uploadr.button.abort.confirm" />',
    fileDownloadText: '<g:message code="uploadr.button.download" />',
    fileViewText: '<g:message code="uploadr.button.view" />',
    fileTooLargeText: '<g:message code="uploadr.error.maxsize" />',
    labelFileTooLarge: '<g:message code="uploadr.label.maxsize" />',
    labelPaused: '<g:message code="uploadr.label.paused" />',
    maxConcurrentUploadsExceededSingular: '<g:message code="uploadr.error.maxConcurrentUploadsExceededSingular" />',
    maxConcurrentUploadsExceededPlural: '<g:message code="uploadr.error.maxConcurrentUploadsExceededPlural" />',
    fileExtensionNotAllowedText: '<g:message code="uploadr.error.wrongExtension" />',
    labelInvalidFileExtension: '<g:message code="uploadr.label.invalidFileExtension" />',
    likeText: '<g:message code="uploadr.button.like" />',
    removeFromViewText: '<g:message code="uploadr.button.remove"/>',
    unlikeText: '<g:message code="uploadr.button.unlike" />',
    badgeTooltipSingular: '<g:message code="uploadr.badge.tooltip.singular" />',
    badgeTooltipPlural: '<g:message code="uploadr.badge.tooltip.plural" />',
    colorPickerText: '<g:message code="uploadr.button.color.picker" />',
    maxVisible: ${maxVisible},
    maxConcurrentUploads: ${maxConcurrentUploads},
    maxConcurrentUploadsMethod: '${maxConcurrentUploadsMethod}',
    rating: ${rating as String},
    voting: ${voting as String},
    colorPicker: ${colorPicker as String},
    deletable: ${deletable as String},
    viewable: ${viewable as String},
    downloadable: ${downloadable as String},
    allowedExtensions: '${allowedExtensions as String}',
    insertDirection: '${direction}',
    maxSize: ${maxSize}
};