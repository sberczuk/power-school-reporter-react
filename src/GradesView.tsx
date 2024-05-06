import {Grade} from "./types.ts";
import {SubjectView} from "./SubjectView.tsx";

export function GradesView({gg, selectedYear}: { gg: Grade[], selectedYear?: string }) {
    console.log("GRADES VIEW " + gg.length)
    if (gg.length == 0 || selectedYear=='') {
        return null
    }
    //TODO: Pass in year to filter on as a prop
    const yearGrades = gg.filter((g) => g.year == selectedYear);
    const gradesByClass = new Map<string, Grade[]>()
    yearGrades.forEach((e) => {
        if (!gradesByClass.get(e.code)) {
            gradesByClass.set(e.code, [])
        }
        gradesByClass.get(e.code)?.push(e)
    })


    const buildGradeRows = () => {
        const rows: React.JSX.Element[] = [];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function displaySubjectGrade(v:Grade[], k:string, _map: Map<string, Grade[]>) {
            rows.push(<SubjectView key={k} grades={v}/>)
        }

        gradesByClass.forEach(displaySubjectGrade)
        console.log("returning rows >>" + rows.length)
        return rows

    }

    return (<>
        {buildGradeRows()}
    </>)
}

