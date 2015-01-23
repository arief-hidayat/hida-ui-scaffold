package test

class EmployeeType {

    String type
	String status
    String description

    static constraints = {
        type unique: true
		status inList : [ "ACTIVE", "INACTIVE" ]
    }
}
