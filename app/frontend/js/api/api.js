const apiUrl = `http://localhost:${window.location.port || 5000}`;

export const uploadFiles = async (files) => {
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
    }
    fileInput.value = '';
    
    const uploadEndpointPath = apiUrl + '/upload_files';
    try {
        const response = await fetch(uploadEndpointPath, {
            method: 'POST',
            body: formData
        });

        return await response.json();
    } catch (err) {
        console.log('Error uploading files', err);
    }
};

export const deleteFile = async (fileName) => {
    const deleteEndpoint = new URL(apiUrl + `/delete`);
    deleteEndpoint.searchParams.append('delete', 'true');
    deleteEndpoint.searchParams.append('fileName', fileName);

    const response = await fetch(deleteEndpoint, { method: 'DELETE' });
    return await response.json();
};

export const getFileNames = async () => {
    const getFilenamesEndpoint = apiUrl + '/filenames';
    
    try {
        const response = await fetch(getFilenamesEndpoint);
        return await response.json();
    } catch (err) {
        console.log('There was a problem fetching files: ', err);
        return [];
    }
};

export const getFilePreview = async (fileName) => {
    const previewEndpoint = new URL(apiUrl + `/preview`);
    previewEndpoint.searchParams.append('preview', 'true');
    previewEndpoint.searchParams.append('fileName', fileName);
    
    const response = await fetch(previewEndpoint, { method: 'GET' });
    return await response.blob();
};
