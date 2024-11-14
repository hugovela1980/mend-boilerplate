const fs = require('fs');
const requestHandling = require('../app/backend/requests');
const requestData = require('../app/backend/libs/get-file-request-data');

jest.mock('path');
jest.mock('fs');
jest.mock('config', () => ({
    get: jest.fn((key) => {
      if (key === 'app.startUpMessage') return 'Server started at {0}';
      if (key === 'server.open') return true;
      // Add other config values as needed
    })
}));
jest.mock('pino', () => {
    const mockPino = jest.fn(() => ({
      info: jest.fn(),
      error: jest.fn(),
      trace: jest.fn(),
      custom: jest.fn()
    }));
  
    mockPino.transport = jest.fn(() => ({ end: jest.fn() }));
    mockPino.stdTimeFunctions = { isoTime: jest.fn() };
  
    return mockPino;
});
jest.mock('pino-http', () => {
    return jest.fn(() => ({
        logger: { info: jest.fn(), error: jest.fn() },
        end: jest.fn()
    }));
});
jest.mock('../app/backend/libs/get-file-request-data');
jest.mock('../app/backend/libs/write-logs-to-console');

describe('handleLogRequests', () => {
    it('should handle streaming of multiple chunks correctly', () => {
        const req = { on: jest.fn() };
        const res = { end: jest.fn() };
        const logger = {};
        const httpLogger = {};

        let dataCallback;
        let endCallback;

        req.on.mockImplementation((event, callback) => {
            if (event === 'data') dataCallback = callback;
            if (event === 'end') endCallback = callback;
        });

        requestHandling.handleLogRequests(req, res, { logger, httpLogger });

        // Simulate multiple 'data' events
        dataCallback(Buffer.from('{"key1":'));
        dataCallback(Buffer.from('"value1",'));
        dataCallback(Buffer.from('"message":'));
        dataCallback(Buffer.from('"value2"}'));

        // Simulate 'end' event
        endCallback();

        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ 
            status: 'request received', 
            msg: 'value2' 
        }));
    });
});

describe('serveStaticFiles', () => {
    let req, res, logger, httpLogger;

    beforeEach(() => {
        req = { url: '/test.html', on: jest.fn() };
        res = { writeHead: jest.fn(), end: jest.fn() };
        logger = { trace: jest.fn(), custom: jest.fn() };
        httpLogger = { trace: jest.fn(), custom: jest.fn() };
    });

    it('should serve a file successfully', () => {
        const mockFile = {
            on: jest.fn(),
            pipe: jest.fn()
        }
        fs.createReadStream.mockReturnValue(mockFile);

        const mockFileData = {
            fileName: 'test.html',
            filePath: '/path/to/test.html',
            mimeType: 'text/html'
        };
        requestData.getFileRequestData.mockReturnValue(mockFileData);

        requestHandling.serveStaticFiles(req, res, { logger, httpLogger });

        mockFile.on.mock.calls[0][1]();

        expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/html' });
        expect(logger.trace).toHaveBeenCalledWith('serving test.html to client');
        expect(mockFile.pipe).toHaveBeenCalledWith(res);
    });

    it('should handle file serving errors', () => {
        const mockFile = {
            on: jest.fn(),
            pipe: jest.fn()
        };
        fs.createReadStream.mockReturnValue(mockFile);

        const mockFileData = {
            fileName: 'test.html',
            filePath: '/path/to/test.html',
            mimeType: 'text/html'
        };
        requestData.getFileRequestData.mockReturnValue(mockFileData);

        requestHandling.serveStaticFiles(req, res, { logger, httpLogger });

        const mockError = new Error('File not found');
        mockFile.on.mock.calls[1][1](mockError);

        expect(res.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'text/plain' });
        expect(logger.custom).toHaveBeenCalledWith('Error serving test.html: File not found');
        expect(res.end).toHaveBeenCalledWith('Internal Server Error');
    });
});