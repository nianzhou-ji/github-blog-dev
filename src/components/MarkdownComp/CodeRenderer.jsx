import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.css";
import mermaid from "mermaid";
import { getCodeString } from "rehype-rewrite";

// 初始化 Mermaid 配置
mermaid.initialize({
    theme: "dark",
    themeVariables: {
        primaryColor: "#1f6feb",
        primaryTextColor: "#ffffff",
        secondaryColor: "#30363d",
        secondaryTextColor: "#c9d1d9",
        tertiaryColor: "#21262d",
        background: "#0d1117",
        fontFamily: "Arial, sans-serif",
        edgeLabelBackground: "#161b22",
        lineColor: "#8b949e",
    },
    flowchart: { curve: "basis" },
    sequence: {
        actorFontColor: "#c9d1d9",
        boxColor: "#30363d",
        labelBoxColor: "#161b22",
        signalColor: "#1f6feb",
    },
    gantt: {
        barColor: "#238636",
        gridColor: "#30363d",
    },
});

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

const CodeRenderer = ({ children = [], className, ...props }) => {
    const demoid = useRef(`dome${randomid()}`);
    const [container, setContainer] = useState(null);

    const isMermaid =
        className && /^language-mermaid/.test(className.toLocaleLowerCase());
    const isKatex =
        className && /^language-katex/.test(className.toLocaleLowerCase());
    const isInlineKatex =
        typeof children === "string" && /^\$\$(.*)\$\$/.test(children.trim());

    const code = props.node && props.node.children
        ? getCodeString(props.node.children)
        : Array.isArray(children)
            ? children[0]
            : children;

    // Mermaid 渲染
    useEffect(() => {
        if (container && isMermaid && demoid.current && code) {
            mermaid
                .render(demoid.current, code)
                .then(({ svg, bindFunctions }) => {
                    container.innerHTML = svg;
                    if (bindFunctions) {
                        bindFunctions(container);
                    }
                })
                .catch((error) => {
                    console.error("Mermaid render error:", error);
                });
        }
    }, [container, isMermaid, code]);

    const refElement = useCallback((node) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    // 处理 $$...$$ 包裹的 Katex 数学公式
    if (isInlineKatex) {
        try {
            const math = children.trim().replace(/^\$\$(.*)\$\$/, "$1");
            const html = katex.renderToString(math, { throwOnError: false });
            return (
                <code
                    style={{ fontSize: "100%",  }}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            );
        } catch (err) {
            console.error("Katex render error:", err);
            return <code>{children}</code>;
        }
    }

    // 处理 className 为 language-katex 的 Katex 数学公式
    if (isKatex) {
        try {
            const html = katex.renderToString(code, { throwOnError: false });
            return (
                <code
                    style={{ fontSize: "150%" }}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            );
        } catch (err) {
            console.error("Katex render error:", err);
            return <code className={className}>{children}</code>;
        }
    }

    // Mermaid 图表渲染
    if (isMermaid) {
        return (
            <Fragment>
                <code id={demoid.current} style={{ display: "none" }} />
                <code className={className} ref={refElement} data-name="mermaid"   style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px 0",
                }}/>
            </Fragment>
        );
    }

    // 默认渲染
    return <code className={className}>{children}</code>;
};

export default CodeRenderer;
