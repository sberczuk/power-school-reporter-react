export interface Student {
    givenName: string
    middleName: string
    familyName: string
}

interface MarkingPeriod {
    numberGrade: string
    letterGrade: string
    comments: string

}

interface Course {
    code: string
    title: string
    markingPeriod: MarkingPeriod[];

}

export interface YearGrades{
    year: string
    grades:Grade[]
}

export interface Grade {
    code: string
    title:string
    instructor:string
    year:string
    quarter: string
    numberGrade: string
    letterGrade: string
    comments:string
    daysAbsent:string
}

interface Term {
    courses: Course[];
}