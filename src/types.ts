export interface Student {
    givenName: string,
    middleName: string,
    familyName: string,
}




export interface StudentReport {
    student: Student
    years :string[]
    grades: Grade[]
}


export interface Grade {
    code: string
    title: string
    instructor: string
    school:string
    year: string
    grade: string
    quarter: string
    numberGrade: string
    letterGrade: string
    comments: string
    daysAbsent: string
}

