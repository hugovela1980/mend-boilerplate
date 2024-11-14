import multer from 'multer';
import path from 'path';
import getRootDirectory from '../../../utils/get-root-directory.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = path.join(getRootDirectory(import.meta.dirname), './app/backend/uploads');
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