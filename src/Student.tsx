interface Student {
    givenName: string
    middleName: string
    familyName: string
}

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