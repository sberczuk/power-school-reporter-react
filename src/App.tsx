import {useState} from 'react'
import {StudentDisplay} from './Student.tsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {findElementIterator, findSingleNode} from "./parser.ts";

const studentNameXPath = "/def:StudentRecordExchangeData/def:StudentDemographicRecord/def:StudentPersonalData/def:Name";
const allTermsXPath = "/def:StudentRecordExchangeData/def:StudentAcademicRecord/def:CourseHistory/def:Term";
const allCoursesXPath = "//def:Course";
const allMarkingPeriodsXPath = "//def:MarkingPeriod";
// build a term from a term node
function buildCourses(doc:Document, termNode: Node|null) {
    console.log("Building Terms")

    const termsIterator = findElementIterator(doc,termNode, allCoursesXPath);
    let r = termsIterator.iterateNext()
    while (r) {
       console.log( r);
        buildMarkingPeriods(doc, r)
        r = termsIterator.iterateNext();
    }
}

function buildMarkingPeriods(doc: Document, courseNode: Node | null ) {
    const codeNode = findSingleNode(doc, courseNode, '//def:CourseCode');
    console.log( codeNode.singleNodeValue)
    const courseCode = codeNode.singleNodeValue.textContent

    // this assumes that that the nodes exist. If the don't it's an issue
    const courseTitle = findSingleNode(doc, courseNode, '//def:CourseTitle').singleNodeValue.textContent;
    console.log(courseTitle + ' ' + courseCode)

    const c = {title: courseTitle, content: courseCode}

    const term = findSingleNode(doc, courseNode, '//def:SIF_ExtendedElement[@Name="StoreCode"]');
    console.log("TERM")
    console.log(term.singleNodeValue)
    const mpIterator = findElementIterator(doc, courseNode, allMarkingPeriodsXPath);
    let r = mpIterator.iterateNext()
    while (r) {
        //buildTerm(result)
        const pct = findSingleNode(doc, r, '//def:MarkData/def:Percentage').singleNodeValue.textContent
       console.log(c)
       console.log(pct)
        c.
        r = mpIterator.iterateNext();
    }
}

function App() {
    const [count, setCount] = useState(0)
    const [report, setReport] = useState('');

    const ss = {
        givenName: 'John',
        middleName: 'Q',
        familyName: 'Public'
    }






    function parseXML(xmlStr: string) {
        // see [xpath tester](https://extendsclass.com/xpath-tester.html)

        // call the cleanup later
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr, "application/xml");

// print the name of the root element or error message
        const errorNode = doc.querySelector("parsererror");
        if (errorNode) {
            console.log("error while parsing");
            console.log(errorNode);
        } else {
            // see https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript
            console.log(doc.documentElement.nodeName);
            //const nsResolver = doc.createNSResolver(doc.documentElement);
            const terms = findElementIterator(doc,doc.documentElement, allTermsXPath);
            console.log(terms)
            let result = terms.iterateNext()
            console.log("iterating")
            const courses = []
            while (result) {
                console.log(result);
                buildCourses(doc,result)
                result = terms.iterateNext();
            }
        }
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
            parseXML(r.result)
            // maybe parse the xml here
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
