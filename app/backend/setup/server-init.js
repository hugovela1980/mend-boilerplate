import config from 'config';
import { logger } from './loggerSetup.js';
import openDevBrowser from '../../../utils/open-development-browser.js';

const serverInit = (server) => {
  const nodeEnv = config.get('server.environment');

  if (nodeEnv === 'production') return logger.info(`Server running in a CONTAINER, in a ${nodeEnv.toUpperCase()} environment.`);

  let url = `http://localhost:`
  if (nodeEnv === 'local') {
    url = url + server.address().port;
    openDevBrowser(url);
    logger.info(`Server running in a ${nodeEnv.toUpperCase()} DEVELOPMENT environment.`)
  } else if (nodeEnv === 'container') {
    url += config.get('server.hostPort');
    logger.info(`Server running in a ${nodeEnv.toUpperCase()}, in a DEVELOPMENT environment.`)
  }
  
  logger.info(config.get('app.startUpMessage').replace(/\{0}/g, url));
};

export default serverInit;
