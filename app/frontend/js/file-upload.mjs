const mainContentEl = document.getElementById('main_content');
const imageModal = document.getElementById('imageModal');
const modalFileName = document.getElementById('modalFileName');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const deleteAllBtn = document.getElementById('deleteAll_btn');
const uploadBtn = document.getElementById('upload_btn');
const fileInput = document.getElementById('fileInput');
const homeBtn = document.getElementById('home_btn');

const url = `http://localhost:${window.location.port || 5000}`;

const init = async () => {
    const filenames = await getFileNames();
    
    updateFileList(filenames);
};

const getFileNames = async () => {
    const filenamesEndpoint = url + '/filenames';
    const reqUrl = new URL(filenamesEndpoint);
    const request = new Request(reqUrl, { method: 'GET' });
    
    const response = await fetch(request);
    const filenames = await response.json();

    return filenames;
};

const updateFileList = async (listData) => {
    mainContentEl.innerHTML = '';
    listData.forEach((file, i) => {
        const listItemEl = document.createElement('section');
        listItemEl.classList.add('content');
        mainContentEl.appendChild(listItemEl);
        
        const fileNameEl = document.createElement('div'); 
        fileNameEl.innerText = file;
        fileNameEl.classList.add('file-info');
        listItemEl.appendChild(fileNameEl);

        const buttonContainerEl = document.createElement('div');
        buttonContainerEl.classList.add('button-container');
        listItemEl.appendChild(buttonContainerEl);

        const previewBtn = document.createElement('div');
        previewBtn.classList.add('button');
        previewBtn.classList.add('preview-button');
        previewBtn.innerText = 'Preview';
        previewBtn.setAttribute('data-id', `previewBtn__${fileNameEl.innerText}`);
        previewBtn.removeEventListener('click', handlePreviewBtnClick);
        previewBtn.addEventListener('click', handlePreviewBtnClick);
        buttonContainerEl.appendChild(previewBtn);

        const deleteBtn = document.createElement('div');
        deleteBtn.classList.add('button');
        deleteBtn.classList.add('delete-button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.setAttribute('data-id', `deleteBtn__${fileNameEl.innerText}`);
        deleteBtn.removeEventListener('click', handleDeleteBtnClick);
        deleteBtn.addEventListener('click', handleDeleteBtnClick);
        buttonContainerEl.appendChild(deleteBtn);
    });
}
        
const handlePreviewBtnClick = (e) => {
    const fileName = e.currentTarget.dataset.id.replace('previewBtn__', '');
    previewFileFromServer(fileName);
}

const previewFileFromServer = async (fileName) => {
    const previewEndpoint = url + `/preview`;
    const reqUrl = new URL(previewEndpoint);
    reqUrl.searchParams.append('preview', 'true');
    reqUrl.searchParams.append('fileName', fileName);
    
    const request = new Request(reqUrl, { method: 'GET' });
    const response = await fetch(request);
    const blob = await response.blob();

    const imageUrl = URL.createObjectURL(blob);
    openModal(fileName, imageUrl);
    modalImage.onload = () => {
        URL.revokeObjectURL(imageUrl);
    }
}

const openModal = (fileName, imageUrl) => {
    modalFileName.innerText = fileName;
    modalImage.src = imageUrl;
    imageModal.classList.add('show');
}

const handleDeleteBtnClick = (e) => {
    const fileName = e.currentTarget.dataset.id.replace('deleteBtn__', '');
    if (confirm(`Are you sure you want to delete ${fileName}?`)) deleteFileFromServer(fileName);
}

const deleteFileFromServer = async (fileName) => {
    const deleteEndpoint = url + `/delete`;
    const reqUrl = new URL(deleteEndpoint);
    reqUrl.searchParams.append('delete', 'true');
    reqUrl.searchParams.append('fileName', fileName);
    const request = new Request(reqUrl, { method: 'DELETE' }); 

    const response = await fetch(request);
    const resData = await response.json();

    updateFileList(resData.fileList);
}

const handleDeleteAllBtnClick = async (e) => {
    if (confirm(`Are you sure you want to delete all files?`)) {
        const files = await getFileNames();
        files.forEach(file => {
            deleteFileFromServer(file);
        });
    };
}

const uploadFile2Server = async (e) => {
    e.preventDefault();

    const files = [];
    const fileList = e.target.files;
    for (let i = 0; i < fileList.length; i++) {
        files.push(fileList[i]);
    }
    
    // create any headers we want
    const h = new Headers();
    h.append('Accept', 'image/*'); // what we expect back
    // bundle the files and data we want to send to the server
    let fd = new FormData();
    files.forEach((file) => {
        fd.append(`files`, file, file.name);
    });
    
    const uploadEndpointPath = url + '/upload_files';
    const reqUrl = new URL(uploadEndpointPath);
    const request = new Request(reqUrl, {
        method: 'POST',
        headers: h,
        mode: 'no-cors',
        body: fd
    });

    const response = await fetch(request);
    let listData = await response.json();
    listData = [...new Set(listData)];

    updateFileList(listData);
}

document.addEventListener('DOMContentLoaded', init);
deleteAllBtn.addEventListener('click', handleDeleteAllBtnClick);
closeModal.addEventListener('click', (e) => imageModal.classList.remove('show'));
uploadBtn.addEventListener('click', (e) => fileInput.click());
fileInput.addEventListener('change', uploadFile2Server);
homeBtn.addEventListener('click', (e) => window.location.href = url);
