import { expect } from 'vitest';
import { uploadFilesHandler, deleteFileHandler, getFileNamesHandler, previewFileHandler, renderIndex, renderUploadPage } from '../../../../app/backend/controllers/fileController';
import { getFileNames, streamFile, deleteFile } from '../../../../app/backend/services/localFileSystemService';
import { logger } from '../../../../app/backend/setup/loggerSetup';

vi.mock('../../../../app/backend/services/localFileSystemService', () => ({
    getFileNames: vi.fn(),
    streamFile: vi.fn(),
    deleteFile: vi.fn(),
}));
vi.mock('../../../../app/backend/setup/loggerSetup', () => ({
    logger: {
        trace: vi.fn(),
        error: vi.fn(),
        info: vi.fn()
    }
}));

describe('fileController.js', () => {
    let req, res;
    const valid_file_name = 'file.txt';
    const invalid_file_name = 'invalid-file.txt';

    beforeEach(() => {
        req = { 
            query: { fileName: '' },
            log: { error: vi.fn() },
            files: []
        };
        res = {
            render: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            writeHead: vi.fn(),
            send: vi.fn(),
            end: vi.fn()
        };
    });

    describe('Render static pages', () => {
        test('renderIndex', () => {
            renderIndex(req, res);
            expect(res.render).toHaveBeenCalledWith('index');
        });
    
        test('renderUploadPage', () => {
            renderUploadPage(req, res);
            expect(res.render).toHaveBeenCalledWith('upload');
        });
    });

    describe('getFileNameHandler', () => {
        test('send array of file names to client', () => {
            const fileNames = ['file1.txt', 'file2.txt'];
            getFileNames.mockReturnValue(fileNames);
    
            getFileNamesHandler(req, res);
    
            expect(getFileNames).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(fileNames);
        });
    
        test('sends a status code and a response of blank array', () => {
            const mockStatusCode = 500;
            const mockResponse = [];
            getFileNames.mockImplementation(() => {throw new Error});
    
            getFileNamesHandler(req, res);
    
            expect(res.status).toHaveBeenCalledWith(mockStatusCode);
            expect(res.send).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('previewFileHandler', () => {
        test('successfully send file stream to client', async () => {
            const validFileName = 'file.txt';
            req.query.fileName = validFileName;
            const mockFileStream = {
                pipe: vi.fn()
            }
            const statusCode = 200;
            const headers = { 'Content-Type': 'text/plain' }
            
            streamFile.mockReturnValue(mockFileStream);
            await previewFileHandler(req, res);
    
            expect(streamFile).toHaveBeenCalledWith('file.txt');
            expect(res.writeHead).toHaveBeenCalledWith(statusCode, headers)
            expect(logger.trace).toHaveBeenCalledWith(`serving file.txt to client`)
            expect(mockFileStream.pipe).toHaveBeenCalledWith(res);
        });

        test('logs and sends error to client', async () => {
            const invalidFileName = 'missing-file.txt';
            const mockError = {code: 'ENOENT', message: 'File not found'};
            req.query.fileName = invalidFileName;
            const loggerErrorMessage = `Error reading file: ${invalidFileName}: ${mockError.message}`
            
            const statusCode = 404;
            const headers = { 'Content-Type': 'text/plain' }
            
            streamFile.mockRejectedValue(mockError);
            await previewFileHandler(req, res);

            expect(streamFile).toHaveBeenCalledWith(invalidFileName);
            expect(req.log.error).toHaveBeenCalledWith(loggerErrorMessage);
            expect(logger.error).toHaveBeenCalledWith(loggerErrorMessage);
            expect(res.writeHead).toHaveBeenCalledWith(statusCode, headers)
            expect(res.end).toHaveBeenCalledWith(mockError.message);
        });

        test('logs and sends non-ENOENT errors to client', async () => {
            const validFileName = 'file.txt';
            const mockError = {code: 'OTHER_ERROR', message: 'Internal Server Error'};
            req.query.fileName = validFileName;
            const loggerErrorMessage = `Error reading file: ${validFileName}: ${mockError.message}`
            
            const statusCode = 500;
            const headers = { 'Content-Type': 'text/plain' }
            
            streamFile.mockRejectedValue(mockError);
            await previewFileHandler(req, res);

            expect(streamFile).toHaveBeenCalledWith(validFileName);
            expect(req.log.error).toHaveBeenCalledWith(loggerErrorMessage);
            expect(logger.error).toHaveBeenCalledWith(loggerErrorMessage);
            expect(res.writeHead).toHaveBeenCalledWith(statusCode, headers)
            expect(res.end).toHaveBeenCalledWith(mockError.message);
        });
    });

    describe('deleteFileHandler', () => {
        test('successfully deletes a file', async () => {
            const validFileName = 'file.txt';
            req.query.fileName = validFileName;
            
            const loggerMessage = `${validFileName} successfully deleted`;
            const statusCode = 200;
            const headers = { 'Content-Type': 'application/json' };

            const successResponse = { message: `File successfully deleted`, deletedFile: validFileName }

            deleteFile.mockResolvedValue();
            await deleteFileHandler(req,res);

            expect(deleteFile).toHaveBeenCalledWith(validFileName);
            expect(logger.info).toHaveBeenCalledWith(loggerMessage);
            expect(res.writeHead).toHaveBeenCalledWith(statusCode, headers);
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(successResponse))
        });
        
        test('log and send error to client', async () => {
            const fileName = invalid_file_name;
            req.query.fileName = fileName;
            
            const loggerMessage = { message: `error deleting file: ${fileName}`}
            const errorResponse = { message: 'File deletion failed' };
            const statusCode = 500;
            const headers = { 'Content-Type': 'application/json' };
            
            deleteFile.mockRejectedValue();
            await deleteFileHandler(req, res);
            
            expect(deleteFile).toHaveBeenCalledWith(fileName);
            expect(req.log.error).toHaveBeenCalledWith(loggerMessage);
            expect(logger.error).toHaveBeenCalledWith(loggerMessage);
            expect(res.writeHead).toHaveBeenCalledWith(statusCode, headers);
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(errorResponse))
        });
    });

    describe('uploadFilesHandler', () => {
        test('send success response to client and log', () => {
            const files = [{ filename: 'file1.txt' }, { filename: 'file2.txt' }];
            req.files = files;
            const mockUploadedFileData = [];
            files.forEach(({ filename }) => {
                mockUploadedFileData.push({ uploadedFile: filename, message: 'File successfully uploaded' })
            });
            const statusCode = 200;
            
            uploadFilesHandler(req, res);
            
            expect(logger.info).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(statusCode);
            expect(res.json).toHaveBeenCalledWith(mockUploadedFileData);
        });
        
        test('send error response to client', () => {
            const statusCode = 400;
            const responseMessage = {message: 'not uploaded'};
            
            uploadFilesHandler(req, res);
            
            expect(res.status).toHaveBeenCalledWith(statusCode)
            expect(res.json).toHaveBeenCalledWith(responseMessage);
        });
    });
    
});