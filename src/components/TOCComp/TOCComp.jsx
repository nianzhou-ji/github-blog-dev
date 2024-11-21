import React, {useState} from 'react';
import Utils from "../../utils";

function parseMarkdownToTOC(markdown) {
    const lines = markdown.split("\n");
    const toc = [];
    const headingRegex = /^(#{1,5})\s+(.*)/;

    lines.forEach((line) => {
        const match = headingRegex.exec(line);
        if (match) {
            const level = match[1].length; // '#' 的个数表示标题等级
            const text = match[2]; // 标题文本
            toc.push({level, text});
        }
    });

    // 生成带编号的目录
    const numberedTOC = [];
    const counters = Array(5).fill(0);

    toc.forEach((item) => {
        const {level, text} = item;
        counters[level - 1]++; // 对应级别加 1
        for (let i = level; i < counters.length; i++) counters[i] = 0; // 重置更低级别的计数器
        const numbering = counters.slice(0, level).join(".");
        numberedTOC.push({numbering, text, level});
    });

    return numberedTOC;
}

const CollapsibleItem = ({item, children}) => {
    const [isOpen, setIsOpen] = useState(false);



    return (
        <li onClick={(e) => {
            e.stopPropagation()


            // 这里假设要滚动到id为element2的元素
            const targetElement = document.getElementById(Utils.encodeBase64Modern(`${item.numbering} ${item.text}`));

            if (targetElement) {
                // 使用scrollIntoView方法将目标元素滚动到可视区域
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.log('未找到指定id的元素');
            }

        }}>
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                style={{cursor: children ? "pointer" : "default"}}
                className="flex items-center tooltip tooltip-left"

                data-tip={`${item.numbering} ${item.text}`}
            >
                <span
                    className="truncate max-w-[150px] inline-block"

                >
                    {item.numbering} {item.text}
                </span>
                {children && (
                    <span className="ml-2 text-blue-500">
                        {isOpen ? "[-]" : "[+]"}
                    </span>
                )}
            </div>
            {isOpen && children}
        </li>
    );
};

const TocComp = ({markdown}) => {
    const toc = parseMarkdownToTOC(markdown);

    // 渲染嵌套目录
    const renderTOC = (items, parentLevel = 0) => {
        const nestedItems = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // 当前项是当前层级的子项
            if (item.level === parentLevel + 1) {
                const children = [];
                // 查找该项的子项
                for (let j = i + 1; j < items.length; j++) {
                    if (items[j].level > item.level) {
                        children.push(items[j]);
                    } else if (items[j].level <= item.level) {
                        break;
                    }
                }

                nestedItems.push(
                    <CollapsibleItem key={item.numbering} item={item}>
                        {children.length > 0 && renderTOC(children, item.level)}
                    </CollapsibleItem>
                );
            }
        }


        return <ul className={"menu p-2 bg-base-200 text-base-content"}>
            {/* 在最外层添加额外的 <li> */}
            {parentLevel === 0 && (
                <li key="extra-item" className="text-gray-500">
                    文档目录
                </li>
            )}
            {nestedItems}
        </ul>
    };

    return <div className={''}>{renderTOC(toc)}</div>;
};


export default TocComp;