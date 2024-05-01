import {useState} from 'react'
import {StudentDisplay} from './Student.tsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {parseXML} from "./parser.ts";
import {Grade, Student, StudentReport, YearGrades,} from "./types.ts";


function App() {
    const [count, setCount] = useState(0)
    const [student, setStudent] = useState<Student>({familyName: "", givenName: "", middleName: ""})
    const [allGrades, setAllGrades] = useState<Grade[]>([])

    function onNewFile(e: any) {
        // TODO: should this use the input element event?
        const form = document.getElementById("form");
        // const submitter = document.querySelector("button[value=save]");
        // @ts-ignore
        const formData = new FormData(form, null);
        const gradeReport: FormDataEntryValue | null = formData.get('gradeReport');
        const r = new FileReader()
        // @ts-ignore
        r.readAsText(gradeReport)
        r.onloadend = () => {
            if (typeof r.result === "string") {
                const data: StudentReport = parseXML(r.result);
                setStudent(data.student)
                console.log("STUDENT")
                console.log(data.student)
                setAllGrades(data.grades)
                console.log("done parsing data")
                console.log(data.grades)
            }
        }
    }

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Power School Reporter Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
            {/*<FileUpload onFileLoaded={onNewFile}></FileUpload>*/}
            <div>
                <form id='form'>
                    <label htmlFor={'gradeReport'}>Select a Power School Data File:</label>&nbsp;
                    <input type="file" name="gradeReport" onChange={onNewFile} className='form-control'/>
                    {/*<button name="intent" value="save">Process</button>*/}
                </form>
            </div>
            <StudentDisplay student={student}/>
            <GradesView gg={allGrades}/>
        </>
    )
}

function SubjectView({grades}: { grades: Grade[] | undefined }) {
    if (!grades) {
        return (
            <></>
        )
    }
    const displayGrades = []
    const displayComments = []
    let courseTitle = ''
    let courseCode = ''
    for (const a of grades) {
        const quarter = a.quarter.toLowerCase();
        courseTitle = a.title
        courseCode = a.code
        displayGrades.push(<GradeView g={a}/>)
        displayComments.push(<div className={'comments-' +quarter +' comments'}>{a.comments}</div> )
    }
    return (
        <>
            <div className={'grid-container'}>
                <div className={'course-title'}>{courseTitle} {courseCode}</div>
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

function GradesView({gg}: { gg: Grade[] }) {
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
    const display = []
    console.log("GBC")
    console.log(gradesByClass)

    // for each class grab each grade and display it
    function displaySubjectGrade(v, k, map) {
        console.log("displaying " + k + " " + v.length)
        for (const a of v) {
            console.log("...displaying " + a.code)

            display.push(<SubjectView key={a.code + a.year + a.quarter} grades={v}/>)
        }
        console.log("DONE displaying " + k)

    }

    // const subjectIterator = gradesByClass.keys()
    // let subject = subjectIterator.next();
    // while (subject) {
    //     const grades = gradesByClass.get(subject);
    //     display.push(<SubjectView key={subject} grades={grades}/>)
    //
    //     subject = subjectIterator.next()
    // }
    gradesByClass.forEach(displaySubjectGrade)

    console.log("DISPLAY ARRAY " + display.length)
    console.log(display)
    return (<>
        {display}
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
                <div className={'grade-' + quarter +' grades'}>{g.letterGrade} {g.numberGrade}</div>
                <div className={'absent-' + quarter + ' grades'}>{g.daysAbsent}</div>
                {/*</div>*/}

            </>
        )
    }
}

export default App
