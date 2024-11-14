import { logger } from '../setup/loggerSetup.js';

const handleLogRequests = ({ buffer, req }, res) => {
    const logData = JSON.parse(buffer);
  
    writeHttpLogsToFile(logData, req);
    writeLogsToConsole(logData, logger);

    res.end(JSON.stringify({ status: 'request received', msg: logData.message }));
};

const writeHttpLogsToFile = (logData, req) => {
    if (logData.level === 'ERROR') req.log.error(logData.message);
    if (logData.level === 'FATAL') req.log.fatal(logData.message);
    if (logData.level === 'CUSTOM') req.log.custom(logData.message);
};

const writeLogsToConsole = (logData) => {
    if (logData.level === 'TRACE') logger.trace(logData.message);
    if (logData.level === 'DEBUG') logger.debug(logData.message);
    if (logData.level === 'INFO') logger.info(logData.message);
    if (logData.level === 'WARN') logger.warn(logData.message);
    if (logData.level === 'ERROR') logger.error(logData.message);
    if (logData.level === 'FATAL') logger.fatal(logData.message);
    if (logData.level === 'CUSTOM') logger.custom(logData.message);
};

export default handleLogRequests;