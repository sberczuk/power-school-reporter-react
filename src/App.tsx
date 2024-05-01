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

function GradesView({gg}: { gg: Grade[] }) {
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
    const display = []
    console.log("GBC")
    console.log(gradesByClass)

    // for each class grab each grade and display it
    let calls = 0


    const buildGradeRows = () => {
        const rows: React.JSX.Element[] = [];

        function displaySubjectGrade(v, k, map) {
            rows.push(<SubjectView key={k} grades={v}/>)
        }


        gradesByClass.forEach(displaySubjectGrade)
        console.log("returning rows >>" + rows.length)
        return rows

    }
    // const subjectIterator = gradesByClass.keys()
    // let subject = subjectIterator.next();
    // while (subject) {
    //     let grades:Grade[]
    //     if (gradesByClass.has(subject.value)){
    //         // @ts-ignore
    //         grades =  gradesByClass.get(subject.value);
    //     }
    //
    //     for (const a:Grade of grades) {
    //         display.push(<SubjectView key={a.code + a.year + a.quarter} grades={grades}/>)
    //     }
    //
    //     subject = subjectIterator.next()
    // }


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

export default App
