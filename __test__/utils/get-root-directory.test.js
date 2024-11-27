import fs from 'fs';
import path from 'path';
// import config from 'config';
import getProjectRoot from '../../utils/get-project-root.js';

// Mock fs and config
vi.mock('fs', () => ({ 
    default: { existsSync: vi.fn() }
}));
// vi.mock('config', () => ({
//     default: {
//         get: vi.fn((key) => {
//             const mockConfig = {
//                 'app.projectRoot': './mock-project-root',
//             };
//             return mockConfig[key] || null;
//         }),
//         has: vi.fn((key) => key === 'app.projectRoot')
//     },
// }));

describe('getProjectRoot', () => {
    test('returns the current directory if it contains package.json', () => {
        // Arrange
        const startDir = '.';

        fs.existsSync.mockReturnValueOnce(true);

        // Act
        const result = getProjectRoot(startDir);

        // Assert
        expect(result).toBe(process.cwd());
    });

    test('traverses up the directory tree to find package.json', () => {
        // Arrange
        const startDir = './subdir';
        fs.existsSync.mockReturnValueOnce(false);
        fs.existsSync.mockReturnValueOnce(true);

        // Act
        const result = getProjectRoot(startDir);

        // Assert
        expect(result).toBe(process.cwd());
    });

    test('throws an error if package.json is not found in any directory', () => {
        // Arrange
        const startDir = './mock-project-root/subdir';
        fs.existsSync.mockReturnValue(false);

        // Act and Assert
        expect(() => getProjectRoot(startDir)).toThrow('Project root directory not found');
    });

});
