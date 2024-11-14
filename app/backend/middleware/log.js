import { httpLogger } from '../setup/loggerSetup.js'

const log = (req, res, next) => {
    httpLogger(req, res);
    next();
}

export default log;