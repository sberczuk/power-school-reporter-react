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

function GradesView({gg}: { gg: YearGrades[] }) {
    if (!gg) {
        return null
    }
    const yearGrades = gg.filter((g) => g.year = "2022");
    // const gradesByClass<string, Grade> = new Map()
    // yearGrades.grades.forEach((e) =>{
    //     gradesByClass(e.)
    // })
    const display = []
    for (const g of yearGrades) {
        for (const og of g) {
            console.log(og)
            display.push(<GradeView g={og}/>)
        }
    }

    return (<>{display}</>)
}

function GradeView({g}: { g: Grade }) {
    if (g) {
        return (
            <>
                <div>{g.year}</div>
                <div>{g.quarter}</div>
                <div>{g.title}</div>
                <div>{g.letterGrade}</div>
            </>
        )
    }
}

export default App
