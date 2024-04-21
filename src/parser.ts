// findElementIterator returns an iterator of all child elements of the specified XPath
export function findElementIterator(doc: Document, baseNode:Node, allTermsXPath: string) {
    const nsResolver = function (ns: string) {
        if (ns === 'ns2') {
            return 'http://stumo.transcriptcenter.com'
        } else {
            return 'http://www.sifinfo.org/infrastructure/2.x'
        }
    }
    const retElement = doc.evaluate(
        allTermsXPath,
        baseNode,
        nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
    );
    return retElement;
}