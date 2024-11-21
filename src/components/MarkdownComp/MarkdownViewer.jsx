import MDEditor from "@uiw/react-md-editor";

import CodeRenderer from "./CodeRenderer";

const MarkdownViewer = ({markdownText}) => {

    return (


        <MDEditor.Markdown
            source={markdownText}
            style={{
                backgroundColor: '#071422',
                color: '#AFC3D3'
            }}
            components={{
                code: CodeRenderer
            }}

        />


    );
};

export default MarkdownViewer;
