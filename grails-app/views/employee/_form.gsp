<%@ page import="test.Employee" %>



<div class="form-group ${hasErrors(bean: employee, field: 'code', 'has-error')} required">
    <label for="code">
        <g:message code="employee.code.label" default="Code"/>
        <span class="required-indicator">*</span>
    </label>
    <g:textField class="form-control" name="code" value="${employee?.code}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employee, field: 'commencementDate', 'has-error')} required">
    <label for="commencementDate">
        <g:message code="employee.commencementDate.label" default="Commencement Date"/>
        <span class="required-indicator">*</span>
    </label>
    <bs:datePicker id="employee-commencementDate" field="commencementDate" value="${employee?.commencementDate}"
                   readonly="${show ?: false}"></bs:datePicker>
</div>

<div class="form-group ${hasErrors(bean: employee, field: 'fullName', 'has-error')} required">
    <label for="fullName">
        <g:message code="employee.fullName.label" default="Full Name"/>
        <span class="required-indicator">*</span>
    </label>
    <g:textField class="form-control" name="fullName" value="${employee?.fullName}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employee, field: 'jobTitle', 'has-error')} required">
    <label for="jobTitle">
        <g:message code="employee.jobTitle.label" default="Job Title"/>
        <span class="required-indicator">*</span>
    </label>
    <g:textField class="form-control" name="jobTitle" value="${employee?.jobTitle}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employee, field: 'lastModifiedBy', 'has-error')} required">
    <label for="lastModifiedBy">
        <g:message code="employee.lastModifiedBy.label" default="Last Modified By"/>
        <span class="required-indicator">*</span>
    </label>
    <bs:dateTimePicker id="employee-lastModifiedBy" field="lastModifiedBy" value="${employee?.lastModifiedBy}"
                       readonly="${show ?: false}"></bs:dateTimePicker>
</div>

<div class="form-group ${hasErrors(bean: employee, field: 'salary', 'has-error')} required">
    <label for="salary">
        <g:message code="employee.salary.label" default="Salary"/>
        <span class="required-indicator">*</span>
    </label>
    <g:field type="number" class="form-control" name="salary" required=""
             value="${fieldValue(bean: employee, field: 'salary')}" readonly="${show ?: false}"/>
</div>

<div class="form-group ${hasErrors(bean: employee, field: 'type', 'has-error')} required">
    <label for="type">
        <g:message code="employee.type.label" default="Type"/>
        <span class="required-indicator">*</span>
    </label>
    <g:textField class="form-control" name="type" value="${employee?.type}" readonly="${show ?: false}"/>
</div>

