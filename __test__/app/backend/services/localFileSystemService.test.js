import fs from 'fs';
import path from 'path';
import config from 'config';
import getProjectRoot from '../../../../utils/get-project-root.js';
import { getFileNames, isValidFile, streamFile, deleteFile } from '../../../../app/backend/services/localFileSystemService.js';

vi.mock('../../../../utils/get-project-root.js', () => ({
    default: vi.fn((currentDir) => path.normalize(path.parse(currentDir).root))
}));
vi.mock('fs', () => ({
    default: {
        createReadStream: vi.fn((filePath) => ({
            on: vi.fn((event, callback) => {
                if (event === 'open') callback();
                if (event === 'error') callback(new Error('File not found'));
                return mockFileStream; 
            })
        })),
        readdirSync: vi.fn(() => ['file1.txt', 'file2.txt']),
        promises: {
            unlink: vi.fn()
        }
    }
}));
vi.mock('config', () => ({
    default: {
        get: vi.fn((key) => {
            const mockConfig = {
                'app.uploadsDir': './app/uploads',
                'app.validUploadFileTypes': 'pdf,jpg'
            }
            return mockConfig[key] || null;
        })
    }
}));

describe('getFileNames', () => {
    test('returns an array of file names', () => {
        const mockRootDir = path.normalize('./mock-root-directory');
        const mockFilesDirPath = path.join(mockRootDir, config.get('app.uploadsDir'));
        getProjectRoot.mockReturnValue(mockRootDir);
        
        const result = getFileNames();

        expect(result).toStrictEqual(['file1.txt', 'file2.txt']);
        expect(getProjectRoot).toHaveBeenCalled();
        expect(config.get).toHaveBeenCalledWith('app.uploadsDir');
        expect(fs.readdirSync).toHaveBeenCalledWith(mockFilesDirPath);
    });
});

describe('isValidFile', () => {
    const validFileExt = 'pdf';
    const invalidFileExt = 'ppt';
    const key = 'app.validUploadFileTypes';

    test('file name has a valid file extension', () => {
        expect(isValidFile(validFileExt)).toBe(true);
        expect(config.get).toHaveBeenCalledWith(key);
    });

    test('file name has a invalid file extension', () => {
        expect(isValidFile(invalidFileExt)).toBe(false);
        expect(config.get).toHaveBeenCalledWith(key);
    });
});

describe('streamFile', () => {
    test('resolves to a read stream of a given file', async () => {
        const validFileName = 'file.txt';
        const mockRootDir = './project-root';
        const mockFilePath = path.normalize('./project-root/app/uploads/file.txt');
        const mockFileStream = {
            on: vi.fn((event, callback) => {
                if (event === 'open') callback();
                return mockFileStream; 
            })
        };
        getProjectRoot.mockReturnValue(path.normalize(mockRootDir))
        fs.createReadStream.mockReturnValue(mockFileStream);
        
        const result = await streamFile(validFileName);
        
        expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath);
        expect(result).toBe(mockFileStream);
    });

    test('rejects with an error on an error event', async () => {
        const invalidFileName = 'non-existant-file.txt';
        const mockFileStream = {
            on: vi.fn((event, callback) => {
                if (event === 'error') callback(new Error('File not found'));
                return mockFileStream; 
            })
        };
        fs.createReadStream.mockReturnValue(mockFileStream);
        
        await expect(streamFile(invalidFileName)).rejects.toThrow('File not found');
    });
});

describe('deleteFile', () => {
    test('deletes file successfully', async () => {
        const validFileName = 'file.txt';
        const mockRootDir = './project-root';
        const mockFilePath = path.normalize('./project-root/app/uploads/file.txt');
        getProjectRoot.mockReturnValue(mockRootDir);
        fs.promises.unlink.mockResolvedValueOnce();

        await expect(deleteFile(validFileName)).resolves.toBeUndefined();
        await expect(fs.promises.unlink).toHaveBeenCalledWith(mockFilePath);
    });

    test('throws an error if file does not exist', async () => {
        
        const validFileName = 'file.txt';
        const mockRootDir = './project-root';
        const mockError = { code: 'ENOENT', message: 'File not found' };
        getProjectRoot.mockReturnValue(mockRootDir);
        fs.promises.unlink.mockRejectedValueOnce(mockError);

        await expect(deleteFile(validFileName)).rejects.toThrow('File not found');
    });
});

