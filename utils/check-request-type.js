const requestType = (req) => {
    if (req.url === '/log' && req.method === 'POST') return 'logging';
    else if (req.url === '/upload' && req.method === 'POST') return 'upload';
    else if (req.url === '/filenames' && req.method === 'GET') return 'file names';
    else if (req.method === 'GET') return 'static files';
};

export default requestType;