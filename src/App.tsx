import {useState} from 'react'
import {StudentDisplay} from './Student.tsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {allTermsXPath, buildCourseGrades, findElementIterator} from "./parser.ts";
import {YearGrades} from "./types.ts";

function parseXML(xmlStr: string) {
    // see [xpath tester](https://extendsclass.com/xpath-tester.html)

    // call the cleanup later
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "application/xml");
    const allYearData: YearGrades[] = []
// print the name of the root element or error message
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
        console.log("error while parsing");
        console.log(errorNode);
    } else {
        // see https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript
        console.log(doc.documentElement.nodeName);
        //const nsResolver = doc.createNSResolver(doc.documentElement);
        const terms = findElementIterator(doc, doc.documentElement, allTermsXPath);
        console.log(terms)
        let r = terms.iterateNext()
        console.log("iterating")
        while (r) {
            console.log(r);

            const g = buildCourseGrades(doc, r);
            allYearData.push(g);
            r = terms.iterateNext();
        }
    }
    return allYearData
}


function App() {
    const [count, setCount] = useState(0)
    const [report, setReport] = useState('');

    const ss = {
        givenName: 'John',
        middleName: 'Q',
        familyName: 'Public'
    }


    function onNewFile(e: any) {
        // TODO: shold this use the input eleement event?
        const form = document.getElementById("form");
        // const submitter = document.querySelector("button[value=save]");
        // @ts-ignore
        const formData = new FormData(form, null);
        const gradeReport: FormDataEntryValue | null = formData.get('gradeReport');
        const r = new FileReader()
        // @ts-ignore
        r.readAsText(gradeReport)
        r.onloadend = () => {
            // console.log('formData:' + r.result)
            // @ts-ignore
            setReport(r.result)
            const yearGrades = parseXML(r.result);
            console.log("done parsing data")
            console.log(yearGrades)
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
            <StudentDisplay studentInfo={ss}/>
        </>
    )
}

export default App
