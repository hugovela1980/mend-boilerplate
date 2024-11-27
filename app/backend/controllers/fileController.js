import mime from 'mime-types';
import { logger } from '../setup/loggerSetup.js';
import { getFileNames, streamFile, deleteFile } from '../services/localFileSystemService.js'

export const renderIndex = (req, res) => {
    res.render('index');
};

export const renderUploadPage = (req, res) => {
    res.render('upload');
};

export const getFileNamesHandler = (req, res) => {
    try {
        const filenames = getFileNames();
        res.send(filenames);
    } catch(err) {
        res.status(500).send([]);
    }
};

export const previewFileHandler = async (req, res) => {
    const fileName = req.query.fileName;
    
    try {
        const file = await streamFile(fileName);

        res.writeHead(200, { 'Content-Type': mime.lookup(fileName) });
        logger.trace(`serving ${fileName} to client`);
        file.pipe(res);

    } catch (err) {
        if (err.code === 'ENOENT') {
            req.log.error(`Error reading file: ${fileName}: ${err.message}`);
            logger.error(`Error reading file: ${fileName}: ${err.message}`);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            req.log.error(`Error reading file: ${fileName}: ${err.message}`);
            logger.error(`Error reading file: ${fileName}: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
};

export const deleteFileHandler = async (req, res) => {
    const fileName = req.query.fileName;

    try {
        await deleteFile(fileName);

        logger.info(`${fileName} successfully deleted`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `File successfully deleted`, deletedFile: fileName }))
        
    } catch (err) {
        req.log.error({ message: `error deleting file: ${fileName}`});
        logger.error({ message: `error deleting file: ${fileName}`});
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File deletion failed' }));
    }
};

export const uploadFilesHandler = (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({message: 'not uploaded'});
    
    const uploadedFileData = [];
    req.files.forEach(({ filename }) => {
        const message = 'File successfully uploaded';
        const uploadedFile = filename;
        uploadedFileData.push({ uploadedFile, message });
        logger.info(`${filename} successfully uploaded`)
    });
    
    res.status(200).json(uploadedFileData);
};