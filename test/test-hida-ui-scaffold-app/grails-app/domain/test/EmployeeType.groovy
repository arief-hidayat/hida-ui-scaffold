package test

class EmployeeType {

    String type
    String description

    static constraints = {
        type unique: true
    }
}
