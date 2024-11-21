import MarkdownPreview from '@uiw/react-markdown-preview';

import CodeRenderer from "./CodeRenderer";
import Utils from "../../utils";

const MarkdownViewer = ({markdownText}) => {

    let chapterCounters = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

    return (


        <MarkdownPreview
            source={markdownText}
            style={{
                backgroundColor: '#071422',
                color: '#AFC3D3'
            }}
            components={{
                code: CodeRenderer
            }}

            rehypeRewrite={(node, index, parent) => {
                // if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
                //     parent.children = parent.children.slice(1)
                // }
                // if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(node.tagName)) {
                //     const current_node = node.children.find(i => i.type === 'text')
                //     console.log(current_node.value, node.tagName)
                //     node.properties.id = Utils.encodeBase64Modern(node.tagName+current_node.value)
                // }


                if (node.tagName === "a" && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
                    parent.children = parent.children.slice(1);
                }
                if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(node.tagName)) {
                    const currentNode = node.children.find(i => i.type === 'text');
                    if (currentNode) {
                        // Update chapter counters
                        const level = node.tagName;
                        chapterCounters[level]++;

                        // Reset counters for lower levels
                        Object.keys(chapterCounters).forEach(tag => {
                            if (tag > level) {
                                chapterCounters[tag] = 0;
                            }
                        });

                        // Generate chapter numbering (e.g., "1.2.3")
                        const numbering = Object.values(chapterCounters)
                            .slice(0, parseInt(level[1]))
                            .filter(num => num > 0)
                            .join('.');

                        // Prefix the numbering to the text value
                        currentNode.value = `${numbering} ${currentNode.value}`;

                        // Encode the id
                        node.properties.id = Utils.encodeBase64Modern(`${currentNode.value}`);
                    }
                }

            }}

        />


    );
};

export default MarkdownViewer;
