document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const fetchButton = document.getElementById('fetchButton');
    const dogImage = document.getElementById('dogImage');
    const loading = document.getElementById('loading');
    const credit = document.getElementById('credit');
    const downloadBtn = document.getElementById('downloadBtn');
    const breedSelect = document.getElementById('breedSelect');

    // 画像をダウンロードする関数
    async function downloadImage() {
        try {
            const response = await fetch(dogImage.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'premium-dog-photo.jpg';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('ダウンロードに失敗しました:', error);
            showError('画像のダウンロードに失敗しました。');
        }
    }

    // エラーメッセージを表示する関数
    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a1a;
            color: #ff4444;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            border: 1px solid #ff4444;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease-out;
            z-index: 1000;
        `;
        errorMessage.textContent = message;
        document.body.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => errorMessage.remove(), 300);
        }, 3000);
    }

    // 画像を取得する関数
    async function fetchDogImage() {
        try {
            // ボタンを無効化し、ローディング表示
            fetchButton.disabled = true;
            loading.style.display = 'block';
            dogImage.classList.remove('loaded');
            downloadBtn.style.display = 'none';
            credit.innerHTML = '';

            // 選択された犬種を取得
            const selectedBreed = breedSelect.value;
            const query = selectedBreed ? `dog ${selectedBreed}` : 'dog';

            // バックエンドAPIから画像を取得
            const response = await fetch(`/api/photos?breed=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('画像の取得に失敗しました');
            }

            const data = await response.json();
            
            // 画像のURLを設定
            dogImage.src = data.urls.regular;
            
            // 写真家の情報を更新
            credit.innerHTML = `
                Photo by <a href="${data.user.links.html}?utm_source=dog_image_app&utm_medium=referral" 
                target="_blank" rel="noopener noreferrer">${data.user.name}</a> on 
                <a href="https://unsplash.com?utm_source=dog_image_app&utm_medium=referral" 
                target="_blank" rel="noopener noreferrer">Unsplash</a>
            `;

            // 画像の読み込み完了時の処理
            dogImage.onload = function() {
                loading.style.display = 'none';
                dogImage.classList.add('loaded');
                downloadBtn.style.display = 'flex';
                fetchButton.disabled = false;
            };

        } catch (error) {
            console.error('エラーが発生しました:', error);
            loading.style.display = 'none';
            fetchButton.disabled = false;
            
            let errorMessage = '予期せぬエラーが発生しました。';
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'API認証に失敗しました。';
                        break;
                    case 403:
                        errorMessage = 'アクセスが拒否されました。';
                        break;
                    case 429:
                        errorMessage = '1時間あたりのリクエスト制限を超えました。しばらく待ってから再度お試しください。';
                        break;
                    case 500:
                        errorMessage = 'サーバーエラーが発生しました。しばらく待ってから再度お試しください。';
                        break;
                }
            }
            showError(errorMessage);
        }
    }

    // ページ読み込み時に最初の画像を取得
    fetchDogImage();

    // ボタンクリック時のイベントリスナー
    fetchButton.addEventListener('click', fetchDogImage);
    downloadBtn.addEventListener('click', downloadImage);

    // 犬種選択時に自動で画像を更新
    breedSelect.addEventListener('change', fetchDogImage);

    // キーボードショートカット
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !fetchButton.disabled) {
            e.preventDefault();
            fetchDogImage();
        }
    });
});