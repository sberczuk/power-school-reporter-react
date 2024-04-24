import {Grade} from "./types.ts"

// fixXML will remove the mime prefix material and check for a closing tag
// do this after we get the basic plumbing working
export function fixXML(xmlData: string): string {
    return xmlData
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
const allMarkingPeriodsXPath = ".//def:MarkingPeriod";
const instructorFirstNameXPath = ".//def:SIF_ExtendedElement[@Name='InstructorFirstName']"
const instructorLastNameXPath = ".//def:SIF_ExtendedElement[@Name='InstructorLastName']"
const schoolNameXPath = ".//def:SIF_ExtendedElement[@Name='SchoolName']"
let quarterXPath = './/def:SIF_ExtendedElement[@Name="StoreCode"]';
const gradeLevelXPath = ".//def:GradeLevelWhenTaken/ns1:Code"

export function buildCourseGrades(doc: Document, termNode: Node | null) {

    // console.log("Building Terms")
    let yearXPath = ".//def:TermInfoData/def:SchoolYear";
    const year = findSingleNode(doc, termNode, yearXPath).singleNodeValue.textContent;

    const coursesIterator = findElementIterator(doc, termNode, allCoursesXPath);
    const allGrades = []

    try {
        let r = coursesIterator.iterateNext()
        while (r) {
            console.log("iterating in buildCourseGrade")
            console.log(r);
            const termGrades = buildQuarterlyGrades(doc, r, year);
            allGrades.push(...termGrades)
            console.log("all grades len " + allGrades.length)
            r = coursesIterator.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
    return {year: year, grades: allGrades}

}

function buildQuarterlyGrades(doc: Document, courseNode: Node, year: string) {
    const codeNode = findSingleNode(doc, courseNode, '//def:CourseCode');
    // console.log(codeNode.singleNodeValue)

    const courseCode = codeNode.singleNodeValue.textContent
    // this assumes that that the nodes exist. If the don't it's an issue
    const courseTitle = findSingleNode(doc, courseNode, '//def:CourseTitle').singleNodeValue.textContent;

    // console.log(courseTitle + ' ' + courseCode)

    const c = {title: courseTitle, content: courseCode}
    const term = findSingleNode(doc, courseNode, quarterXPath);
    // console.log("TERM")
    // console.log(term.singleNodeValue)
    const instructorFn = findSingleNode(doc, courseNode, instructorFirstNameXPath).singleNodeValue.textContent;
    const instructorLn = findSingleNode(doc, courseNode, instructorLastNameXPath).singleNodeValue.textContent;

// there should only be one MP below a course
    const mpIterator = findElementIterator(doc, courseNode, allMarkingPeriodsXPath);
    const allGrades = []
    try {
        let r = mpIterator.iterateNext()
        while (r) {
            console.log('iterating buildQuarterlyGrades')
            console.log(r)
            console.log(codeNode)
            const pct = findSingleNode(doc, r, '//def:MarkData/def:Percentage').singleNodeValue.textContent
            const letterGrade = findSingleNode(doc, r, '//def:MarkData/def:Letter').singleNodeValue.textContent
            const comments = findSingleNode(doc, r, '//def:MarkData/def:Narrative').singleNodeValue.textContent
            const absent = findSingleNode(doc, r, '//def:DaysAbsent').singleNodeValue.textContent
            // console.log(c)
            const g: Grade = {
                code: courseCode, title: courseTitle,
                instructor: instructorFn + " " + instructorLn,
                year: year,
                quarter: term.singleNodeValue.textContent,
                letterGrade: letterGrade,
                numberGrade: pct,
                daysAbsent: absent,
                comments: comments
            }
            console.log(g)
            allGrades.push(g)
            r = mpIterator.iterateNext();
        }
    } catch (e) {
        console.error(`Error: Document tree modified during iteration ${e}`);
    }
    return allGrades
}