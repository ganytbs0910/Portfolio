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

    // JPEG compression
    const imageInput = document.getElementById('image-input');
    const compressButton = document.getElementById('compress-button');
    const originalSizeSpan = document.getElementById('original-size');
    const compressedSizeSpan = document.getElementById('compressed-size');
    const downloadLink = document.getElementById('download-link');

    compressButton.addEventListener('click', async function () {
        const file = imageInput.files[0];
        if (!file) {
            alert('画像を選択してください。');
            return;
        }

        originalSizeSpan.textContent = `${(file.size / 1024).toFixed(2)} KB`;

        const compressedImage = await compressImage(file);
        compressedSizeSpan.textContent = `${(compressedImage.size / 1024).toFixed(2)} KB`;

        const url = URL.createObjectURL(compressedImage);
        downloadLink.href = url;
        downloadLink.download = 'compressed_' + file.name;
        downloadLink.style.display = 'inline';
    });

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

    // WebP to PNG conversion
    const webpInput = document.getElementById('webp-input');
    const convertButton = document.getElementById('convert-button');
    const webpOriginalSizeSpan = document.getElementById('webp-original-size');
    const pngSizeSpan = document.getElementById('png-size');
    const pngDownloadLink = document.getElementById('png-download-link');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');

    convertButton.addEventListener('click', async function() {
        const file = webpInput.files[0];
        if (!file) {
            alert('WebP画像を選択してください。');
            return;
        }

        if (!file.type.includes('webp')) {
            alert('WebP形式の画像を選択してください。');
            return;
        }

        webpOriginalSizeSpan.textContent = `${(file.size / 1024).toFixed(2)} KB`;

        try {
            const convertedImage = await convertWebPtoPNG(file);
            pngSizeSpan.textContent = `${(convertedImage.size / 1024).toFixed(2)} KB`;

            const url = URL.createObjectURL(convertedImage);
            pngDownloadLink.href = url;
            pngDownloadLink.download = file.name.replace('.webp', '.png');
            pngDownloadLink.style.display = 'inline';

            // プレビューを表示
            previewImage.src = url;
            previewContainer.style.display = 'block';
        } catch (error) {
            console.error('変換エラー:', error);
            alert('画像の変換中にエラーが発生しました。');
        }
    });

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