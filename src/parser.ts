import {Grade, Student, StudentReport, YearGrades} from "./types.ts"

// fixXML will remove the mime prefix material and check for a closing tag
// do this after we get the basic plumbing working
export function fixXML(xmlData: string): string {
    return xmlData
}

//TODO: Write a Test
// see: https://www.jetbrains.com/help/webstorm/vitest.html#createRunConfigVitest
// https://vitest.dev/guide/
// TODO: test to handle wellformed
export function mimeToXml(inString:string):string{
    const xmlStart = inString.indexOf('<?xml version="1.0" encoding="UTF-8"?>');
    const lastCLosintagIx = inString.lastIndexOf('</Stu')
    // find an incomplete closing tag
    const xmlWithoutClose = inString.substring(xmlStart, lastCLosintagIx);
    const xml = xmlWithoutClose +'\n</StudentRecordExchangeData>';
    return xml
}

const nsResolver = function (ns: string) {
    if (ns === 'ns2') {
        return 'http://stumo.transcriptcenter.com'
    } else {
        return 'http://www.sifinfo.org/infrastructure/2.x'
    }
}

// findElementIterator returns an iterator of all child elements of the specified XPath
export function findElementIterator(doc: Document, baseNode: Node, xpathsSpec: string) {

    const retElement = doc.evaluate(
        xpathsSpec,
        baseNode,
        nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
    );
    return retElement;
}

// findSingleNode finds the first child node matching the // xpath expression
// (Ideally I'd use the actual path, but this seems to be more reliable
export function findSingleNode(doc: Document, baseNode: Node, allTermsXPath: string) {

    const retElement = doc.evaluate(
        allTermsXPath,
        baseNode,
        nsResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
    );
    return retElement;
} // build a term from a term node
const studentNameXPath = "/def:StudentRecordExchangeData/def:StudentDemographicRecord/def:StudentPersonalData/def:Name";
export const allTermsXPath = "/def:StudentRecordExchangeData/def:StudentAcademicRecord/def:CourseHistory/def:Term";
const allCoursesXPath = ".//def:Course";
const allYearsXPath = "//def:SchoolYear";
const allMarkingPeriodsXPath = ".//def:MarkingPeriod";
const instructorFirstNameXPath = ".//def:SIF_ExtendedElement[@Name='InstructorFirstName']"
const instructorLastNameXPath = ".//def:SIF_ExtendedElement[@Name='InstructorLastName']"
const schoolNameXPath = ".//def:SIF_ExtendedElement[@Name='SchoolName']"
let quarterXPath = './/def:SIF_ExtendedElement[@Name="StoreCode"]';
const gradeLevelXPath = ".//def:GradeLevelWhenTaken/ns1:Code"

export function buildCourseGrades(doc: Document, termNode: Node | null) {

    const yearXPath = ".//def:TermInfoData/def:SchoolYear";
    const year = findSingleNode(doc, termNode, yearXPath).singleNodeValue.textContent;

    const coursesIterator = findElementIterator(doc, termNode, allCoursesXPath);
    const allGrades = []

    try {
        let r = coursesIterator.iterateNext()
        while (r) {
            const termGrades = buildQuarterlyGrades(doc, r, year);
            allGrades.push(...termGrades)
            r = coursesIterator.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
    return allGrades

}

function buildQuarterlyGrades(doc: Document, courseNode: Node, year: string) {
    const codeNode = findSingleNode(doc, courseNode, './/def:CourseCode');
    // console.log(codeNode.singleNodeValue)

    const courseCode = codeNode?.singleNodeValue?.textContent
    // this assumes that that the nodes exist. If the don't it's an issue
    const courseTitle = findSingleNode(doc, courseNode, './/def:CourseTitle')?.singleNodeValue?.textContent;

    // console.log(courseTitle + ' ' + courseCode)

    const c = {title: courseTitle, content: courseCode}
    const term = findSingleNode(doc, courseNode, quarterXPath);
    const gradeLevel = findSingleNode(doc, courseNode, gradeLevelXPath).singleNodeValue.textContent;

    const instructorFn = findSingleNode(doc, courseNode, instructorFirstNameXPath).singleNodeValue.textContent;
    const instructorLn = findSingleNode(doc, courseNode, instructorLastNameXPath).singleNodeValue.textContent;

// there should only be one MP below a course
    const mpIterator = findElementIterator(doc, courseNode, allMarkingPeriodsXPath);
    const allGrades = []
    try {
        let r = mpIterator.iterateNext()
        while (r) {

            const pct = findSingleNode(doc, r, './/def:MarkData/def:Percentage')?.singleNodeValue?.textContent
            const letterGrade = findSingleNode(doc, r, './/def:MarkData/def:Letter')?.singleNodeValue?.textContent
            const comments = findSingleNode(doc, r, './/def:MarkData/def:Narrative')?.singleNodeValue?.textContent
            const absent = findSingleNode(doc, r, './/def:DaysAbsent')?.singleNodeValue?.textContent
            const g: Grade = {
                code: courseCode,
                title: courseTitle,
                instructor: instructorFn + " " + instructorLn,
                year: year,
                grade: gradeLevel,
                quarter: term.singleNodeValue.textContent,
                letterGrade: letterGrade,
                numberGrade: pct,
                daysAbsent: absent,
                comments: comments
            }
            allGrades.push(g)
            r = mpIterator.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
    return allGrades
}

function buildStudent(doc: Document, documentElement: HTMLElement):Student {
    const studentNode = findSingleNode(doc, documentElement, "//def:StudentDemographicRecord/def:StudentPersonalData").singleNodeValue;
    if (studentNode) {
        const firstName = findSingleNode(doc, studentNode, ".//def:FirstName")?.singleNodeValue?.textContent
        const familyName = findSingleNode(doc, studentNode, ".//def:LastName")?.singleNodeValue?.textContent
        const middleName = findSingleNode(doc, studentNode, ".//def:MiddleName")?.singleNodeValue?.textContent

        return {
            givenName: firstName,
            familyName: familyName,
            middleName: middleName
        }
    }
    return {givenName: '', middleName: '', familyName: ''}
}



export function parseXML(xmlStr: string): StudentReport {
    // see [xpath tester](https://extendsclass.com/xpath-tester.html)

    // call the cleanup later
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, "application/xml");
    const allYearData: Grade[] = []
    let years : string[] = []

    let student = {givenName: '', middleName: '', familyName: ''}
// print the name of the root element or error message
    const errorNode = doc.querySelector("parsererror");

    if (errorNode) {
        console.log("error while parsing");
        console.log(errorNode);
    } else {
        // see https://developer.mozilla.org/en-US/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript
        student = buildStudent(doc, doc.documentElement);
        const terms = findElementIterator(doc, doc.documentElement, allTermsXPath);
        let r = terms.iterateNext()
        while (r) {

            const g = buildCourseGrades(doc, r);
            allYearData.push(...g);
            r = terms.iterateNext();
        }

        //we could do this, or query the XML
         years =Array.from(new Set(allYearData.map((g)=> g.year)))
        console.log("YEARS")
        console.log(years)
    }
    return {student: student, grades: allYearData, years:years}
}