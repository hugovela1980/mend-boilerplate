import fs from 'fs';
import path from 'path';
import config from 'config';
import getProjectRoot from './get-project-root.js';

export const destination = (req, file, cb) => {
    const filePath = path.join(getProjectRoot(import.meta.dirname), config.get('app.uploadsDir'));
    if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
    cb(null, filePath);
};
export const filename = (req, file, cb) => {
    const fileName = path.parse(file.originalname).name;
    const fileExt = path.extname(file.originalname);
    const uniqueFileName = fileName + '_' + Date.now() + fileExt;
    cb(null, uniqueFileName);
};
