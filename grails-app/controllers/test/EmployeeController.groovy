package test


import org.springframework.http.HttpStatus

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.util.Holders

@Transactional(readOnly = true)
class EmployeeController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def createForm() {
        render(model: [employee: new Employee(params)], view: "_partialCreate")
    }

    def editForm(Employee employee) {
        render(model: [employee: employee], view: "_partialEdit")
    }

    def showForm(Employee employee) {
        render(model: [employee: employee], view: "_partialShow") //
    }


    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        if (Employee.class.simpleName in Holders.config.hida?.singlePage ?: []) {
            render view: (params._partial ? "_partialSinglePage" : "singlepage"), model: [employee: new Employee(), prefix: params._prefix]
        } else {
            respond new Employee()
        }
    }

    def create() {
        if (params._partial) {
            render(model: [employee: new Employee(params)], view: "_partialCreate")
            return
        }
        respond new Employee(params)
    }

    def show(Employee employee) {
        if (params._partial) {
            render(model: [employee: employee], view: "_partialShow")
            return
        }
        respond employee
    }

    def edit(Employee employee) {
        if (params._partial) {
            render(model: [employee: employee], view: "_partialEdit")
            return
        }
        respond employee
    }


    @Transactional
    def save(Employee employee) {
        if (employee == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (employee.hasErrors()) {
            transactionStatus.setRollbackOnly()
            if (params._partial) {
                response.status = 412
                render(model: [employee: employee], view: "_partialCreate")
                return
            }
            respond employee.errors, view: 'create'
            return
        }



        String msg = message(code: 'default.created.message', args: [message(code: 'employee.label', default: 'Employee'), employee.id])
        try {
            employee.save failOnError: true
            if (params._partial) {
                render(model: [employee: employee], view: "_partialShow")
                return
            }
        } catch (Exception e) {
            transactionStatus.setRollbackOnly()
            if (params._partial) {
                response.status = 500
                if (!employee.hasErrors()) {
                    while (e.cause) e = e.cause
                    flash.message = e.getMessage()
                }
                render(model: [employee: employee], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect employee
            }
            '*' { respond employee, [status: CREATED] }
        }
    }


    @Transactional
    def update(Employee employee) {
        if (employee == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (employee.hasErrors()) {
            transactionStatus.setRollbackOnly()
            if (params._partial) {
                response.status = 412
                render(model: [employee: employee], view: "_partialEdit")
                return
            }
            respond employee.errors, view: 'edit'
            return
        }
        String msg = message(code: 'default.updated.message', args: [message(code: 'Employee.label', default: 'Employee'), employee.id])
        try {
            employee.save failOnError: true
            if (params._partial) {
                render(model: [employee: employee], view: "_partialShow")
                return
            }
        } catch (Exception e) {
            transactionStatus.setRollbackOnly()
            if (params._partial) {
                response.status = 500
                if (!employee.hasErrors()) {
                    while (e.cause) e = e.cause
                    flash.message = e.getMessage()
                }
                render(model: [employee: employee], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect employee
            }
            '*' { respond employee, [status: OK] }
        }
    }

    @Transactional
    def deleteJSON() {
        Employee employee = Employee.get(params.id)
        if (employee == null) {
            transactionStatus.setRollbackOnly()
            renderJsonMessage(message(code: 'default.not.found.message', args: [message(code: 'employee.label', default: 'Employee'), params.id]), params, NOT_FOUND)

            return
        }
        try {
            employee.delete flush: true
            renderJsonMessage(message(code: 'default.deleted.message', args: [message(code: 'employee.label', default: 'Employee'), employee.id]), params, OK)

        } catch (Exception e) {
            transactionStatus.setRollbackOnly()
            log.error("Failed to delete Employee. params ${params}", e)
            renderJsonMessage(message(code: 'default.not.deleted.message', args: [message(code: 'employee.label', default: 'Employee'), employee.id]), params, INTERNAL_SERVER_ERROR)

        }
    }

    @Transactional
    def delete(Employee employee) {

        if (employee == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        String msg = message(code: 'default.deleted.message', args: [message(code: 'Employee.label', default: 'Employee'), employee.id])
        try {
            employee.delete flush: true
            if (params._partial) {
                render(model: [employee: new Employee(params)], view: "_partialCreate")
                return
            }
        } catch (Exception e) {
            transactionStatus.setRollbackOnly()
            if (params._partial) {
                response.status = 500
                if (!employee.hasErrors()) {
                    while (e.cause) e = e.cause
                    flash.message = e.getMessage()
                }
                render(model: [employee: employee], view: "_message")
                return
            }
        }
        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect action: "index", method: "GET"
            }
            '*' { render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        String msg = message(code: 'default.not.found.message', args: [message(code: 'employee.label', default: 'Employee'), params.id])
        if (params._partial) {
            render(status: NOT_FOUND, text: msg)
            return
        }
        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect action: "index", method: "GET"
            }
            '*' { render status: NOT_FOUND }
        }
    }

    private def renderJsonMessage(String msg, def parameter, HttpStatus status) {
        render(status: status, contentType: "application/json;  charset=utf-8") {
            [message: msg, params: parameter]
        }
    }
}
