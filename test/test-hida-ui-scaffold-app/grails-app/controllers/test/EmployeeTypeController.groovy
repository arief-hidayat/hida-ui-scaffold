package test




import org.springframework.http.HttpStatus

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.util.Holders

@Transactional(readOnly = true)
class EmployeeTypeController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def createForm() {
        render(model: [employeeTypeInstance: new EmployeeType(params)], view: "_partialCreate")
    }
    def editForm(EmployeeType employeeTypeInstance) {
        render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialEdit")
    }
    def showForm(EmployeeType employeeTypeInstance) {
        render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialShow") //
    }


    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        if(EmployeeType.class.simpleName in Holders.config.imms?.singlePage ?:[]) {
            render view: "singlepage", model: [employeeTypeInstance: new EmployeeType()]
        } else {
            respond new EmployeeType()
        }
    }
    def create() {
        if(params._partial) {
            render(model: [employeeTypeInstance: new EmployeeType(params)], view: "_partialCreate")
            return
        }
        respond new EmployeeType(params)
    }
    def show(EmployeeType employeeTypeInstance) {
        if(params._partial) {
            render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialShow")
            return
        }
        respond employeeTypeInstance
    }
    def edit(EmployeeType employeeTypeInstance) {
        if(params._partial) {
            render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialEdit")
            return
        }
        respond employeeTypeInstance
    }




    @Transactional
    def save(EmployeeType employeeTypeInstance) {
        if (employeeTypeInstance == null) {
            notFound()
            return
        }

        if (employeeTypeInstance.hasErrors()) {
            if(params._partial) {
                response.status = 412
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialCreate")
                return
            }
            respond employeeTypeInstance.errors, view:'create'
            return
        }



        String msg = message(code: 'default.created.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), employeeTypeInstance.id])
        try {
            employeeTypeInstance.save flush:true, failOnError: true
            if(params._partial) {
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialShow")
                return
            }
        } catch(Exception e) {
            if(params._partial) {
                response.status = 500
                if (!employeeTypeInstance.hasErrors()) {
                    flash.message = e.getMessage()
                }
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect employeeTypeInstance
            }
            '*' { respond employeeTypeInstance, [status: CREATED] }
        }
    }


    @Transactional
    def update(EmployeeType employeeTypeInstance) {
        if (employeeTypeInstance == null) {
            notFound()
            return
        }

        if (employeeTypeInstance.hasErrors()) {
            if(params._partial) {
                response.status = 412
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialEdit")
                return
            }
            respond employeeTypeInstance.errors, view:'edit'
            return
        }
        String msg = message(code: 'default.updated.message', args: [message(code: 'EmployeeType.label', default: 'EmployeeType'), employeeTypeInstance.id])
        try {
            employeeTypeInstance.save flush:true, failOnError: true
            if(params._partial) {
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_partialShow")
                return
            }
        } catch(Exception e) {
            if(params._partial) {
                response.status = 500
                if (!employeeTypeInstance.hasErrors()) {
                    flash.message = e.getMessage()
                }
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_message")
                return
            }
        }

        request.withFormat {
            form multipartForm {
                flash.message = msg
                redirect employeeTypeInstance
            }
            '*'{ respond employeeTypeInstance, [status: OK] }
        }
    }

    @Transactional
    def deleteJSON() {
        EmployeeType employeeTypeInstance = EmployeeType.get(params.id)
        if(employeeTypeInstance == null) {
            renderJsonMessage(message(code: 'default.not.found.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), params.id]), params, NOT_FOUND)

            return
        }
        try {
            employeeTypeInstance.delete flush: true
            renderJsonMessage(message(code: 'default.deleted.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), employeeTypeInstance.id]), params, OK)

        } catch(Exception e) {
            log.error("Failed to delete EmployeeType. params ${params}", e)
            renderJsonMessage(message(code: 'default.not.deleted.message', args: [message(code: 'employeeType.label', default: 'EmployeeType'), employeeTypeInstance.id]), params, INTERNAL_SERVER_ERROR)

        }
    }

    @Transactional
    def delete(EmployeeType employeeTypeInstance) {

        if (employeeTypeInstance == null) {
            notFound()
            return
        }

        String msg = message(code: 'default.deleted.message', args: [message(code: 'EmployeeType.label', default: 'EmployeeType'), employeeTypeInstance.id])
        try {
            employeeTypeInstance.delete flush:true
            if(params._partial) {
                render(model: [employeeTypeInstance: new EmployeeType(params)], view: "_partialCreate")
                return
            }
        } catch(Exception e) {
            if(params._partial) {
                response.status = 500
                if (!employeeTypeInstance.hasErrors()) {
                    flash.message = e.getMessage()
                }
                render(model: [employeeTypeInstance: employeeTypeInstance], view: "_message")
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
