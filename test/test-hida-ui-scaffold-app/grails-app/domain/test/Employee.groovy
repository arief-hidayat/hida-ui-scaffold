package test

import org.joda.time.LocalDate
import org.joda.time.LocalDateTime

class Employee {
    String code
    String type // from EmployeeType
    String jobTitle
    String fullName

    BigDecimal salary = BigDecimal.ZERO

    LocalDate commencementDate
    LocalDateTime lastModifiedBy

    static constraints = {
        code unique: true
    }
}
