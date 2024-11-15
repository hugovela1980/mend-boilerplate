import fs from 'fs';
import path from 'path';
import config from 'config';
import getRootDirectory from '../../../utils/get-root-directory.js';

const getFileNamesFromUploadsDir = () => {
  const rootDir = getRootDirectory(import.meta.dirname);
  const dirPath = path.join(rootDir, config.get('server.uploadsDir'));
  return fs.readdirSync(dirPath);
}

const isValidFile = (fileExt) => {
  const VALID_FILE_EXTENSIONS = ['html', 'css', 'js', 'mjs', 'jpg', 'jpeg', 'png', 'webp', 'ico', 'pdf', 'doc', 'docx']
  return VALID_FILE_EXTENSIONS.includes(fileExt);
};

const streamFile = (filePath) => {
  return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('open', () => resolve(fileStream));
      fileStream.on('error', (err) => reject(err));
  });
};

const deleteFile = (filePath) => {
  return fs.promises.unlink(filePath);
}

export {
  getFileNamesFromUploadsDir,
  isValidFile,
  streamFile,
  deleteFile
}