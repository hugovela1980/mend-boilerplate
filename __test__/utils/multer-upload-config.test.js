import path from 'path';
import fs, { mkdirSync } from 'fs';
import config from 'config';
import getProjectRoot from '../../utils/get-project-root.js';
import { destination, filename } from '../../utils/multer-upload-config.js';

vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
        mkdirSync: vi.fn()
    }
}));
vi.mock('config', () => ({
    default: {
        get: vi.fn()
    }
}));
vi.mock('../../utils/get-project-root.js', () => ({
    default: vi.fn()
}));

describe('multer-upload-config', () => {
    const req = {};
    const file = { originalname: 'file.txt' };
    const cb = vi.fn();
    
    describe('destination', () => {
        const mockConfig = {
            'app.uploadsDir': './app/uploads'
        };
        
        const projectRoot = './project-root';
        const filePath = path.join(projectRoot, mockConfig['app.uploadsDir'])
    
        test('successfully uploads file to uploads directory by calling the callback', () => {
            getProjectRoot.mockReturnValue(projectRoot);
            config.get.mockImplementation(key => mockConfig[key]);
            fs.existsSync.mockReturnValue(true);
            destination(req, file, cb);
            
            expect(cb).toHaveBeenCalledWith(null, filePath);
        });
        
        test('creates the uploads directory if one does not exist', () => {
            const mockMkdirSyncSettings = { recursive: true }
            getProjectRoot.mockReturnValue(projectRoot);
            config.get.mockImplementation(key => mockConfig[key]);
            fs.existsSync.mockReturnValue(false);
            destination(req, file, cb);
    
            expect(fs.mkdirSync).toHaveBeenCalledWith(filePath, mockMkdirSyncSettings);
        });
    });

    describe('filename', () => {
        test('creates a unique file name for uploaded file', () => {
            const mockTimestamp = '1234';
            const mockUniqueFileName = `file_${mockTimestamp}.txt`
            
            vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            filename(req, file, cb);

            expect(cb).toHaveBeenCalledWith(null, mockUniqueFileName);
        });
    });
});

