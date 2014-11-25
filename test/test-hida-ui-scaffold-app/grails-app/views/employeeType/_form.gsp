<%@ page import="test.EmployeeType" %>



<div class="form-group ${hasErrors(bean: employeeTypeInstance, field: 'type', 'has-error')} required">
	<label for="type">
		<g:message code="employeeType.type.label" default="Type" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField class="form-control" name="type" value="${employeeTypeInstance?.type}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employeeTypeInstance, field: 'status', 'has-error')} required">
	<label for="status">
		<g:message code="employeeType.status.label" default="Status" />
		<span class="required-indicator">*</span>
	</label>
	<g:select class="form-control" name="status" from="${employeeTypeInstance.constraints.status.inList}" value="${employeeTypeInstance?.status}" valueMessagePrefix="employeeType.status" noSelection="['': '']" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employeeTypeInstance, field: 'description', 'has-error')} required">
	<label for="description">
		<g:message code="employeeType.description.label" default="Description" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField class="form-control" name="description" value="${employeeTypeInstance?.description}" readonly="${show ?: false}"/>
</div>

