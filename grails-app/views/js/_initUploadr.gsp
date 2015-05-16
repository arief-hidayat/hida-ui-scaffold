<%@page expressionCodec="raw" %>
(function($){
    var currUploadrOptions = {<g:if test="${uri}">
    uri: '${uri}',</g:if><g:if test="${allowedExtensions}">
    allowedExtensions: '${allowedExtensions as String}',</g:if><g:if test="${handlers.onStart}">
    onStart: function(file) { ${handlers.onStart} },</g:if><g:if test="${handlers.onProgress}">
    onProgress: function(file, domObj, percentage) { ${handlers.onProgress} },</g:if><g:if test="${handlers.onSuccess}">
    onSuccess: function(file, domObj, callback, response) { ${handlers.onSuccess} },</g:if><g:if test="${handlers.onLike}">
    onLike: function(file, domObj, callback) { ${handlers.onLike} },</g:if><g:if test="${handlers.onUnlike}">
    onUnlike: function(file, domObj, callback) { ${handlers.onUnlike} },</g:if><g:if test="${handlers.onChangeColor}">
    onChangeColor: function(file, domObj, color) { ${handlers.onChangeColor} },</g:if><g:if test="${handlers.onFailure}">
    onFailure: function(file, domObj, response) { ${handlers.onFailure} },</g:if><g:if test="${handlers.onAbort}">
    onAbort: function(file, domObj) { ${handlers.onAbort} },</g:if><g:if test="${handlers.onView}">
    onView: function(file, domObj) { ${handlers.onView} },</g:if><g:if test="${handlers.onDelete}">
    onDelete: function(file, domObj) { ${handlers.onDelete} },</g:if><g:if test="${handlers.onDownload}">
    onDownload: function(file, domObj) { ${handlers.onDownload} },</g:if>
id: '${name}',

    deletable: ${deletable as String},
    viewable: ${viewable as String},
    downloadable: ${downloadable as String},
        files: {<g:each var="file" in="${files}" status="s">
    ${s} : {
                    deletable 		: ${file.deletable},
                    fileName 		: '${file.name.replaceAll("'","\\\\'")}',
                    fileSize 		: ${file.size},
                    fileId 			: '${file.id.replaceAll("'","\\\\'")}',
                    fileDate 		: ${file.modified}<g:if test="${file.color}">,
                    fileColor 		: '${file.color}'</g:if><g:if test="${file.rating}">,
                    fileRating 		: ${file.rating}</g:if><g:if test="${file.ratingText}">,
                    fileRatingText 	: '${file.ratingText.replaceAll("'","\\\\'")}'</g:if><g:if test="${file.view}">,
                    fileInfo 		: [<g:each in="${file.info}" var="info" status="i">
        '${info}'<g:if test="${(i+1) < file.info.size()}">,</g:if></g:each>
        ]</g:if>
    }<g:if test="${(s+1) < files.size()}">,</g:if></g:each>
}
};
App.Uploadr.finalOptions = App.Uploadr.finalOptions || {};
App.Uploadr.finalOptions['${name}'] =  $.extend({},  App.Uploadr.GlobalOptions, currUploadrOptions);
console.log("...App.Uploadr.finalOptions populated");
})(jQuery);
//$(document).ready(function() {
    //$('.${classname}[name=${name}]').uploadr();
//});