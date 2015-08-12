<%@ page import="grails.util.Holders" %>
<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><g:layoutTitle default="Hida"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <asset:link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
    <asset:link rel="apple-touch-icon" href="apple-icon-57x57.png"/>
    <asset:link rel="apple-touch-icon" sizes="114x114" href="apple-icon-144x144.png"/>
    <asset:stylesheet src="app-hida-all.css"/>
    <g:layoutHead/>
</head>
<body>
<g:render template="/layouts/header"/>
<div id="main-view" class="container">
    <g:layoutBody/>
</div>
<div class="footer" role="contentinfo"></div>
<div id="spinner" class="spinner" style="display:none;"><g:message code="spinner.alt" default="Loading&hellip;"/></div>
</body>
</html>