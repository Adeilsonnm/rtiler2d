document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('tileset-input');
    const filesContainer = document.getElementById('files-container');
    const convertBtn = document.getElementById('convert-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const clearAllBtn = document.getElementById('clearAll');
    const currentYear = document.getElementById('current-year');

    let uploadedFiles = [];

    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    fileInput.addEventListener('change', handleFileInput);

    function handleDragOver(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = '#f0f0f0';
    }

    function handleDragLeave() {
        uploadArea.style.backgroundColor = '#f9f9f9';
    }

    function handleDrop(e) {
        e.preventDefault();
        uploadArea.style.backgroundColor = '#f9f9f9';
        handleFiles(e.dataTransfer.files);
    }

    function handleFileInput(e) {
        handleFiles(e.target.files);
    }

    function handleFiles(newFiles) {
        Array.from(newFiles).forEach(file => {
            if (file.type === 'image/png') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const fileData = {
                            name: file.name,
                            data: e.target.result,
                            width: img.width,
                            height: img.height,
                            resizedImage: null
                        };
                        uploadedFiles.push(fileData);
                        addFileToList(fileData);
                        updateConvertButton();
                        adjustImageSizes();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Por favor, envie apenas arquivos PNG.');
            }
        });
    }

    function addFileToList(fileData) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-preview">
                <img src="${fileData.data}" alt="${fileData.name}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="file-name">${fileData.name}</div>
            <div class="file-info">${fileData.width}x${fileData.height}px</div>
            <div class="file-actions">
                <button onclick="window.resizeIndividual('${fileData.name}')" class="resize-btn">
                    <i class="fas fa-sync"></i> Redimensionar
                </button>
                <button onclick="window.downloadImage('${fileData.name}')" class="download-btn" ${!fileData.resizedImage ? 'disabled' : ''}>
                    <i class="fas fa-download"></i> Baixar
                </button>
                <button onclick="window.removeFile('${fileData.name}')" class="remove-btn">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `;
        filesContainer.appendChild(fileItem);
    }

    function handleConvert() {
        if (uploadedFiles.length === 0) {
            alert('Por favor, faça upload de pelo menos uma imagem.');
            return;
        }

        const tileWidth = parseInt(document.getElementById('tile-width').value);
        const tileHeight = parseInt(document.getElementById('tile-height').value);
        const newTileWidth = parseInt(document.getElementById('new-tile-width').value);
        const newTileHeight = parseInt(document.getElementById('new-tile-height').value);

        if (isNaN(tileWidth) || isNaN(tileHeight) || isNaN(newTileWidth) || isNaN(newTileHeight)) {
            alert('Por favor, insira valores válidos para as dimensões.');
            return;
        }

        // Redimensionar todas as imagens
        uploadedFiles.forEach(file => {
            resizeTileset(file, tileWidth, tileHeight, newTileWidth, newTileHeight);
        });
    }

    function resizeTileset(file, tileWidth, tileHeight, newTileWidth, newTileHeight) {
        const img = new Image();
        img.onload = function() {
            const tilesX = Math.floor(img.width / tileWidth);
            const tilesY = Math.floor(img.height / tileHeight);
            const newWidth = tilesX * newTileWidth;
            const newHeight = tilesY * newTileHeight;

            // Criar um canvas temporário para a imagem redimensionada
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            const ctx = tempCanvas.getContext('2d');

            for (let y = 0; y < tilesY; y++) {
                for (let x = 0; x < tilesX; x++) {
                    ctx.drawImage(
                        img,
                        x * tileWidth,
                        y * tileHeight,
                        tileWidth,
                        tileHeight,
                        x * newTileWidth,
                        y * newTileHeight,
                        newTileWidth,
                        newTileHeight
                    );
                }
            }

            // Salvar a imagem redimensionada no objeto do arquivo
            file.resizedImage = tempCanvas.toDataURL('image/png');
            updateDownloadButtons();
        };
        img.src = file.data;
    }

    window.downloadImage = function(fileName) {
        const file = uploadedFiles.find(f => f.name === fileName);
        if (file && file.resizedImage) {
            const link = document.createElement('a');
            link.href = file.resizedImage;
            link.download = fileName.replace('.png', '_resized.png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    function handleDownloadAll() {
        if (uploadedFiles.length === 0) {
            alert('Não há arquivos para baixar.');
            return;
        }

        // Verificar se todas as imagens foram redimensionadas
        const notResized = uploadedFiles.filter(file => !file.resizedImage);
        if (notResized.length > 0) {
            alert('Por favor, redimensione as imagens antes de baixar.');
            return;
        }

        if (uploadedFiles.length > 5) {
            downloadAsZip();
        } else {
            uploadedFiles.forEach(file => {
                window.downloadImage(file.name);
            });
        }
    }

    async function downloadAsZip() {
        const zip = new JSZip();
        const folder = zip.folder('resized_tilesets');

        uploadedFiles.forEach(file => {
            if (file.resizedImage) {
                const base64Data = file.resizedImage.split(',')[1];
                folder.file(`resized_${file.name}`, base64Data, { base64: true });
            }
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `tilesets_${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    window.removeFile = function(fileName) {
        uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            const nameElement = item.querySelector('.file-name');
            if (nameElement && nameElement.textContent === fileName) {
                item.remove();
            }
        });
        updateConvertButton();
        updateDownloadButtons();
    };

    function clearAllFiles() {
        filesContainer.innerHTML = '';
        uploadedFiles = [];
        fileInput.value = '';
        updateConvertButton();
    }

    function updateConvertButton() {
        convertBtn.disabled = uploadedFiles.length === 0;
        downloadAllBtn.disabled = uploadedFiles.length === 0;
    }

    function updateDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-btn');
        downloadButtons.forEach(button => {
            const fileName = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            const file = uploadedFiles.find(f => f.name === fileName);
            button.disabled = !file || !file.resizedImage;
        });

        // Atualizar o botão de baixar todos
        const allResized = uploadedFiles.every(file => file.resizedImage);
        downloadAllBtn.disabled = uploadedFiles.length === 0 || !allResized;
    }

    function adjustImageSizes() {
        const fileItems = document.querySelectorAll('.file-item');
        if (fileItems.length <= 1) return;

        let maxWidth = 0;
        let maxHeight = 0;

        fileItems.forEach(item => {
            const img = item.querySelector('.file-preview img');
            if (img) {
                maxWidth = Math.max(maxWidth, img.naturalWidth);
                maxHeight = Math.max(maxHeight, img.naturalHeight);
            }
        });

        fileItems.forEach(item => {
            const img = item.querySelector('.file-preview img');
            if (img) {
                img.style.width = `${maxWidth}px`;
                img.style.height = `${maxHeight}px`;
                img.style.objectFit = 'contain';
            }
        });
    }

    window.resizeIndividual = function(fileName) {
        const file = uploadedFiles.find(f => f.name === fileName);
        if (!file) return;

        const tileWidth = parseInt(document.getElementById('tile-width').value);
        const tileHeight = parseInt(document.getElementById('tile-height').value);
        const newTileWidth = parseInt(document.getElementById('new-tile-width').value);
        const newTileHeight = parseInt(document.getElementById('new-tile-height').value);

        if (isNaN(tileWidth) || isNaN(tileHeight) || isNaN(newTileWidth) || isNaN(newTileHeight)) {
            alert('Por favor, insira valores válidos para as dimensões.');
            return;
        }

        if (tileWidth <= 0 || tileHeight <= 0 || newTileWidth <= 0 || newTileHeight <= 0) {
            alert('As dimensões devem ser maiores que zero.');
            return;
        }

        resizeTileset(file, tileWidth, tileHeight, newTileWidth, newTileHeight);
    };

    // Adicionar evento de clique ao botão de converter
    convertBtn.addEventListener('click', handleConvert);

    // Adicionar evento de clique ao botão de baixar todos
    downloadAllBtn.addEventListener('click', handleDownloadAll);

    // Adicionar o botão de limpar no HTML
    const buttonsContainer = document.querySelector('.buttons');
    const clearButton = document.createElement('button');
    clearButton.id = 'clearAll';
    clearButton.innerHTML = '<i class="fas fa-trash"></i> Limpar Tudo';
    clearButton.onclick = clearAllFiles;
    buttonsContainer.appendChild(clearButton);
}); 