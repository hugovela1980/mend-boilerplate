import { getFileNames, uploadFiles, deleteFile, getFilePreview } from '../api/api.js';
import { loadFiles, openModal } from '../ui/ui.js'

const previewModal = document.getElementById('previewModal');
const modalFileName = document.getElementById('modalFileName');
const modalImg = document.getElementById('modalImg');

export const handleDeleteAllBtnClick = async (e) => {
    if (confirm(`Are you sure you want to delete all files?`)) {
        const files = await getFileNames();
        files.forEach(async file => {
            const { deletedFile, message } = await deleteFile(file);
            console.log(`${message}: ${deletedFile}`);
        });
        await loadFiles();
    };
};

export const handleUploadBtnClick = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    const upLoadedFilesData = await uploadFiles(files);
    upLoadedFilesData.forEach(({ uploadedFile, message }) => {
        console.log(`${message}: ${uploadedFile}`)
    });
    await loadFiles();
};

export const handleDeleteBtnClick = async (e) => {
    const fileName = e.currentTarget.dataset.id.replace('deleteBtn__', '');
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        const { deletedFile, message } = await deleteFile(fileName);
        await loadFiles();
        console.log(`${message}: ${deletedFile}`);
    } 
};

export const handlePreviewBtnClick = async (e) => {
    const fileName = e.currentTarget.dataset.id.replace('previewBtn__', '');
    const previewImage = await getFilePreview(fileName);
    
    const imageUrl = URL.createObjectURL(previewImage);
    modalFileName.innerText = fileName;
    modalImg.src = imageUrl;
    modalImg.onload = () => {
        URL.revokeObjectURL(imageUrl);
    }

    openModal(previewModal);
};
