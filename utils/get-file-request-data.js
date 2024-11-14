import path from 'path';
import { getMimeType } from './get-mime-type.js';

const getFileRequestData = (req, basePath) => {
    if (req.url === '/') {
        return {
            fileName: 'index.html',
            fullPath: path.join(basePath + '/index.html'),
            mimeType: getMimeType(req)
        };
    } else {
        return {
            fileName: req.url.split('/').pop(),
            fullPath: path.join(basePath, req.url),
            mimeType: getMimeType(req)
        };
    }
}

export { getFileRequestData };