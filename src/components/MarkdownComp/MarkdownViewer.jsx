import MarkdownPreview from '@uiw/react-markdown-preview';
import {remarkExtendedTable, extendedTableHandlers} from 'remark-extended-table';

import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';


import CodeRenderer from "./CodeRenderer";
import Utils from "../../utils";


const MarkdownViewer = ({markdownText}) => {
    let chapterCounters = {h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0};

    let imageCounter = 0;

    return (

        <MarkdownPreview
            remarkPlugins={[
                [remarkGfm, {tablePipeAlign: false}], // 配置 remark-gfm
                [remarkExtendedTable, {tablePipeAlign: false}], // 配置 remark-extended-table
                [remarkRehype, {handlers: extendedTableHandlers}], // 配置 remark-rehype 并传入扩展表格处理器
            ]}
            rehypePlugins={[
                rehypeStringify, // 将 MDAST 转换为 HTML

            ]}

            source={markdownText}
            style={{
                backgroundColor: '#071422',
                color: '#AFC3D3'
            }}
            components={{
                code: CodeRenderer
            }}

            rehypeRewrite={(node, index, parent) => {

                // // 处理图片标签，增加内联CSS，使其居中且宽度占满父级
                // if (node.tagName === "div" && node.properties) {
                //     // if (node.properties.dataCaption ) {
                //     //     imageCounter++
                //     //     node.children[0].value = `图${imageCounter+1} : ${node.children[0].value}`;
                //     // }
                //
                // }


                // 处理图片标签，增加内联CSS，使其居中且宽度占满父级
                if (node.tagName === "img" && node.properties) {
                    node.properties.style = (node.properties.style || '') + " display: block; margin: 0 auto; width: 100%;";
                }

                if (node.tagName === "video" && node.properties) {
                    node.properties.controls = true;
                }


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
