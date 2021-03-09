export default class DomHelper {
    static parseStrtoDom(str){
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    static serializeDOMToStr(dom){
        const serializator = new XMLSerializer();
        return serializator.serializeToString(dom);
    }
    
    static wrapTextNodes(dom){
        const body = dom.body;
            let textNodes = [];

            function recursion(elem){
                elem.childNodes.forEach(node => {
                    if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0){
                        textNodes.push(node);
                    } else {
                        recursion(node);
                    }
                })
            }
            recursion(body);

            textNodes.forEach((node, i) => {
                const wrapper = dom.createElement('text-editor');
                node.parentNode.replaceChild(wrapper, node);
                wrapper.appendChild(node);
                wrapper.setAttribute('node-id', i)
            })

        return dom;
    }

    static unwrapTextNodes(dom){
        dom.body.querySelectorAll('text-editor').forEach(elem => {
            elem.parentNode.replaceChild(elem.firstChild, elem);
        })
    }

    static setAttrToImg(dom){
        dom.body.querySelectorAll('img').forEach((img, i) => {
            img.setAttribute('editableimg', i);
        })
        return dom;
    }

    static removeAttrFromImg(dom){
        dom.body.querySelectorAll('[editableimg]').forEach(img => {
            img.removeAttribute('editableimg');
        })
    }
}