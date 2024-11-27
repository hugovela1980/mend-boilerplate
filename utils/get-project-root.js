import fs from 'fs';
import path from 'path';

const getProjectRoot = (startDir) => {
    let currentDir = path.resolve(startDir);
    const systemRootDir = path.parse(currentDir).root
    
    while (true) {
        const targetPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(targetPath)) {
            return currentDir;
        }
        if (currentDir === systemRootDir) {
            break;
        }
        
        currentDir = path.dirname(currentDir);
    }

    throw new Error('Project root directory not found')
};

export default getProjectRoot;
