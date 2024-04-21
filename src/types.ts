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

interface Term {
    courses: Course[];
}