import { handleUploadBtnClick, handleDeleteAllBtnClick } from './handlers/handlers.js';
import { loadFiles, closeModal } from './ui/ui.js';

const apiUrl = `http://localhost:${window.location.port || 5000}`;

const fileInputEl = document.getElementById('fileInput');
const uploadBtn = document.getElementById('upload_btn');
const previewModal = document.getElementById('previewModal');
const closeModalIcon = document.getElementById('closeModalIcon');
const deleteAllBtn = document.getElementById('deleteAll_btn');
const homeBtn = document.getElementById('home_btn');

document.addEventListener('DOMContentLoaded', loadFiles);
fileInputEl.addEventListener('change', handleUploadBtnClick);
uploadBtn.addEventListener('click', (e) => fileInputEl.click());
deleteAllBtn.addEventListener('click', handleDeleteAllBtnClick);
closeModalIcon.addEventListener('click', (e) => closeModal(previewModal));
homeBtn.addEventListener('click', (e) => window.location.href = apiUrl);
