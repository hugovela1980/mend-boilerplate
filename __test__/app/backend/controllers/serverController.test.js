import config from 'config';
import serverInit from '../../../../app/backend/controllers/serverController';
import { logger } from '../../../../app/backend/setup/loggerSetup';
import openDevBrowser from '../../../../utils/open-development-browser';

vi.mock('../../../../utils/open-development-browser', () => ({
    default: vi.fn()
}));
vi.mock('logger', () => ({
    info: vi.fn(),
    error: vi.fn()
}));
vi.mock('../../../../app/backend/setup/loggerSetup', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn()
    },
    httpLogger: vi.fn()
}));
vi.mock('config', () => ({
    default: {
        get: vi.fn(),
        has: vi.fn()
    }
}));

describe('serverInit', () => {
    const server = {
        address: vi.fn(() => ({ port: 8080 }))
    }
    
    const mockConfig = {
        'server.environment': '',
        'server.hostPort': 50,
        'server.browserHyperlinkHost': 'http://localhost:',
        'server.startUpMessage': 'Server running in a {0} environment and listening on {1}',
        'app.logFilePath': './app/backend/logs/http.log'
    };

    const err = { message: 'Developement browser failed to open'}

    test('successfully calls openDevBrowser and logs app url for local development enviroment', async () => {
        const nodeEnv = 'local development';
        mockConfig['server.environment'] = nodeEnv;
        config.get.mockImplementation((key) => mockConfig[key]);
        const loggerMessage = `Server running in a local development environment and listening on http://localhost:8080`
        
        await openDevBrowser.mockResolvedValue();
        await serverInit(server)
        
        expect(config.get).toHaveBeenCalledWith('server.environment');
        expect(config.get).toHaveBeenCalledWith('server.browserHyperlinkHost');
        expect(openDevBrowser).toHaveBeenCalledWith('http://localhost:8080')
        expect(logger.info).toHaveBeenCalledWith(loggerMessage);
    });
    
    test('call to openDevBrowser fails and logs error for local development enviroment', async () => {
        const nodeEnv = 'local development';
        mockConfig['server.environment'] = nodeEnv;
        config.get.mockImplementation((key) => mockConfig[key]);
        openDevBrowser.mockRejectedValue(new Error(err.message));
        
        await serverInit(server);
        
        expect(logger.error).toHaveBeenCalledWith(err.message);
        
    });
    
    test('logs initial message and app url for production environment', async () => {
        const nodeEnv = 'production container';
        const loggerMessage = `Server running in a production container environment and listening on http://localhost:50`;
        mockConfig['server.environment'] = nodeEnv;
        config.get.mockImplementation((key) => mockConfig[key]);

        await serverInit();
        
        expect(logger.info).toHaveBeenCalledWith(loggerMessage);
    });
    
    test('logs initial message and app url for container development environment', async () => {
        const nodeEnv = 'container';
        mockConfig['server.environment'] = nodeEnv;
        config.get.mockImplementation((key) => mockConfig[key]);
    
        await serverInit();

        expect(config.get).toHaveBeenCalledWith('server.environment');
        expect(config.get).toHaveBeenCalledWith('server.browserHyperlinkHost');
        expect(config.get).toHaveBeenCalledWith('server.startUpMessage');
    });
});