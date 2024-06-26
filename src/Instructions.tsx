import psLogo from './assets/power-school-dl.png'

export function Instructions() {
    return (<div className={'noPrint'}>
            <h2>How to Use</h2>
            <p>This app is a way to generate a single page report card view from a PowerSchool Export file.
                The online app is handy, but I still wanted to be able to save a page or a PDF with all the grades for
                a year with comments in one place.</p>

            <p> All the processing is done in the browser.</p>
            <ul>
                <li>Navigate to the Powerschool Web Portal and log in. (the mobile app does not seem to support export)</li>
                <li>Look for the My Data icon on the top right of the screen and click it. Save the data. See Below for details</li>
                <li>Click the <b>Choose File</b> button and browse for the file you just downloaded.</li>
                <li>Select a year report on</li>
                <li>View or Print. Print will just display the grade table without the web app content.</li>
            </ul>
            <p> myData Icon <img src={psLogo}/></p>
            <p>&copy; 2024 Steve Berczuk</p>

    </div>
);
}