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

function GradesView({gg}: { gg: Grade[] }) {
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

    // for each class grab each grade and display it
    function displaySubectGrade(v, k, map) {
        for (const a of v) {
            display.push(<GradeView key={a.code + a.year + a.quarter} g={a}/>)
        }
    }

    gradesByClass.forEach(displaySubectGrade)


    return (<>
        <div class={'gradeContainer'}>
            {display}
        </div>
    </>)
}

function GradeView({g}: { g: Grade }) {
    if (g) {
        return (
            <>
                <div class={'grid-container'}>
                    <div class={g.quarter.toLowerCase()}>
                        <div>{g.year}</div>
                        <div>{g.quarter}</div>
                        <div>{g.title}</div>
                        <div class={'grade-' + g.quarter.toLowerCase()}>{g.letterGrade} {g.grade}</div>
                    </div>
                </div>

            </>
        )
    }
}

export default App
