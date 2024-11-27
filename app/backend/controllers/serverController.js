import config from 'config';
import { logger } from '../setup/loggerSetup.js';
import openDevBrowser from '../../../utils/open-development-browser.js';

const serverInit = async (server) => {
  const nodeEnv = config.get('server.environment');
  let url = config.get('server.browserHyperlinkHost')
  
  if (nodeEnv === 'production container' || nodeEnv === 'development container') {
    url += config.get('server.hostPort');
  }
  else if (nodeEnv === 'local development') {
    url += server.address().port;
    try {
      await openDevBrowser(url);
    } catch (err) {
      return logger.error(err.message);
    }
  }
  
  logger.info(
    config.get('server.startUpMessage')
      .replace(/\{0}/g, config.get('server.environment'))
      .replace(/\{1}/g, url)
  );
};

export default serverInit;

