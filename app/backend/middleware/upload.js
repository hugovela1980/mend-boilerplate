import multer from 'multer';
import { destination, filename } from '../../../utils/multer-upload-config.js'


const storage = multer.diskStorage({ destination, filename });

const uploadFiles = multer({ storage });
const upload = uploadFiles.array('files', 10);

export default upload;