import express from 'express';
import upload from '../middleware/upload.js'
import log from '../middleware/log.js'
import {
    renderIndex,
    renderUploadPage,
    getFileNamesHandler,
    previewFileHandler,
    deleteFileHandler,
    uploadFilesHandler
} from '../controllers/fileController.js'

const router = new express.Router();

router.get('/', renderIndex);
router.get('/upload', renderUploadPage);
router.get('/filenames', log, getFileNamesHandler);
router.post('/upload_files', log, upload, uploadFilesHandler);
router.get('/preview', log, previewFileHandler);
router.delete('/delete', log, deleteFileHandler);

export default router;
