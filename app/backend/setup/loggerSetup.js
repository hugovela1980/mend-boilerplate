import path from 'path';
import config from 'config';
import { createLogger, createHttpLogger } from '../controllers/loggerController.js';
import getProjectRoot from '../../../utils/get-project-root.js';

const { logger } = createLogger();
const { httpLogger } = createHttpLogger(path.join(getProjectRoot(import.meta.dirname), config.get('app.logFilePath')));

export { logger, httpLogger };