import {Student} from "./types.ts";

interface StudentDisplayProps {
    studentInfo:Student
}

export function StudentDisplay(s:StudentDisplayProps){
    return(
        <>
        <div>
            {s.studentInfo.givenName}  {s.studentInfo.middleName} {s.studentInfo.familyName}
        </div>
    </>
    )
}




