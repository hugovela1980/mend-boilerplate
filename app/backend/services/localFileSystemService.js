import fs from 'fs';
import path from 'path';
import config from 'config';
import getProjectRoot from '../../../utils/get-project-root.js';

const getFileNames = () => {
  const rootDir = getProjectRoot(import.meta.dirname);
  const dirPath = path.join(rootDir, config.get('app.uploadsDir'));
  return fs.readdirSync(dirPath);
}

const isValidFile = (fileExt) => {
  const VALID_FILE_EXTENSIONS = config.get('app.validUploadFileTypes').split(',');
  return VALID_FILE_EXTENSIONS.includes(fileExt);
};

const streamFile = (fileName) => {
  return new Promise((resolve, reject) => {
      const filePath = path.join(getProjectRoot(import.meta.dirname), config.get('app.uploadsDir'), fileName);
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('open', () => resolve(fileStream));
      fileStream.on('error', (err) => reject(err));
  });
};

const deleteFile = (fileName) => {
  const filePath = path.join(getProjectRoot(import.meta.dirname), config.get('app.uploadsDir'), fileName);
  return fs.promises.unlink(filePath);
}

export {
  getFileNames,
  isValidFile,
  streamFile,
  deleteFile
}