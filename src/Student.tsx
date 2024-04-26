import {Student} from "./types.ts";



export function StudentDisplay({student}:{student: Student}) {
   if (student){

    return(
        <>
            <p>Student Info</p>
        <div>
            {student.givenName}  {student.middleName} {student.familyName}
        </div>
    </>)
   } else{
       return  (
           <> No data</>
       )
   }

}




