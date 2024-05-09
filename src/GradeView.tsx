import {Grade} from "./types.ts";

export function GradeView({g}: { g: Grade }) {
    if (g) {
        let quarter = g.quarter.toLowerCase();

        // handle terms (T1) as well aq Querters(Q1)
        // TODO: Find a better way to do this based on the universa of 'quarter' values
        if (quarter.startsWith('t')){
           quarter  = quarter.replace('t', 'q');
        }
        return (
            <>
                {/*<div className={'grade-container'}>*/}
                <div className={quarter + ' period'}>{g.quarter}</div>
                {/*<div>{g.year}</div>*/}
                {/*<div>{g.title}</div>*/}
                <div className={'grade-' + quarter + ' grades'}>{g.letterGrade} {g.numberGrade}</div>
                <div className={'absent-' + quarter + ' grades'}>{'absent: ' + g.daysAbsent}</div>
                {/*</div>*/}

            </>
        )
    }
}