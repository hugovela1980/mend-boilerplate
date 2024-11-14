import path from 'path';
import config from 'config';
import { createLogger, createHttpLogger } from '../../../utils/create-loggers.js';
import getRootDirectory from '../../../utils/get-root-directory.js';

const { logger, loggerCleanup } = createLogger();

const httpLogPath = path.join(getRootDirectory(import.meta.dirname), config.get('server.logFilePath'));
const { httpLogger, httpLoggerCleanup } = createHttpLogger(httpLogPath);

export {
    logger,
    loggerCleanup,
    httpLogger,
    httpLoggerCleanup,
}