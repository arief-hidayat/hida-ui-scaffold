<%=packageName ? "package ${packageName}\n\n" : ''%>


import com.hida.ui.dt.DataTableRequest
import com.hida.ui.dt.DataTableResponse
import grails.converters.JSON
import org.springframework.http.HttpStatus

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.validation.ValidationException
import org.springframework.validation.Errors

@Transactional(readOnly = true)
class ${className}Controller {
    private static final String PARTIAL_CREATE = "_partialCreate"
    private static final String PARTIAL_EDIT = "_partialEdit"
    private static final String PARTIAL_SHOW = "_partialShow"
    private static final String INDEX = "index"
    private static final String FILTER_PREFIX = "f_"
    private static final String SEARCH_PREFIX = "filter_"

    static allowedMethods = [save: "POST", update: "POST", delete: "DELETE"]
    protected Map viewParamFor(String viewName, ${className} instance, def params) {
        def searchFilter = getFilterData(params, SEARCH_PREFIX)
        [model: [${propertyName}: instance, prefix : params._prefix ?: '' , filter : searchFilter, access : getAccess()],
         view: viewName]
    }

    private Map getFilterData(def params, String prefix) {
        if (params.filter && params.filter instanceof Map) return params.filter
        Map filter = [:]
        params.each { String key, val ->
            if (key.startsWith(prefix)) {
                filter.put(key.substring(prefix.length()), val)
            }
        }
        filter
    }

    private def getAccess() {
        [create : true, update : true, read : true, delete : true] // TODO: override with access control.
    }

    def dataTableService
    def list() {
        DataTableRequest req = new DataTableRequest(params)
        try {
            Map filterData = getFilterData(params, FILTER_PREFIX)
            Map searchFilterData = getFilterData(params, SEARCH_PREFIX)
            render dataTableService.list("${className}", req, filterData) as JSON
            return
        } catch(Exception e) {
            println e.message
        }
        render new DataTableResponse(draw: req.draw, recordsTotal: 0, recordsFiltered: 0) as JSON
    }
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        render viewParamFor(INDEX, new ${className}(), params)
    }
    def createForm() { render viewParamFor(PARTIAL_CREATE, new ${className}(params), params) }
    def editForm(${className} ${propertyName}) { render viewParamFor(PARTIAL_EDIT, ${propertyName}, params) }
    def showForm(${className} ${propertyName}) { render viewParamFor(PARTIAL_SHOW, ${propertyName}, params) }

    @Transactional
    def save(${className} ${propertyName}) {
        if (${propertyName} == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }
        if (${propertyName}.hasErrors()) {
            transactionStatus.setRollbackOnly()
            response.status = 412
            render viewParamFor(PARTIAL_CREATE, ${propertyName}, params)
            return
        }
        try {
            ${propertyName}.save failOnError: true
            flash.info = messageOnCreatedItem(${propertyName})
            render viewParamFor(PARTIAL_SHOW, ${propertyName}, params)
            return
        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            renderErrorMessage(${propertyName}, e)
            return
        }
    }

    @Transactional
    def update(${className} ${propertyName}) {
        if (${propertyName} == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }
        if (${propertyName}.hasErrors()) {
            transactionStatus.setRollbackOnly()
            response.status = 412
            render viewParamFor(PARTIAL_EDIT, ${propertyName}, params)
            return
        }
        try {
            ${propertyName}.save failOnError: true
            flash.info = messageOnUpdatedItem(${propertyName})
            render viewParamFor(PARTIAL_SHOW, ${propertyName}, params)
            return
        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            renderErrorMessage(${propertyName}, e)
            return
        }
    }

    @Transactional
    def delete(${className} ${propertyName}) {
        if (${propertyName} == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        String msg = messageOnDeletedItem(${propertyName})
        try {
            ${propertyName}.delete flush:true
            flash.info = msg
            render viewParamFor(PARTIAL_CREATE, new ${className}(), params)
            return
        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            renderErrorMessage(${propertyName}, e)
            return
        }
    }

    protected void renderErrorMessage(${className} instance, Exception e) {
        String errMessage = instance?.hasErrors() ? errorsToString(instance.errors) : getExceptionMessage(e)
        render(status: INTERNAL_SERVER_ERROR, text: errMessage)
    }
    protected String getExceptionMessage(Exception e) {
        if(e instanceof ValidationException) { // due to validation error thrown from other objects
            return errorsToString(e.errors)
        } else {
            while(e.cause) e = e.cause
            return e.getMessage()
        }
        return null
    }
    protected String errorsToString(Errors errors) {
        errors.allErrors.collect { "<p class='bg-danger'>\${message(error: it)}</p>" }.join("")
    }
    protected void notFound() { render(status: NOT_FOUND, text: messageOnNotFoundItem(params)); return }
    private def renderJsonMessage(String msg, def parameter, HttpStatus status) {
        render(status: status, contentType: "application/json;  charset=utf-8") { [message : msg, params : parameter] }
    }

    private String messageOnCreatedItem(${className} instance) { defaultMessageOnItem('default.created.message', instance) }
    private String messageOnUpdatedItem(${className} instance) { defaultMessageOnItem('default.updated.message', instance) }
    private String messageOnDeletedItem(${className} instance) { defaultMessageOnItem('default.deleted.message', instance) }
    private String messageOnNotDeletedItem(${className} instance) { defaultMessageOnItem('default.not.deleted.message', instance) }
    private String defaultMessageOnItem(String code, ${className} instance){
        message(code: code, args: [message(code: '${domainClass.propertyName}.label', default: '${domainClass.naturalName}'), instance.toString()])
    }
    private String messageOnNotFoundItem(def params) {
        message(code: 'default.not.found.message', args: [message(code: '${domainClass.propertyName}.label', default: '${domainClass.naturalName}'), params.id])
    }
}
