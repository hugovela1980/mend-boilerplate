import express from 'express';
import path from 'path';
import fs from 'node:fs';
import { logger } from '../setup/loggerSetup.js';
import log from '../middleware/log.js'
import upload from '../controllers/fileController.js'
import getMimeType from '../../../utils/get-mime-type.js';
import getRootDirectory from '../../../utils/get-root-directory.js';
import { getFileNamesFromUploadsDir, streamFile } from '../services/fileService.js'
import { deleteFile } from '../services/storageService.js'

const router = new express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/upload', (req, res) => {
    res.render('upload');
});

router.get('/filenames', (req, res) => {
    try {
        const filenames = getFileNamesFromUploadsDir();
        res.send(filenames);
    } catch(err) {
        res.status(500).send();
    }
});

router.get('/preview', log, async (req, res) => {
    const fileName = req.query.fileName;
    const mimeType = getMimeType(fileName);
    const filePath = path.join(getRootDirectory(import.meta.dirname), './app/backend/uploads', fileName);
    
    try {
        const file = await streamFile(filePath);

        res.writeHead(200, { 'Content-Type': mimeType });
        logger.trace(`serving ${fileName} to client`);
        file.pipe(res);

    } catch (err) {
        if (err.code === 'ENOENT') {
            req.log.error(`Error reading file ${fileName}: ${err.message}`);
            logger.error(`Error reading file ${fileName}: ${err.message}`);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            req.log.error(`Error serving ${fileName}: ${err.message}`);
            logger.error(`Error serving ${fileName}: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
});

router.delete('/delete', log, async (req, res) => {
    const fileName = req.query.fileName;
    const filePath = path.join(getRootDirectory(import.meta.dirname), './app/backend/uploads', fileName);

    try {
        await deleteFile(filePath);

        logger.info(`${fileName} successfully deleted`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `File Deleted: ${fileName}`, fileList: getFileNamesFromUploadsDir()}))
        
    } catch (err) {
        req.log.error({ message: `error deleting file: ${fileName}`, err });
        logger.error({ message: `error deleting file: ${fileName}`, err });
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File deletion failed' }));
    }
});

router.post('/upload_files', upload.array('files', 5), (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400);
    
    const fileNames = req.files.map(file => file.filename);
    res.status(200).json(fileNames);
});

export default router;
