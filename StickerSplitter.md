<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sticker Splitter - シール一括切り出しツール</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- JSZip for zipping files -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <!-- Encoding.js for Japanese filename compatibility in ZIP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/encoding-japanese/2.0.0/encoding.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .checkerboard {
            background-color: #f0f0f0;
            background-image:
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .drag-active {
            border-color: #3b82f6;
            background-color: #eff6ff;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen text-gray-800 font-sans">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 class="text-xl font-bold text-indigo-600 flex items-center gap-2">
                <i class="fa-solid fa-scissors"></i> Sticker Splitter
            </h1>
            <div class="text-sm text-gray-500 hidden sm:block">背景透過画像の各パーツを自動で切り出します</div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
        
        <!-- Controls & Upload Area -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            <!-- Left Panel: Upload & Settings -->
            <div class="lg:col-span-1 space-y-6">
                
                <!-- Upload Box -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h2 class="font-semibold mb-4 text-gray-700">1. 画像をアップロード</h2>
                    <div id="drop-zone" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                        <input type="file" id="file-input" class="hidden" accept="image/png, image/webp, image/gif">
                        <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                        <p class="text-gray-600 font-medium">クリック または ドラッグ＆ドロップ</p>
                        <p class="text-xs text-gray-400 mt-2">背景が透過されたPNG/WEBPを推奨</p>
                    </div>
                </div>

                <!-- Settings -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h2 class="font-semibold mb-4 text-gray-700">2. 設定</h2>
                    
                    <div class="space-y-5">
                        <!-- Filename Input -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">ファイル名の接頭辞</label>
                            <div class="relative">
                                <input type="text" id="filename-input" value="sticker" class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="例: ポフン">
                                <i class="fa-solid fa-tag absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                            </div>
                            <p class="text-xs text-gray-400 mt-1">出力例: <span id="filename-preview">sticker_1.png</span></p>
                        </div>

                        <hr class="border-gray-100">

                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">パディング (余白 px)</label>
                            <!-- Default value set to 0 -->
                            <input type="range" id="padding-slider" min="0" max="50" value="0" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>0px</span>
                                <span id="padding-value">0px</span>
                                <span>50px</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">
                                感度 (アルファしきい値)
                                <span class="group relative inline-block ml-1">
                                    <i class="fa-regular fa-circle-question text-gray-400 cursor-help"></i>
                                    <span class="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap mb-1">高いほど薄い色も検出します</span>
                                </span>
                            </label>
                            <input type="range" id="threshold-slider" min="1" max="254" value="10" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>高感度</span>
                                <span id="threshold-value">10</span>
                                <span>低感度</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">最小サイズ (px)</label>
                            <input type="number" id="min-size-input" value="20" class="w-full p-2 border border-gray-300 rounded text-sm" placeholder="ゴミ除去用">
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button id="process-btn" disabled class="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95 flex justify-center items-center gap-2">
                    <i class="fa-solid fa-play"></i>
                    <span>切り出し実行</span>
                </button>
            </div>

            <!-- Right Panel: Preview & Results -->
            <div class="lg:col-span-2 space-y-6">
                
                <!-- Main Preview (Original Image) -->
                <div class="bg-white p-6 rounded-xl shadow-sm hidden" id="preview-container">
                    <h2 class="font-semibold mb-4 text-gray-700">プレビュー</h2>
                    <div class="checkerboard rounded-lg overflow-hidden border border-gray-200 flex justify-center items-center p-4">
                        <img id="source-image" class="max-w-full max-h-[400px] object-contain" src="" alt="Source">
                    </div>
                </div>

                <!-- Results Grid -->
                <div id="results-area" class="bg-white p-6 rounded-xl shadow-sm hidden">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 class="font-semibold text-gray-700 flex items-center gap-2">
                            検出結果 <span id="count-badge" class="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">0個</span>
                        </h2>
                        
                        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <!-- Folder Download Button (Chrome/Edge Only) -->
                            <button id="download-folder-btn" class="hidden text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                                <i class="fa-solid fa-folder-open"></i> フォルダに保存
                            </button>

                            <!-- ZIP Download Button (Fallback) -->
                            <button id="download-zip-btn" class="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                                <i class="fa-solid fa-file-zipper"></i> ZIPでダウンロード
                            </button>
                        </div>
                    </div>
                    
                    <div id="output-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <!-- Generated items will go here -->
                    </div>
                </div>
                
                <!-- Loading State -->
                <div id="loading-indicator" class="hidden flex flex-col items-center justify-center p-12 text-gray-500">
                    <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-3 text-indigo-500"></i>
                    <p>画像を解析中...</p>
                    <p class="text-xs mt-1">大きな画像は時間がかかる場合があります</p>
                </div>

            </div>
        </div>
    </main>

    <!-- Hidden Canvas for processing -->
    <canvas id="process-canvas" class="hidden"></canvas>

    <script>
        // DOM Elements
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const processBtn = document.getElementById('process-btn');
        const sourceImage = document.getElementById('source-image');
        const previewContainer = document.getElementById('preview-container');
        const resultsArea = document.getElementById('results-area');
        const outputGrid = document.getElementById('output-grid');
        const loadingIndicator = document.getElementById('loading-indicator');
        const countBadge = document.getElementById('count-badge');
        const downloadZipBtn = document.getElementById('download-zip-btn');
        const downloadFolderBtn = document.getElementById('download-folder-btn');
        const paddingSlider = document.getElementById('padding-slider');
        const paddingValue = document.getElementById('padding-value');
        const thresholdSlider = document.getElementById('threshold-slider');
        const thresholdValue = document.getElementById('threshold-value');
        const minSizeInput = document.getElementById('min-size-input');
        const filenameInput = document.getElementById('filename-input');
        const filenamePreview = document.getElementById('filename-preview');
        
        let originalFile = null;
        let generatedBlobs = []; // Stores {blob, filename}

        // --- Init Check ---
        // Check if File System Access API is supported (for Folder saving)
        if ('showDirectoryPicker' in window) {
            downloadFolderBtn.classList.remove('hidden');
            // If supported, maybe style ZIP button as secondary? 
            // keeping both prominent for now as fallback is important.
        }

        // --- Event Listeners ---

        // Drag & Drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-active');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-active');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');
            if (e.dataTransfer.files.length) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFile(e.target.files[0]);
            }
        });

        // Sliders & Inputs
        paddingSlider.addEventListener('input', (e) => paddingValue.textContent = `${e.target.value}px`);
        thresholdSlider.addEventListener('input', (e) => thresholdValue.textContent = e.target.value);
        
        // Update filename preview on input
        filenameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim() || 'sticker';
            filenamePreview.textContent = `${val}_1.png`;
        });

        // Process Button
        processBtn.addEventListener('click', processImage);

        // Download Buttons
        downloadZipBtn.addEventListener('click', downloadAsZip);
        downloadFolderBtn.addEventListener('click', saveToFolder);


        // --- Functions ---

        function handleFile(file) {
            if (!file.type.startsWith('image/')) {
                alert('画像ファイルを選択してください');
                return;
            }

            originalFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                sourceImage.src = e.target.result;
                previewContainer.classList.remove('hidden');
                resultsArea.classList.add('hidden');
                processBtn.disabled = false;
                
                // Clear previous results
                outputGrid.innerHTML = '';
                generatedBlobs = [];
            };
            reader.readAsDataURL(file);
        }

        async function processImage() {
            if (!sourceImage.src) return;

            // UI State
            processBtn.disabled = true;
            loadingIndicator.classList.remove('hidden');
            resultsArea.classList.add('hidden');
            outputGrid.innerHTML = '';
            generatedBlobs = [];

            // Allow UI to update before heavy processing
            setTimeout(async () => {
                try {
                    await detectAndSplit();
                } catch (error) {
                    console.error(error);
                    alert('処理中にエラーが発生しました。');
                } finally {
                    loadingIndicator.classList.add('hidden');
                    processBtn.disabled = false;
                }
            }, 100);
        }

        function detectAndSplit() {
            return new Promise((resolve) => {
                const canvas = document.getElementById('process-canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                
                // Set canvas size to image size
                canvas.width = sourceImage.naturalWidth;
                canvas.height = sourceImage.naturalHeight;
                ctx.drawImage(sourceImage, 0, 0);

                const width = canvas.width;
                const height = canvas.height;
                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;

                // Settings
                const threshold = parseInt(thresholdSlider.value);
                const padding = parseInt(paddingSlider.value);
                const minSize = parseInt(minSizeInput.value) || 10;
                
                // Filename base
                const baseName = filenameInput.value.trim() || 'sticker';

                // 2D Array to track visited pixels
                const visited = new Uint8Array(width * height); // 0 = unvisited, 1 = visited

                const boxes = [];

                // Helper to get index
                const getIdx = (x, y) => (y * width + x) * 4;

                // Iterate through all pixels
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const idx = getIdx(x, y);
                        const alpha = data[idx + 3];

                        // If pixel is opaque enough and not visited
                        if (alpha >= threshold && visited[y * width + x] === 0) {
                            // Found a new island!
                            const box = floodFill(x, y, width, height, data, visited, threshold);
                            
                            // Check if box is big enough (filter noise)
                            if (box.w >= minSize && box.h >= minSize) {
                                boxes.push(box);
                            }
                        }
                    }
                }

                // Render Results
                displayResults(boxes, ctx, padding, baseName);
                resolve();
            });
        }

        // Iterative Flood Fill (Stack-based) to avoid recursion limits
        function floodFill(startX, startY, width, height, data, visited, threshold) {
            let minX = startX, maxX = startX;
            let minY = startY, maxY = startY;

            const stack = [startX, startY];
            visited[startY * width + startX] = 1;

            while (stack.length > 0) {
                const y = stack.pop();
                const x = stack.pop();

                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;

                // Check 4 neighbors
                // dx, dy
                const neighbors = [
                    [0, -1], [0, 1], [-1, 0], [1, 0] 
                ];

                for (let i = 0; i < neighbors.length; i++) {
                    const nx = x + neighbors[i][0];
                    const ny = y + neighbors[i][1];

                    // Bounds check
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const vIdx = ny * width + nx;
                        if (visited[vIdx] === 0) {
                            const pIdx = (ny * width + nx) * 4;
                            if (data[pIdx + 3] >= threshold) {
                                visited[vIdx] = 1;
                                stack.push(nx, ny);
                            }
                        }
                    }
                }
            }

            return {
                x: minX,
                y: minY,
                w: maxX - minX + 1,
                h: maxY - minY + 1
            };
        }

        async function displayResults(boxes, sourceCtx, padding, baseName) {
            countBadge.innerText = `${boxes.length}個`;
            resultsArea.classList.remove('hidden');

            if (boxes.length === 0) {
                outputGrid.innerHTML = '<p class="col-span-full text-center text-gray-500">シールが見つかりませんでした。<br>感度を調整するか、画像の透過状態を確認してください。</p>';
                return;
            }

            // Process each box
            for (let i = 0; i < boxes.length; i++) {
                const box = boxes[i];
                
                // Create individual canvas
                const c = document.createElement('canvas');
                c.width = box.w + (padding * 2);
                c.height = box.h + (padding * 2);
                const ctx = c.getContext('2d');

                // Draw specific region from source
                // drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh)
                ctx.drawImage(
                    sourceCtx.canvas, 
                    box.x, box.y, box.w, box.h, 
                    padding, padding, box.w, box.h
                );

                // Convert to Blob for display and download
                const blob = await new Promise(r => c.toBlob(r, 'image/png'));
                const url = URL.createObjectURL(blob);
                
                // Naming logic: baseName_1.png, baseName_2.png, etc.
                const filename = `${baseName}_${i + 1}.png`;

                generatedBlobs.push({ blob, filename });

                // Create Card UI
                const card = document.createElement('div');
                card.className = "bg-white border rounded-lg p-2 flex flex-col items-center gap-2 hover:shadow-md transition-shadow";
                card.innerHTML = `
                    <div class="w-full h-32 checkerboard rounded flex items-center justify-center overflow-hidden">
                        <img src="${url}" class="max-w-full max-h-full object-contain">
                    </div>
                    <div class="flex justify-between items-center w-full px-1">
                        <span class="text-xs text-gray-500 font-mono truncate max-w-[100px]" title="${filename}">${filename}</span>
                        <a href="${url}" download="${filename}" class="text-indigo-600 hover:text-indigo-800 text-sm" title="保存">
                            <i class="fa-solid fa-download"></i>
                        </a>
                    </div>
                `;
                outputGrid.appendChild(card);
            }
        }

        // --- Save to Folder (FileSystem Access API) ---
        async function saveToFolder() {
            if (generatedBlobs.length === 0) return;
            
            try {
                downloadFolderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 保存中...';
                downloadFolderBtn.disabled = true;

                // 1. ユーザーに保存先ディレクトリを選択させる
                const dirHandle = await window.showDirectoryPicker();
                
                // 2. 接頭辞（例: ポフン）のフォルダを作成
                const baseName = filenameInput.value.trim() || 'sticker';
                // create: true で存在しなければ作成、存在すればそのまま取得
                const targetDirHandle = await dirHandle.getDirectoryHandle(baseName, { create: true });

                // 3. 各ファイルを保存
                for (const item of generatedBlobs) {
                    // ファイルハンドルの作成
                    const fileHandle = await targetDirHandle.getFileHandle(item.filename, { create: true });
                    // 書き込み可能なストリームを作成
                    const writable = await fileHandle.createWritable();
                    // 書き込み
                    await writable.write(item.blob);
                    // 閉じる
                    await writable.close();
                }

                alert(`「${baseName}」フォルダに ${generatedBlobs.length}個の画像を保存しました！`);

            } catch (error) {
                if (error.name === 'AbortError') {
                    // キャンセルされた場合は何もしない
                    console.log('Folder selection cancelled');
                } else {
                    console.error('Save to folder failed:', error);
                    alert('保存に失敗しました。ブラウザが対応していないか、アクセスが許可されませんでした。\nZIPダウンロードをご利用ください。');
                }
            } finally {
                downloadFolderBtn.innerHTML = '<i class="fa-solid fa-folder-open"></i> フォルダに保存';
                downloadFolderBtn.disabled = false;
            }
        }

        function downloadAsZip() {
            if (generatedBlobs.length === 0) return;

            const baseName = filenameInput.value.trim() || 'sticker';
            const zip = new JSZip();
            
            generatedBlobs.forEach(item => {
                zip.file(item.filename, item.blob);
            });

            downloadZipBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 作成中...';
            downloadZipBtn.disabled = true;

            // Options for ZIP generation
            const options = {
                type: "blob",
                // 文字化け対策: encoding.js を使ってファイル名をShift_JISのバイト列に変換する
                encodeFileName: function (filename) {
                    try {
                        if (typeof Encoding === 'undefined') {
                            throw new Error("Encoding.js not loaded");
                        }
                        const unicodeData = Encoding.stringToCode(filename);
                        const sjisData = Encoding.convert(unicodeData, {
                            to: 'SJIS',
                            from: 'UNICODE'
                        });
                        return new Uint8Array(sjisData);
                    } catch (e) {
                        return new TextEncoder().encode(filename);
                    }
                }
            };

            zip.generateAsync(options)
            .then(function(content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${baseName}.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                downloadZipBtn.innerHTML = '<i class="fa-solid fa-file-zipper"></i> ZIPでダウンロード';
                downloadZipBtn.disabled = false;
            });
        }
    </script>
</body>
</html>