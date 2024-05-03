import {expect, test} from 'vitest'
import {mimeToXml} from "./parser.ts";

const inputMime = 'MIME-Version: 1.0\n' +
    'Content-Type: multipart/mixed; boundary=education_mydata\n' +
    '\n' +
    '--education_mydata\n' +
    'Content-type: application/vnd.sif.studentrecordexchange+xml\n' +
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<StudentRecordExchangeData xmlns="http://www.sifinfo.org/infrastructure/2.x" xmlns:ns2="http://stumo.transcriptcenter.com">\n' +
    '    <StudentDemographicRecord>' +
    '</StudentDemographicRecord>' +
    '</StudentRec'

test('replaces incomplete closing tag', () => {
    const s = mimeToXml(inputMime);
    console.log(s)
    expect(s.endsWith('</StudentRecordExchangeData>')).toBe(true)
    expect(true)
})
