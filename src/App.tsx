import {useState} from 'react'
import {StudentDisplay} from './Student.tsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


// findElementIterator returns an iterator of all child elements of the specified XPath
function findElementIterator(doc: Document, allTermsXPath: string) {
    const nsResolver = function (ns: string) {
        if (ns === 'ns2') {
            return 'http://stumo.transcriptcenter.com'
        } else {
            return 'http://www.sifinfo.org/infrastructure/2.x'
        }
    }
    const retElement = doc.evaluate(
        allTermsXPath,
        doc.documentElement,
        nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
    );
    return retElement;
}

function App() {
    const [count, setCount] = useState(0)
    const [report, setReport] = useState('');

    const ss = {
        givenName: 'John',
        middleName: 'Q',
        familyName: 'Public'
    }



    const studentNameXPath = "/def:StudentRecordExchangeData/def:StudentDemographicRecord/def:StudentPersonalData/def:Name";
    const allTermsXPath = "/def:StudentRecordExchangeData/def:StudentAcademicRecord/def:CourseHistory/def:Term";


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
            const student = findElementIterator(doc, allTermsXPath);
            console.log(student)
            let result = student.iterateNext()
            console.log("iterating")
            while (result) {
                console.log(result); // 1 3 5 7 9
                result = student.iterateNext();
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
