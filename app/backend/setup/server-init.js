import config from 'config';
import { logger } from './loggerSetup.js';
import openDevBrowser from '../../../utils/open-development-browser.js';

const serverInit = (server) => {
  const nodeEnv = config.get('server.environment');

  if (nodeEnv === 'production') return;

  let url = `http://localhost:`
  if (nodeEnv === 'local') {
    url = url + server.address().port;
    openDevBrowser(url);
  } else if (nodeEnv === 'container') {
    url += config.get('server.hostPort');
  }
  
  logger.info(config.get('app.startUpMessage').replace(/\{0}/g, url));
};

export default serverInit;
