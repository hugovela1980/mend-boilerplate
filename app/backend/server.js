import config from 'config';
import app from './setup/expressApp.js';
import serverInit from './setup/server-init.js';

const port = config.get('server.port');
const host = config.get('server.host');

const server = app.listen(port, host, () => serverInit(server));
