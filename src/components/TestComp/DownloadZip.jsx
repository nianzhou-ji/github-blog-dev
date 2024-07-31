import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DownloadZip = () => {
    const [loading, setLoading] = useState(false);
    const urls = [
        { url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.CDqvHnuOLyMYvWjpDewJzAHaLV?w=204&h=308&c=7&r=0&o=5&pid=1.7', parentDir: 'images1' },
        { url: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.RX58ALNlBVf3JjE5XggeaQHaEo?w=204&h=127&c=7&r=0&o=5&pid=1.7', parentDir: 'images' },
        { url: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.v34IOW2aIrlLkklbZZk3EQHaEK?w=204&h=115&c=7&r=0&o=5&pid=1.7', parentDir: null },
    ];

    const downloadFile = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}`);
        }
        const contentType = response.headers.get('Content-Type');
        const data = await response.arrayBuffer();
        return { data, contentType };
    };

    const getExtensionFromContentType = (contentType) => {
        const mimeTypes = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'text/plain': '.txt',
            'application/pdf': '.pdf',
            // 添加更多你需要的 MIME 类型
        };
        return mimeTypes[contentType] || '';
    };

    const createZip = async () => {
        setLoading(true);
        const zip = new JSZip();

        for (const { url, parentDir } of urls) {
            try {
                const { data, contentType } = await downloadFile(url);
                const fileName = url.split('/').pop().split('.').shift(); // 获取原始文件名，不包含扩展名
                const extension = getExtensionFromContentType(contentType);
                const fileNameWithSuffix = `${fileName}_backup${extension}`;
                const filePath = parentDir ? `${parentDir}/${fileNameWithSuffix}` : fileNameWithSuffix;
                zip.file(filePath, data);
            } catch (error) {
                console.error(`Error downloading ${url}:`, error);
            }
        }

        try {
            const zipContent = await zip.generateAsync({ type: 'blob' });
            saveAs(zipContent, 'output.zip');
        } catch (error) {
            console.error('Error creating ZIP file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={createZip} disabled={loading}>
                {loading ? 'Creating ZIP...' : 'Download ZIP'}
            </button>
        </div>
    );
};

export default DownloadZip;
