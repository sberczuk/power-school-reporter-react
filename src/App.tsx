import {ChangeEventHandler, useState} from 'react'
import {StudentDisplay} from './Student.tsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {mimeToXml, parseXML} from "./parser.ts";
import {Grade, Student, StudentReport,} from "./types.ts";
import {GradesView} from "./GradesView.tsx";
import {Instructions} from "./Instructions.tsx";


// yearValues appears to be unset
function YearSelector({yearValues, onChange}: {
    yearValues: string[],
    onChange: ChangeEventHandler
}): JSX.Element {
    const yearSelectOptions = () => {
        // if (values.length < 0) {
        // add a  default blank value
        yearValues.push("-")
        const elements = yearValues.sort().map((v) => {
            return <option key={v} value={v}>{v}</option>
        });
        console.log("OPTIONS")
        console.log(elements)
        return elements;
        // }  else  {
        //     return  []
        // }
    }
    return (<label>
        Select year:
        <select name={'year'} onChange={onChange} defaultValue={'-'}>
            {yearSelectOptions()}
        </select>
    </label>)

}

function App() {
    const [student, setStudent] = useState<Student>({familyName: "", givenName: "", middleName: ""})
    const [allGrades, setAllGrades] = useState<Grade[]>([])
    const [allYears, setAllYears] = useState<string[]>([])
    const [selectedYear, setSelectedYear] = useState('')

    function onNewFile(_e: any) {
        // TODO: should this use the input element event?
        const form = document.getElementById("form");
        // @ts-ignore
        const formData = new FormData(form, null);
        const gradeReport: FormDataEntryValue | null = formData.get('gradeReport');
        const r = new FileReader()
        // @ts-ignore
        r.readAsText(gradeReport)
        r.onloadend = () => {
            if (typeof r.result === "string") {
                const xmlStr = mimeToXml(r.result);
                const data: StudentReport = parseXML(xmlStr);
                setStudent(data.student)
                setAllGrades(data.grades)
                setAllYears(data.years)
                console.log('got years')
                console.log(data.years)
            }
        }
    }


    //TODO: Find the right type
    function updateSelectedYear(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedYear(e.target.value)
        e.preventDefault()
    }

// mame years change. Allow for  update when the year is selected.
    return (
        <>
            <div className={'noPrint'}>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1 className={'noPrint'}>Power School Reporter Vite + React</h1>
            <Instructions/>
            {/*<FileUpload onFileLoaded={onNewFile}></FileUpload>*/}
            <div className={'noPrint'}>
                <form id='form'>
                    <label htmlFor={'gradeReport'}>Select a Power School Data File:</label>&nbsp;
                    <input type="file" name="gradeReport" onChange={onNewFile} className='form-control'/>
                    {/*<button name="intent" value="save">Process</button>*/}
                </form>

                <YearSelector yearValues={allYears} onChange={updateSelectedYear}/>
            </div>
            <StudentDisplay student={student}/>
            <GradesView gg={allGrades} selectedYear={selectedYear}/>
        </>
    )
}

export default App
