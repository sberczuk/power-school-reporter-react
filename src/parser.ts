

// fixXML will remove the mime prefix material and check for a closing tag
// do this after we get the basic plumbing working
export function fixXML(xmlData:string):string{
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
export function findElementIterator(doc: Document, baseNode:Node|null, allTermsXPath: string) {

    const retElement = doc.evaluate(
        allTermsXPath,
        baseNode,
        nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
    );
    return retElement;
}

// findSingleNode finds the first child node matching the // xpath expression
// (Ideally I'd use the actual path, but this seems to be more reliable
export function findSingleNode(doc: Document, baseNode:Node, allTermsXPath: string) {

    const retElement = doc.evaluate(
        allTermsXPath,
        baseNode,
        nsResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
    );
    return retElement;
}