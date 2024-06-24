import {Grade} from "./types.ts";
import {GradeView} from "./GradeView.tsx";

export function SubjectView({grades}: { grades: Grade[] | undefined }) {
    if (!grades) {
        return (
            <></>
        )
    }
    const displayGrades = []
    const displayComments = []
    let courseTitle = ''
    let teacher = ''
    let courseCode = ''
    let year =''
    let school = ''
    for (const a of grades) {
        const quarter = a.quarter.toLowerCase();
        courseTitle = a.title
        courseCode = a.code
        teacher = a.instructor
        year = a.year
         school = a.school
        const key = a.year+a.quarter+a.code;

        displayGrades.push(<GradeView g={a} key={key}/>)
        console.log("YEAR")
        console.log(a.year)
        displayComments.push(<div key={a.year + a.quarter+a.code+'comments'} className={'comments-' + quarter + ' comments'}>{a.quarter + ': ' + a.comments}</div>)
    }
    return (
        <>
            <div className={'grid-container'}>
                <div className={'course-title course'}>{courseTitle} {courseCode} {year} -- {school}</div>
                <div className={'course-teacher teacher'}>{teacher}</div>
                <div className={'grade-container'}>
                    {displayGrades}
                </div>
                <div className={'comments-container'}>
                    {displayComments}
                </div>
            </div>
        </>
    )
        ;
}