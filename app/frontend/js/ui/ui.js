import { getFileNames } from '../api/api.js';
import { handlePreviewBtnClick, handleDeleteBtnClick } from '../handlers/handlers.js'

const mainContentEl = document.getElementById('main_content');

export const loadFiles = async () => {
    const filenames = await getFileNames();
    updateFileList(filenames);
};

export const updateFileList = async (listData) => {
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
};

export const openModal = (modal) => {
    modal.classList.add('show');
};

export const closeModal = (modal) => {
    modal.classList.remove('show');
};