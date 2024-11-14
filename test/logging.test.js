const { writeLogsToConsole } = require('../app/backend/libs/write-logs-to-console');

describe('write-logs-to-console', () => {
    const logger = {
        trace: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        fatal: jest.fn(),
        custom: jest.fn()
    }
    
    const scenario = [
        { level: 'TRACE', message: 'This is a TRACE level log message', loggerMethod: logger.trace },
        { level: 'DEBUG', message: 'This is a DEBUG level log message', loggerMethod: logger.debug },
        { level: 'INFO', message: 'This is a INFO level log message', loggerMethod: logger.info },
        { level: 'WARN', message: 'This is a WARN level log message', loggerMethod: logger.warn },
        { level: 'ERROR', message: 'This is a ERROR level log message', loggerMethod: logger.error },
        { level: 'FATAL', message: 'This is a FATAL level log message', loggerMethod: logger.fatal },
        { level: 'CUSTOM', message: 'This is a CUSTOM level log message', loggerMethod: logger.custom }
    ];
    
    it.each(scenario)('should log the message based on the log level selected', ({ level, message, loggerMethod }) => {
        const data = { level, message };

        writeLogsToConsole(data, logger);

        expect(loggerMethod).toHaveBeenCalledWith(message);
    });
});