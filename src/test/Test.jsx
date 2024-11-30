import { Previewer } from 'pagedjs';
import {useEffect} from "react";

const PagedComponent = () => {
    useEffect(() => {
        const previewer = new Previewer();

        // 假设这里是分页预览之前的配置，修正错误的选择器
        const faultySelector = '.modal[open]))';  // 错误选择器

        // 修正选择器
        const correctSelector = '.modal[open]';  // 正确选择器

        console.log(correctSelector);  // 打印正确选择器，帮助调试
        previewer.preview();

        previewer.on('resolved', () => {
            console.log('Paged.js pagination is complete');
        });
    }, []);

    return (
        <div>
            <div className="content">
                <h1>My Long Document</h1>
                <p>这里是一些长文档的内容... (你可以添加更多的段落)</p>
                {/* 更多内容 */}
            </div>
        </div>
    );
};

export default PagedComponent;
