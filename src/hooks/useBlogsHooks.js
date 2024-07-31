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
            return
        }

        const markdownText = await response.text();

// 正则表达式来匹配Markdown中的图片URL或本地路径
        const imgRegex = /(!\[.*?\]\()(([^)]*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)))(\))/g;

        let match;

        const urls = [{url: markdownUrl, parentDir: null},]

// 使用循环来依次匹配并替换URL
        while ((match = imgRegex.exec(markdownText)) !== null) {
            const url = match[2]; // URL或本地路径

            const parentPath = markdownUrl.substring(0, markdownUrl.lastIndexOf('/'));

            if (!url.includes('base64')) {
                urls.push({
                    url: parentPath + '/' + url, parentDir: url.substring(0, url.lastIndexOf('/'))
                })
            }


        }

        return urls
    }


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

        const convertImageUrlToBlobUrl = async (imageUrl) => {
            if (location.pathname === '/') return
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            return blobUrl;
        }


// 正则表达式来匹配Markdown中的图片URL或本地路径
        const imgRegex = /(!\[.*?\]\()(([^)]*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)))(\))/g;

        let match;
        let updatedMarkdownText = markdownText;

// 使用循环来依次匹配并替换URL
        while ((match = imgRegex.exec(markdownText)) !== null) {
            if (location.pathname === '/') return

            if (commonStore.articleObj === null) return

            if (id !== commonStore.articleObj.id) return

            const fullMatch = match[0]; // 完整的匹配字符串
            const url = match[2]; // URL或本地路径
            if (!url.includes('base64')) {
                const imageUrl = prefix + '/' + url
                const blodUrl = await convertImageUrlToBlobUrl(imageUrl)

                const newUrl = blodUrl; // 生成新的URL

                // 替换旧的URL为新的URL
                updatedMarkdownText = updatedMarkdownText.replace(fullMatch, `${match[1]}${newUrl}${match[4]}`);
                commonStore.setArticleContent(updatedMarkdownText);
            }


        }


    }


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
