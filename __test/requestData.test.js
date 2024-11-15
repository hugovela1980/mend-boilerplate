const path = require('path');
const { getFileRequestData } = require('../app/backend/libs/get-file-request-data');
const { getMimeType } = require('../app/backend/libs/get-mime-type');

describe('getFileRequestData', () => {
    const basePath = path.join(__dirname, '..', 'app', 'frontend');
    const requestInfo = [
        { url: '/', basePath, fileName: 'index.html', filePath: path.join(basePath, "index.html"), mimeType: 'text/html' },
        { url: '/css/style.css', basePath, fileName: 'style.css', filePath: path.join(basePath, "css", "style.css"), mimeType: 'text/css' },
        { url: '/js/index.js', basePath, fileName: 'index.js', filePath: path.join(basePath, "js", "index.js"), mimeType: 'text/javascript' },
        { url: '/js/index.mjs', basePath, fileName: 'index.mjs', filePath: path.join(basePath, "js", "index.mjs"), mimeType: 'text/javascript' },
        { url: '/img/moon.jpg', basePath, fileName: 'moon.jpg', filePath: path.join(basePath, "img", "moon.jpg"), mimeType: 'image/jpeg' },
        { url: '/favicon.ico', basePath, fileName: 'favicon.ico', filePath: path.join(basePath, "favicon.ico"), mimeType: 'image/x-icon' }
    ];
    
    it.each(requestInfo)('should return fileName: $fileName, filePath: $filePath, and mimeType: $mimeType for a valid URL: $url', ({ url, basePath, fileName, filePath, mimeType }) => {
        const req = { url };

        const result = getFileRequestData(req, basePath);
        
        expect(result).toEqual({ fileName, filePath, mimeType });
    })
});

describe('getMimeType', () => {
    const reqUrls = [
        { url: '/', mimeType: 'text/html' },
        { url: '/css/test.css', mimeType: 'text/css' },
        { url: '/js/test.js', mimeType: 'text/javascript' },
        { url: '/js/test.mjs', mimeType: 'text/javascript' },
        { url: '/img/test.jpg', mimeType: 'image/jpeg' },
        { url: '/test.ico', mimeType: 'image/x-icon' },
    ];

    it.each(reqUrls)('should return the correct mime type ($mimeType) for the given URL: %url', ({ url, mimeType}) => {
        const req = { url };

        const result = getMimeType(req);

        expect(result).toBe(mimeType);
    });
});