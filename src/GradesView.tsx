import {Grade} from "./types.ts";
import {useState} from "react";

function SubjectView({grades}: { grades: Grade[] | undefined }) {
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
                <div className={'course-title'}>{courseTitle} {courseCode}</div>
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

export function GradesView({gg}: { gg: Grade[] }) {
    const [allGrades] = useState<Grade[]>(gg)
    console.log("GRADES VIEW " + gg.length)
    if (!gg) {
        return null
    }
    const yearGrades = gg.filter((g) => g.year = "2022");
    const gradesByClass = new Map<string, Grade[]>()
    yearGrades.forEach((e) => {
        if (!gradesByClass.get(e.code)) {
            gradesByClass.set(e.code, [])
        }
        gradesByClass.get(e.code)?.push(e)
    })


    const buildGradeRows = () => {
        const rows: React.JSX.Element[] = [];

        function displaySubjectGrade(v, k, map) {
            rows.push(<SubjectView key={k} grades={v}/>)
        }

        gradesByClass.forEach(displaySubjectGrade)
        console.log("returning rows >>" + rows.length)
        return rows

    }

    return (<>
        {buildGradeRows()}
    </>)
}

function GradeView({g}: { g: Grade }) {
    if (g) {
        const quarter = g.quarter.toLowerCase();
        return (
            <>
                {/*<div className={'grade-container'}>*/}
                <div className={quarter + ' period'}>{g.quarter}</div>
                {/*<div>{g.year}</div>*/}
                {/*<div>{g.title}</div>*/}
                <div className={'grade-' + quarter + ' grades'}>{g.letterGrade} {g.numberGrade}</div>
                <div className={'absent-' + quarter + ' grades'}>{'absent: ' + g.daysAbsent}</div>
                {/*</div>*/}

            </>
        )
    }
}