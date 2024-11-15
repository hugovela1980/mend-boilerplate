const getFilesFromMultiPartFormData = (headers, fdBuffer) => {
    const files = [];

    // Get form-data boundary from request headers
    const boundary = `--${headers['content-type'].split('=')[1]}`
    const boundaryBuffer = Buffer.from(boundary);
    let end = fdBuffer.indexOf(boundaryBuffer, 0);
    let start = 0;
    const formDataChunks = [];

    // separate the form-data buffer into individual formDataChunks
    while (end !== -1) {
        formDataChunks.push(fdBuffer.subarray(start, end));
        start = end + boundaryBuffer.length;
        end = fdBuffer.indexOf(boundaryBuffer, start);
    }

    // extract file name and content from each form-data chunk
    formDataChunks.forEach(chunk => {
        const file = {};
        const headerEndIndex = chunk.indexOf('\r\n\r\n');
        // Check if it's the end of form-data chunk
        if (headerEndIndex === -1) return;

        const partHeaders = chunk.subarray(0, headerEndIndex).toString();

        // Check if form-data chunk is the file
        if (!partHeaders.includes('filename=')) return;

        file.name = partHeaders.match(/filename="(.+)"/)[1];
        file.content = chunk.subarray(headerEndIndex + 4, chunk.length - 2);
        files.push(file);
    });

    return files;
};

export default getFilesFromMultiPartFormData;