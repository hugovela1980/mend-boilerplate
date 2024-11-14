import fs from 'fs';
import path from 'path';
import config from 'config';
import { logger } from '../setup/loggerSetup.js';
import getRootDirectory from '../../../utils/get-root-directory.js';
import getFileFromMultiPartFormData from '../../../utils/get-file-from-multi-part-form-data.js';
import saveFileToFileSystem from '../../../utils/save-file-to-file-system.js';
import { serveUploadedFileNames, getFileNamesFromUploadsDir } from './fileService.js';

const uploadFiles = ({ headers, buffer }, res) => {
  const files = getFileFromMultiPartFormData(headers, buffer);

  const uploadDirr = path.join(getRootDirectory(new URL(import.meta.dirname).pathname), config.get('server.uploadDir'));
  if (!fs.existsSync(uploadDirr)) fs.mkdirSync(uploadDirr);
  
  files.forEach(file => {
    saveFileToFileSystem(file.name, file.content, uploadDirr);
    logger.info('File Saved: ' + file.name);
  });

  serveUploadedFileNames(res);
};

const deleteFiles = ({ searchParams, req }, res) => {
  const fileName = searchParams.fileName;
  const filePath = path.join(new URL(import.meta.dirname).pathname, '..', 'uploads', fileName);

  fs.unlink(filePath, (error) => {
    if (error) {
      req.log.error({ message: `error deleting file: ${fileName}`, error });
      logger.error({ message: `error deleting file: ${fileName}`, error });
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'File deletion failed' }));
    } else {
      logger.info(`${fileName} successfully deleted`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `File Deleted: ${fileName}`, fileList: getFileNamesFromUploadsDir()}))
    }
  });
}

const deleteFile = (filePath) => {
  return fs.promises.unlink(filePath);
}

export { uploadFiles, deleteFiles, deleteFile };
