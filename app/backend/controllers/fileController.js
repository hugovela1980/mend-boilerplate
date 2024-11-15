import path from 'path';
import config from 'config';
import { logger } from '../setup/loggerSetup.js';
import { getFileNamesFromUploadsDir, streamFile, deleteFile } from '../services/fileService.js'
import getMimeType from '../../../utils/get-mime-type.js';
import getRootDirectory from '../../../utils/get-root-directory.js';

export const renderIndex = (req, res) => {
    res.render('index');
};

export const renderUploadPage = (req, res) => {
    res.render('upload');
};

export const getFileNamesHandler = (req, res) => {
    try {
        const filenames = getFileNamesFromUploadsDir();
        res.send(filenames);
    } catch(err) {
        res.status(500).send([]);
    }
};

export const previewFileHandler = async (req, res) => {
    const fileName = req.query.fileName;
    const mimeType = getMimeType(fileName);
    const filePath = path.join(getRootDirectory(import.meta.dirname), config.get('server.uploadsDir'), fileName);
    
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
};

export const deleteFileHandler = async (req, res) => {
    const fileName = req.query.fileName;
    const filePath = path.join(getRootDirectory(import.meta.dirname), config.get('server.uploadsDir'), fileName);
    let fileList = [];

    try {
        await deleteFile(filePath);
        
        fileList = getFileNamesFromUploadsDir()

        logger.info(`${fileName} successfully deleted`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `File successfully deleted`, deletedFile: fileName }))
        
    } catch (err) {
        req.log.error({ message: `error deleting file: ${fileName}`, err });
        logger.error({ message: `error deleting file: ${fileName}`, err });
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File deletion failed' }));
    }
};

export const uploadFilesHandler = (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({message: 'not uploaded'});
    
    const uploadedFileData = [];
    req.files.forEach(({ filename }) => {
        const message = 'File successfuly uploaded';
        const uploadedFile = filename;
        uploadedFileData.push({ uploadedFile, message });
        logger.info(`${filename} successfully uploaded`)
    });
    
    res.status(200).json(uploadedFileData);
};