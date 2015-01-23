<%@ page import="test.EmployeeType" %>



<div class="form-group ${hasErrors(bean: employeeType, field: 'type', 'has-error')} required">
	<label for="type">
		<g:message code="employeeType.type.label" default="Type" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField class="form-control" name="type" value="${employeeType?.type}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employeeType, field: 'status', 'has-error')} required">
	<label for="status">
		<g:message code="employeeType.status.label" default="Status" />
		<span class="required-indicator">*</span>
	</label>
	<g:select class="form-control select2-simple" name="status" from="${employeeType.constraints.status.inList}" value="${employeeType?.status}" valueMessagePrefix="employeeType.status" noSelection="['': '']" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employeeType, field: 'description', 'has-error')} required">
	<label for="description">
		<g:message code="employeeType.description.label" default="Description" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField class="form-control" name="description" value="${employeeType?.description}" readonly="${show ?: false}"/>
</div>

