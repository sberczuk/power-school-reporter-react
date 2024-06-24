import {Grade, Student, StudentReport} from "./types.ts"


export function mimeToXml(inString: string): string {
    const xmlStart = inString.indexOf('<?xml version="1.0" encoding="UTF-8"?>');
    const lastCLosintagIx = inString.lastIndexOf('</Stu')
    // find an incomplete closing tag
    const xmlWithoutClose = inString.substring(xmlStart, lastCLosintagIx);
    return xmlWithoutClose + '\n</StudentRecordExchangeData>';
}


const nsResolver = {
    lookupNamespaceURI: function (ns: string) {
        if (ns === 'ns2') {
            return 'http://stumo.transcriptcenter.com'
        } else {
            return 'http://www.sifinfo.org/infrastructure/2.x'
        }
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

    return doc.evaluate(
        allTermsXPath,
        baseNode,
        nsResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
    );
} // build a term from a term node
export const allTermsXPath = "/def:StudentRecordExchangeData/def:StudentAcademicRecord/def:CourseHistory/def:Term";

const allCoursesXPath = ".//def:Course";
const allMarkingPeriodsXPath = ".//def:MarkingPeriod";
const instructorFirstNameXPath = ".//def:SIF_ExtendedElement[@Name='InstructorFirstName']"
const instructorLastNameXPath = ".//def:SIF_ExtendedElement[@Name='InstructorLastName']"
const quarterXPath = './/def:SIF_ExtendedElement[@Name="StoreCode"]';
const schoolXPath = './/def:SIF_ExtendedElement[@Name="SchoolName"]';
const gradeLevelXPath = ".//def:GradeLevelWhenTaken/ns1:Code"

export function buildCourseGrades(doc: Document, termNode: Node | null) {
    if (termNode == null) {
        return []
    }

    const yearXPath = ".//def:TermInfoData/def:SchoolYear";
    const year = findSingleNode(doc, termNode, yearXPath)?.singleNodeValue?.textContent;
    const school = findSingleNode(doc, termNode,schoolXPath)?.singleNodeValue?.textContent;
    const coursesIterator = findElementIterator(doc, termNode, allCoursesXPath);
    const allGrades = []

    try {
        let r = coursesIterator.iterateNext()
        while (r) {
            // @ts-ignore
            const termGrades = buildQuarterlyGrades(doc, r, year, school!);
            allGrades.push(...termGrades)
            r = coursesIterator.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
    return allGrades

}

function buildQuarterlyGrades(doc: Document, courseNode: Node, year:string, school: string) {
    const codeNode = findSingleNode(doc, courseNode, './/def:CourseCode');
    // console.log(codeNode.singleNodeValue)

    const courseCode = codeNode?.singleNodeValue?.textContent
    // this assumes that the nodes exist. If the don't it's an issue
    const courseTitle = findSingleNode(doc, courseNode, './/def:CourseTitle')?.singleNodeValue?.textContent;

    // console.log(courseTitle + ' ' + courseCode)

    const term = findSingleNode(doc, courseNode, quarterXPath);
    const gradeLevel = findSingleNode(doc, courseNode, gradeLevelXPath)?.singleNodeValue?.textContent;

    const instructorFn = findSingleNode(doc, courseNode, instructorFirstNameXPath)?.singleNodeValue?.textContent;
    const instructorLn = findSingleNode(doc, courseNode, instructorLastNameXPath)?.singleNodeValue?.textContent;

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

            //TODO: Figure out how best to  avoid the non  null check
            // @ts-ignore
            let quarter = term?.singleNodeValue?.textContent;
            if (quarter == null || quarter == undefined) {
                quarter = ""
            }
            const g: Grade = {
                code: courseCode!,
                title: courseTitle!,
                instructor: instructorFn + " " + instructorLn,
                school: school,
                year: year,
                grade: gradeLevel!,
                quarter: quarter,
                letterGrade: letterGrade!,
                numberGrade: pct!,
                daysAbsent: absent!,
                comments: comments!
            }
            allGrades.push(g)
            r = mpIterator.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
    return allGrades
}

function buildStudent(doc: Document, documentElement: HTMLElement): Student {
    const studentNode = findSingleNode(doc, documentElement, "//def:StudentDemographicRecord/def:StudentPersonalData").singleNodeValue;
    if (studentNode) {
        const firstName = findSingleNode(doc, studentNode, ".//def:FirstName")?.singleNodeValue?.textContent
        const familyName = findSingleNode(doc, studentNode, ".//def:LastName")?.singleNodeValue?.textContent
        const middleName = findSingleNode(doc, studentNode, ".//def:MiddleName")?.singleNodeValue?.textContent

        return {
            givenName: firstName!,
            familyName: familyName!,
            middleName: middleName!
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
    let years: string[] = []

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
        years = Array.from(new Set(allYearData.map((g) => g.year)))
        console.log("YEARS")
        console.log(years)
    }
    return {student: student, grades: allYearData, years: years}
}