<%@ page import="test.EmployeeType" %>



<div class="form-group ${hasErrors(bean: employeeTypeInstance, field: 'type', 'has-error')} required">
	<label for="type">
		<g:message code="employeeType.type.label" default="Type" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField class="form-control" name="type" value="${employeeTypeInstance?.type}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employeeTypeInstance, field: 'description', 'has-error')} required">
	<label for="description">
		<g:message code="employeeType.description.label" default="Description" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField class="form-control" name="description" value="${employeeTypeInstance?.description}" readonly="${show ?: false}"/>
</div>

