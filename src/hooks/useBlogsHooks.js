import {useStore} from "../stores";
import {useLocation, useNavigate} from "react-router-dom";
import JSZip from "jszip";
import {saveAs} from 'file-saver';

export const useBlogsHooks = () => {
    const {commonStore} = useStore()
    const navigate = useNavigate()
    const location = useLocation();


    const getDownloadUrls = async (markdownUrl) => {
        const response = await fetch(markdownUrl);
        if (!response.ok) {
            console.error('Network response was not ok.');
            return;
        }

        const markdownText = await response.text();

        // 正则表达式来匹配Markdown中的图片URL或本地路径
        const imgRegex = /(!\[.*?\]\()(([^)]*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)))(\))/g;
        // 正则表达式来匹配Markdown中的视频URL（<video>标签）
        const videoRegex = /<video[^>]*>\s*<source[^>]*src="([^"]+)"[^>]*>/g;

        let match;
        const urls = [{url: markdownUrl, parentDir: null}];

        // 匹配图片URL
        while ((match = imgRegex.exec(markdownText)) !== null) {
            const url = match[2]; // 图片URL或本地路径

            const parentPath = markdownUrl.substring(0, markdownUrl.lastIndexOf('/'));

            if (!url.includes('base64')) {
                urls.push({
                    url: parentPath + '/' + url,
                    parentDir: url.substring(0, url.lastIndexOf('/'))
                });
            }
        }

        // 匹配视频URL
        while ((match = videoRegex.exec(markdownText)) !== null) {
            const videoUrl = match[1]; // 视频URL

            const parentPath = markdownUrl.substring(0, markdownUrl.lastIndexOf('/'));

            if (!videoUrl.includes('base64')) {
                urls.push({
                    url: parentPath + '/' + videoUrl,
                    parentDir: videoUrl.substring(0, videoUrl.lastIndexOf('/'))
                });
            }
        }



        return urls;
    };


    const downloadMarkdownFile = async (markdownUrl, zipFileName = 'output.zip') => {

        // const urls = [
        //     { url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.CDqvHnuOLyMYvWjpDewJzAHaLV?w=204&h=308&c=7&r=0&o=5&pid=1.7', parentDir: 'images1' },
        //     { url: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.RX58ALNlBVf3JjE5XggeaQHaEo?w=204&h=127&c=7&r=0&o=5&pid=1.7', parentDir: 'images' },
        //     { url: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.v34IOW2aIrlLkklbZZk3EQHaEK?w=204&h=115&c=7&r=0&o=5&pid=1.7', parentDir: null },
        // ];


        const urls = await getDownloadUrls(markdownUrl)


        console.log(urls)


        const downloadFile = async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}`);
            }
            const contentType = response.headers.get('Content-Type');


            console.log(contentType, 'contentType')
            const data = await response.arrayBuffer();
            return {data, contentType};
        };

        const getExtensionFromContentType = (contentType) => {
            const mimeTypes = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'text/plain': '.txt',
                'application/pdf': '.pdf',
                'text/markdown': '.md',
                // 'video/mp4': '.mp4',  // 添加 MP4 文件类型

                'video/webm': '.webm',  // 添加 WebM 文件类型
                // 添加更多你需要的 MIME 类型
            };

            for (const mimeType of Object.keys(mimeTypes)) {
                if (contentType.includes(mimeType)) return mimeTypes[mimeType]
            }

            return ''
        };

        const createZip = async () => {

            const zip = new JSZip();

            for (const {url, parentDir} of urls) {
                try {
                    const {data, contentType} = await downloadFile(url);
                    const fileName = url.split('/').pop().split('.').shift(); // 获取原始文件名，不包含扩展名
                    const extension = getExtensionFromContentType(contentType);
                    const fileNameWithSuffix = `${fileName}${extension}`;
                    const filePath = parentDir ? `${parentDir}/${fileNameWithSuffix}` : fileNameWithSuffix;
                    zip.file(filePath, data);
                } catch (error) {
                    console.error(`Error downloading ${url}:`, error);
                }
            }

            try {
                const zipContent = await zip.generateAsync({type: 'blob'});
                saveAs(zipContent, 'output.zip');
            } catch (error) {
                console.error('Error creating ZIP file:', error);
            } finally {

            }


        }


        await createZip()
    }


    const replaceMarkdownUrl = async (markdownText, prefix, id) => {
        const convertMediaUrlToBlobUrl = async (mediaUrl) => {
            if (location.pathname === '/') return;
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            return blobUrl;
        };

        const replaceImageUrl = async (markdownText, prefix) => {
            const imgRegex = /(!\[.*?\]\()(([^)]*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)))(\))/g;

            let match;
            let updatedMarkdownText = markdownText;

            // 使用循环来依次匹配并替换图片URL
            while ((match = imgRegex.exec(markdownText)) !== null) {
                if (location.pathname === '/') return;
                if (commonStore.articleObj === null) return;
                if (id !== commonStore.articleObj.id) return;

                const fullMatch = match[0]; // 完整的匹配字符串
                const url = match[2]; // 图片URL或本地路径

                if (!url.includes('base64')) {
                    const imageUrl = prefix + '/' + url;
                    const blobUrl = await convertMediaUrlToBlobUrl(imageUrl);
                    const newUrl = blobUrl; // 生成新的URL

                    // 替换旧的URL为新的URL
                    updatedMarkdownText = updatedMarkdownText.replace(fullMatch, `${match[1]}${newUrl}${match[4]}`);
                    commonStore.setArticleContent(updatedMarkdownText);
                }
            }

            return updatedMarkdownText;
        };

        const replaceVideoUrl = async (markdownText, prefix) => {
            const videoRegex = /<video[^>]*>\s*<source[^>]*src="([^"]+)"[^>]*>/g;

            let match;
            let updatedMarkdownText = markdownText;

            // 使用循环来依次匹配并替换视频URL
            while ((match = videoRegex.exec(markdownText)) !== null) {
                if (location.pathname === '/') return;
                if (commonStore.articleObj === null) return;
                if (id !== commonStore.articleObj.id) return;

                const fullMatch = match[0]; // 完整的匹配字符串
                const videoUrl = match[1]; // 视频URL

                if (!videoUrl.includes('base64')) {
                    const fullVideoUrl = prefix + '/' + videoUrl;
                    console.log(videoUrl, 'videoUrl');
                    const blobUrl = await convertMediaUrlToBlobUrl(fullVideoUrl);
                    const newUrl = blobUrl; // 生成新的URL

                    // 替换旧的URL为新的URL
                    updatedMarkdownText = updatedMarkdownText.replace(fullMatch, `<video><source src="${newUrl}">`);
                    commonStore.setArticleContent(updatedMarkdownText);
                }
            }

            return updatedMarkdownText;
        };


        // 解析并获取章节信息
        const getChapterHeaders = (markdownText) => {
            const headerRegex = /^(#) (.*?)$/gm;  // 匹配一级标题 # 后面跟着的章节标题
            const chapterHeaders = [];
            let match;

            // 遍历所有一级标题并记录章节号及行号
            while ((match = headerRegex.exec(markdownText)) !== null) {
                chapterHeaders.push({
                    chapterNumber: chapterHeaders.length + 1, // 章节号
                    headerText: match[2], // 章节标题
                    lineIndex: match.index // 标题所在的行索引位置
                });
            }

            return chapterHeaders;
        };

        // 根据 data-caption 的值识别类型并进行处理
        const getTypeFromCaption = (captionText) => {
            if (captionText.toLowerCase().includes('figure')) {
                return '图';
            } else if (captionText.toLowerCase().includes('video')) {
                return '视频';
            } else if (captionText.toLowerCase().includes('table')) {
                return '表';
            }
            return '未知';
        };


        const replaceDivText = (markdownText, chapterHeaders) => {
            const divRegex = /<div[^>]*data-caption=["']([^"']+)["'][^>]*>(.*?)<\/div>/g;
            let match;
            let updatedMarkdownText = markdownText;
            let divCount = 0; // 记录带 data-caption 属性的 div 出现的次数
            let currentChapterIndex = -1; // 当前所在章节的索引

            // 遍历所有 div 标签并处理
            while ((match = divRegex.exec(markdownText)) !== null) {
                if (location.pathname === '/') return;
                if (commonStore.articleObj === null) return;
                if (id !== commonStore.articleObj.id) return;

                const fullMatch = match[0]; // 完整的匹配字符串
                const captionValue = match[1]; // 获取 data-caption 属性的值
                const originalText = match[2]; // div 中的原始文本（例如 image-20241218102810074）

                // 获取当前 <div> 标签的位置
                const divIndex = match.index;

                // 查找该 div 上面的最近一级标题
                let chapterIndex = -1;

                // 查找该 div 所在章节的行号
                for (let i = 0; i < chapterHeaders.length; i++) {
                    const chapterHeader = chapterHeaders[i];

                    // 如果 <div> 位于该章节标题之下，则该 div 属于该章节
                    if (divIndex >= chapterHeader.lineIndex) {
                        chapterIndex = i;
                    } else {
                        break;
                    }
                }

                // 如果找到了章节号
                const chapterNumber = chapterIndex !== -1 ? chapterHeaders[chapterIndex].chapterNumber : '未知';

                // 如果当前章节发生变化，则重置 divCount 为 1
                if (chapterIndex !== currentChapterIndex) {
                    divCount = 1; // 重新开始编号
                    currentChapterIndex = chapterIndex; // 更新当前章节
                } else {
                    divCount += 1; // 在同一章节内，增加编号
                }

                // 根据 data-caption 的值判断是图、视频还是表
                const type = getTypeFromCaption(captionValue);

                // 拼接新的文本：类型 + 章节号 + 索引编号 + 原始文本
                const newText = `${type} ${chapterNumber}-${divCount}: ${originalText}`;

                // 替换 div 标签内的文本内容，保留原有的 data-caption 和其他属性
                updatedMarkdownText = updatedMarkdownText.replace(fullMatch, (match) => {
                    return match.replace(originalText, newText);
                });

                // 更新文章内容
                commonStore.setArticleContent(updatedMarkdownText);
            }

            return updatedMarkdownText;
        };




        // 先替换图片URL
        let updatedMarkdownText = await replaceImageUrl(markdownText, prefix);

        // 再替换视频URL
        updatedMarkdownText = await replaceVideoUrl(updatedMarkdownText, prefix);


        // 获取所有章节标题及其行号
        const chapterHeaders = getChapterHeaders(updatedMarkdownText);

        // 最后替换 div 中的文本
        updatedMarkdownText = replaceDivText(updatedMarkdownText, chapterHeaders);

        return updatedMarkdownText;
    };


    const initApp = async () => {

        try {

            // 获取 blogAssetsConfig.json
            let response = await fetch('/blogs/blogAssetsConfig.json');
            if (!response.ok) {
                console.error('Network response was not ok.');
                return
            }
            let text = await response.text();
            const assets = JSON.parse(text).assets;
            commonStore.setArticles(assets);

            const waitedTags = {};
            assets.forEach(item => {
                item.tags.forEach(innerItem => {
                    waitedTags[innerItem] = '';
                });
            });

            commonStore.setTags(Object.keys(waitedTags));

            // 获取 profileConfig.json
            response = await fetch('/blogs/profileConfig.json');
            if (!response.ok) {
                console.error('Network response was not ok.');
                return
            }
            text = await response.text();
            const profileConfig = JSON.parse(text);

            commonStore.updateProfileConfig(profileConfig);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

    }

    const fetchBlog = async (item) => {

        commonStore.setArticleObj(item)
        commonStore.setIsLoaded(false)

        try {
            const currentPath = `/blogs/${item.url}`
            const response = await fetch(currentPath);
            if (!response.ok) {
                console.error('Network response was not ok.');
                return
            }

            const text = await response.text();

            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

            replaceMarkdownUrl(text, parentPath, item.id)

            commonStore.setArticleContent(text);
            commonStore.setIsLoaded(true);
            navigate(`/blogs/${item.id}`);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            commonStore.setIsLoaded(true);
        }
    }


    return {fetchBlog, initApp, getDownloadUrls, downloadMarkdownFile}


}
