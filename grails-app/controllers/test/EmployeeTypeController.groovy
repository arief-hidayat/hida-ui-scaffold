package test




import org.springframework.http.HttpStatus

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.util.Holders

@Transactional(readOnly = true)
class EmployeeTypeController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def createForm() {
        render(model: [employeeType: new EmployeeType(params)], view: "_partialCreate")
    }
    def editForm(EmployeeType employeeType) {
        render(model: [employeeType: employeeType], view: "_partialEdit")
    }
    def showForm(EmployeeType employeeType) {
        render(model: [employeeType: employeeType], view: "_partialShow") //
    }


    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        if(EmployeeType.class.simpleName in Holders.config.hida?.singlePage ?:[]) {
            render view: (params._partial ? "_partialSinglePage" : "singlepage") , model: [employeeType: new EmployeeType(), prefix : params._prefix]
        } else {
            respond new EmployeeType()
        }
    }
    def create() {
        if(params._partial) {
            render(model: [employeeType: new EmployeeType(params)], view: "_partialCreate")
            return
        }
        respond new EmployeeType(params)
    }
    def show(EmployeeType employeeType) {
        if(params._partial) {
            render(model: [employeeType: employeeType], view: "_partialShow")
            return
        }
        respond employeeType
    }
    def edit(EmployeeType employeeType) {
        if(params._partial) {
            render(model: [employeeType: employeeType], view: "_partialEdit")
            return
        }
        respond employeeType
    }




    @Transactional
    def save(EmployeeType employeeType) {
        if (employeeType == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (employeeType.hasErrors()) {
            transactionStatus.setRollbackOnly()
            if(params._partial) {
                response.status = 412
                render(model: [employeeType: employeeType], view: "_partialCreate")
                return
            }
            respond employeeType.errors, view:'create'
            return
        }



        String msg = message(code: 'default.created.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), employeeType.id])
        try {
            employeeType.save failOnError: true
            if(params._partial) {
                render(model: [employeeType: employeeType], view: "_partialShow")
                return
            }
        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            if(params._partial) {
                response.status = 500
                if (!employeeType.hasErrors()) {
                    while(e.cause) e = e.cause
                    flash.message = e.getMessage()
                }
                render(model: [employeeType: employeeType], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect employeeType
            }
            '*' { respond employeeType, [status: CREATED] }
        }
    }


    @Transactional
    def update(EmployeeType employeeType) {
        if (employeeType == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (employeeType.hasErrors()) {
            transactionStatus.setRollbackOnly()
            if(params._partial) {
                response.status = 412
                render(model: [employeeType: employeeType], view: "_partialEdit")
                return
            }
            respond employeeType.errors, view:'edit'
            return
        }
        String msg = message(code: 'default.updated.message', args: [message(code: 'EmployeeType.label', default: 'EmployeeType'), employeeType.id])
        try {
            employeeType.save failOnError: true
            if(params._partial) {
                render(model: [employeeType: employeeType], view: "_partialShow")
                return
            }
        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            if(params._partial) {
                response.status = 500
                if (!employeeType.hasErrors()) {
                    while(e.cause) e = e.cause
                    flash.message = e.getMessage()
                }
                render(model: [employeeType: employeeType], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect employeeType
            }
            '*'{ respond employeeType, [status: OK] }
        }
    }

    @Transactional
    def deleteJSON() {
        EmployeeType employeeType = EmployeeType.get(params.id)
        if(employeeType == null) {
            transactionStatus.setRollbackOnly()
            renderJsonMessage(message(code: 'default.not.found.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), params.id]), params, NOT_FOUND)

            return
        }
        try {
            employeeType.delete flush: true
            renderJsonMessage(message(code: 'default.deleted.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), employeeType.id]), params, OK)

        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            log.error("Failed to delete EmployeeType. params ${params}", e)
            renderJsonMessage(message(code: 'default.not.deleted.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), employeeType.id]), params, INTERNAL_SERVER_ERROR)

        }
    }

    @Transactional
    def delete(EmployeeType employeeType) {

        if (employeeType == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        String msg = message(code: 'default.deleted.message', args: [message(code: 'EmployeeType.label', default: 'EmployeeType'), employeeType.id])
        try {
            employeeType.delete flush:true
            if(params._partial) {
                render(model: [employeeType: new EmployeeType(params)], view: "_partialCreate")
                return
            }
        } catch(Exception e) {
            transactionStatus.setRollbackOnly()
            if(params._partial) {
                response.status = 500
                if (!employeeType.hasErrors()) {
                    while(e.cause) e = e.cause
                    flash.message = e.getMessage()
                }
                render(model: [employeeType: employeeType], view: "_message")
                return
            }
        }
        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        String msg = message(code: 'default.not.found.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), params.id])
        if(params._partial) {
            render(status: NOT_FOUND, text: msg)
            return
        }
        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
    private def renderJsonMessage(String msg, def parameter, HttpStatus status) {
        render(status: status, contentType: "application/json;  charset=utf-8") {
            [message : msg, params : parameter]
        }
    }
}
