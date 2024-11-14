import fs from 'fs';
import pth from 'path';
import { logger } from '../setup/loggerSetup.js';
import getRootDirectory from '../../../utils/get-root-directory.js';

const serveStaticFiles = ({ fileExt, searchParams, fileName, reqUrl, mimeType }, res) => {
  if (!isValidFile(fileExt)) return; 

  let filePath = '';
  if (searchParams.preview || searchParams.delete) filePath = pth.join(new URL(import.meta.dirname).pathname, '..', 'uploads', fileName)
  else filePath = pth.join(new URL(import.meta.dirname).pathname, '..', '..', 'frontend', reqUrl);
  
  const file = fs.createReadStream(filePath);
  file.on('error', (error) => {
    logger.custom(`Error serving ${fileName}: ${error.message}`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  });
  
  file.on('open', () => {
    res.writeHead(200, { 'Content-Type': mimeType });
    logger.trace(`serving ${fileName} to client`);
    file.pipe(res);
  });
};


const serveUploadedFileNames = (res) => {
  const dirPath = pth.join(new URL(import.meta.dirname).pathname, '..', 'uploads');
  const files = fs.readdirSync(dirPath);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(files));
};

const getFileNamesFromUploadsDir = () => {
  const rootDir = getRootDirectory(import.meta.dirname);
  const dirPath = pth.join(rootDir, './app/backend/uploads');
  return fs.readdirSync(dirPath);
}

const isValidFile = (fileExt) => {
  const VALID_FILE_EXTENSIONS = ['html', 'css', 'js', 'mjs', 'jpg', 'jpeg', 'png', 'webp', 'ico', 'pdf']
  return VALID_FILE_EXTENSIONS.includes(fileExt);
};

const streamFile = (filePath) => {
  return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);

      // Resolve the promise when the stream opens successfully
      fileStream.on('open', () => resolve(fileStream));

      // Reject the promise if there’s an error in reading the file
      fileStream.on('error', (err) => reject(err));
  });
}

// const serveLowResImage = async ({ searchParams, mimeType }, res) => {
//   const originalImagePath = pth.join(new URL(import.meta.dirname).pathname, '..', 'uploads', searchParams.fileName);
//   if (!fs.existsSync(originalImagePath)) return res.writeHead(404).end();
//   const imageFile = fs.createReadStream(originalImagePath);
//   imageFile.on('data', () => {

//   });
  
//   resizeImageWithSharp(originalImagePath)
//     .then(transformedStream => {
//       res.writeHead(300, { 'Content-Type': mimeType });
//       transformedStream.pipe(res);
//     })
//     .catch(error => {
//       logger.error(error.message);
//       res.writeHead(500, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ message: 'Error processing image', error: error.message }));
//     })
// };

export {
  serveStaticFiles,
  serveUploadedFileNames,
  getFileNamesFromUploadsDir,
  isValidFile,
  streamFile
}