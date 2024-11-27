import open from 'open';
import config from 'config';
import openDevBrowser from '../../utils/open-development-browser';
import isValidUrl from '../../utils/is-valid-url';
import { beforeEach } from 'vitest';

vi.mock('open', () => ({
    default: vi.fn()
}));
vi.mock('config', () => ({ 
    default: {
        get: vi.fn()
    } 
}));
vi.mock('../../utils/is-valid-url', () => ({
    default: vi.fn()
}));

describe('openDevBrowser', () => {
    let mockConfig;
    
    beforeEach(() => {
        mockConfig = {
            'server.devBrowserPage': '/upload',
            'server.isDevBrowserOn': undefined
        };
    });
    
    test('calls open with correct arguments to open browser with devtools', async () => {
        const testUrl = 'http://localhost:3000';
        const chosenPath = '/upload';
        const openSettings = { app: { name: 'chrome', arguments: ['--auto-open-devtools-for-tabs'] } };
        mockConfig['server.isDevBrowserOn'] = true;
        
        config.get.mockImplementation(key => mockConfig[key])
        isValidUrl.mockReturnValue(true);
        await openDevBrowser(testUrl); 
        
        expect(config.get).toHaveBeenCalledWith('server.isDevBrowserOn');
        expect(config.get).toHaveBeenCalledWith('server.devBrowserPage');
        expect(open).toHaveBeenCalledWith(testUrl + chosenPath, openSettings);
    });
    
    test('throws an error if the URL is invalid', async () => {
        const invalidUrl = 'not-a-valid-url';
        const errorMessage = 'Development browser failed to open because of invalid url';
        mockConfig['server.isDevBrowserOn'] = true;
        
        isValidUrl.mockReturnValue(false);
        config.get.mockImplementation(key => mockConfig[key]);

        await expect(openDevBrowser(invalidUrl)).rejects.toThrow(errorMessage);
    });

    test('returns immediately if "server.isDevBrowserOn" flag is set to false', async () => {
        const validUrl = 'http://mock-url.com';
        mockConfig['server.isDevBrowserOn'] = false;

        config.get.mockImplementation(key => mockConfig[key]);

        await openDevBrowser(validUrl);
        
        expect(isValidUrl).not.toHaveBeenCalled();
        expect(open).not.toHaveBeenCalled();
    });
});