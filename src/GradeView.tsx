import {Grade} from "./types.ts";

export function GradeView({g}: { g: Grade }) {
    if (g) {
        const quarter = g.quarter.toLowerCase();
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