import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import siteRouter from '../routes/site.js';
import getRootDirectory from '../../../utils/get-root-directory.js';

const app = express();

// Define paths for express config
const rootDir = getRootDirectory(import.meta.dirname);
const publicDirPath = path.join(rootDir, 'app', 'frontend');
const viewsDirPath = path.join(rootDir, 'app', 'backend', 'templates', 'views');

// Set up EJS engine and views location
app.set('view engine', 'ejs');
app.set('views', viewsDirPath);

// Set up static directory to serve
app.use(express.static(publicDirPath));


// Set up middleware
app.use(favicon(path.join(publicDirPath, 'favicon.ico')));
app.use(express.json());

// Set up router to serve data
app.use(siteRouter);

export default app;
