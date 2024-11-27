import pino from 'pino';
import pinoHttp from 'pino-http';

const createLogger = () => {
  const options = {
    level: 'trace',
    customLevels: { custom: 70 },
    redact: {
      paths: ['hostname']
    },
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      }
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  const consoleStream = pino.transport({
    target: 'pino-pretty',
    options: { colorize: true }
  });

  const logger = pino(options, consoleStream);
  
  return { logger };
};

const createHttpLogger = (filePath) => {
  const options = {
    level: 'error',
    autoLogging: false,
    customLevels: { custom: 70 },
    useLevel: 'error',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      }
    }
  };

  const fileStream = pino.transport({
    target: 'pino/file',
    options: {
      destination: filePath,
      mkdir: true,
      level: 'error'
    }
  });

  const httpLogger = pinoHttp(options, fileStream);

  return { httpLogger };
};

export { createLogger, createHttpLogger };