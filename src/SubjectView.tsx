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
    for (const a of grades) {
        const quarter = a.quarter.toLowerCase();
        courseTitle = a.title
        courseCode = a.code
        teacher = a.instructor
        displayGrades.push(<GradeView g={a}/>)
        displayComments.push(<div className={'comments-' + quarter + ' comments'}>{a.quarter + ': ' + a.comments}</div>)
    }
    return (
        <>
            <div className={'grid-container'}>
                <div className={'course-title course'}>{courseTitle} {courseCode}</div>
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