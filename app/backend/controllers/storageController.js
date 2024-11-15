import multer from 'multer';
import fs from 'fs';
import path from 'path';
import config from 'config';
import getRootDirectory from '../../../utils/get-root-directory.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = path.join(getRootDirectory(import.meta.dirname), config.get('server.uploadsDir'));
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
        cb(null, filePath);
    },
    filename: (req, file, cb) => {
        const fileName = path.parse(file.originalname).name;
        const fileExt = path.extname(file.originalname);
        const uniqueFileName = fileName + '_' + Date.now() + fileExt;
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage });

export default upload;