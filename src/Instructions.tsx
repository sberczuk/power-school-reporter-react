export function Instructions() {
    return (<div className={'noPrint'}>
            <h2>How to Use</h2>
            <p>This app is a way to generate a single page report card view from a PowerSchool Export file.
                The online app is handy, but I still wanted to be able to save a page or a PDF with all the grades for
                a year with comments in one place.</p>

            <p> All the processing is done in the browser.</p>
            <ul>
                <li>Navigate to the Powerschool Portal and log in</li>
                <li>Look for the export data icon on the top right of the screen and click it</li>
                <li>Click the <b>Choose File</b> button and browse for the file you just downloaded</li>
                <li>Select a year report on</li>
                <li>View or Print. Print just display the grade table.</li>
            </ul>
            
        </div>
    );
}