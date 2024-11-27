import express from 'express';
import path from 'path';
import cors from 'cors';
import favicon from 'serve-favicon';
import config from 'config';
import siteRouter from '../routes/site.js';
import getProjectRoot from '../../../utils/get-project-root.js';

const app = express();

// // Define paths for express configuration
const rootDir = getProjectRoot(import.meta.dirname);
const publicDirPath = path.join(rootDir, config.get('express.publicDirPath'));
const viewsDirPath = path.join(rootDir, config.get('express.viewsDirPath'));

// Set up EJS engine and views location
app.set('view engine', 'ejs');
app.set('views', viewsDirPath);

// Set up static directory to serve
app.use(express.static(publicDirPath));


// Set up middleware
app.use(cors());
app.use(favicon(path.join(publicDirPath, './favicon.ico')));
app.use(express.json());

// Set up router to serve data
app.use(siteRouter);

export default app;
