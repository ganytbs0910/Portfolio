document.addEventListener('DOMContentLoaded', function () {
    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;

        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                this.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('エラーが発生しました。もう一度お試しください。');
            });
    });

    // JPEG圧縮の処理
    const imageInput = document.getElementById('image-input');
    const compressButton = document.getElementById('compress-button');
    const compressionResults = document.getElementById('compression-results');

    compressButton.addEventListener('click', async function () {
        const files = imageInput.files;
        if (files.length === 0) {
            alert('画像を選択してください。');
            return;
        }

        compressionResults.innerHTML = '';
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-container';
        compressionResults.appendChild(resultsContainer);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
                continue;
            }

            const resultDiv = document.createElement('div');
            resultDiv.className = 'image-result';
            resultsContainer.appendChild(resultDiv);

            // プログレスバーの作成
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progress = document.createElement('div');
            progress.className = 'progress';
            progressBar.appendChild(progress);
            resultDiv.appendChild(progressBar);

            // ファイル名の表示
            const fileName = document.createElement('p');
            fileName.textContent = `ファイル: ${file.name}`;
            resultDiv.appendChild(fileName);

            // 元のサイズを表示
            const originalSize = document.createElement('p');
            originalSize.textContent = `元のサイズ: ${(file.size / 1024).toFixed(2)} KB`;
            resultDiv.appendChild(originalSize);

            try {
                // 圧縮処理
                progress.style.width = '50%';
                const compressedImage = await compressImage(file);
                progress.style.width = '100%';

                // 圧縮後のサイズを表示
                const compressedSize = document.createElement('p');
                compressedSize.textContent = `圧縮後のサイズ: ${(compressedImage.size / 1024).toFixed(2)} KB`;
                resultDiv.appendChild(compressedSize);

                // プレビュー画像の表示
                const preview = document.createElement('img');
                preview.className = 'image-preview';
                preview.src = URL.createObjectURL(compressedImage);
                resultDiv.appendChild(preview);

                // ダウンロードリンク
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(compressedImage);
                downloadLink.download = 'compressed_' + file.name;
                downloadLink.className = 'download-link';
                downloadLink.textContent = 'ダウンロード';
                resultDiv.appendChild(downloadLink);

            } catch (error) {
                resultDiv.innerHTML += `<p style="color: red;">エラー: ${file.name} の処理に失敗しました。</p>`;
            }
        }
    });

    // 圧縮関数
    async function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 圧縮後の最大幅/高さ
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.7); // 品質を0.7に設定
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // WebP変換の処理
    const webpInput = document.getElementById('webp-input');
    const convertButton = document.getElementById('convert-button');
    const conversionResults = document.getElementById('conversion-results');

    convertButton.addEventListener('click', async function () {
        const files = webpInput.files;
        if (files.length === 0) {
            alert('WebP画像を選択してください。');
            return;
        }

        conversionResults.innerHTML = '';
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-container';
        conversionResults.appendChild(resultsContainer);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.includes('webp')) {
                continue;
            }

            const resultDiv = document.createElement('div');
            resultDiv.className = 'image-result';
            resultsContainer.appendChild(resultDiv);

            // プログレスバーの作成
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progress = document.createElement('div');
            progress.className = 'progress';
            progressBar.appendChild(progress);
            resultDiv.appendChild(progressBar);

            // ファイル名の表示
            const fileName = document.createElement('p');
            fileName.textContent = `ファイル: ${file.name}`;
            resultDiv.appendChild(fileName);

            // 元のサイズを表示
            const originalSize = document.createElement('p');
            originalSize.textContent = `元のサイズ: ${(file.size / 1024).toFixed(2)} KB`;
            resultDiv.appendChild(originalSize);

            try {
                // 変換処理
                progress.style.width = '50%';
                const convertedImage = await convertWebPtoPNG(file);
                progress.style.width = '100%';

                // 変換後のサイズを表示
                const convertedSize = document.createElement('p');
                convertedSize.textContent = `変換後のサイズ: ${(convertedImage.size / 1024).toFixed(2)} KB`;
                resultDiv.appendChild(convertedSize);

                // プレビュー画像の表示
                const preview = document.createElement('img');
                preview.className = 'image-preview';
                preview.src = URL.createObjectURL(convertedImage);
                resultDiv.appendChild(preview);

                // ダウンロードリンク
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(convertedImage);
                downloadLink.download = file.name.replace('.webp', '.png');
                downloadLink.className = 'download-link';
                downloadLink.textContent = 'ダウンロード';
                resultDiv.appendChild(downloadLink);

            } catch (error) {
                resultDiv.innerHTML += `<p style="color: red;">エラー: ${file.name} の処理に失敗しました。</p>`;
            }
        }
    });

    // WebPからPNGへの変換関数
    async function convertWebPtoPNG(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/png');
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
});