document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const fetchButton = document.getElementById('fetchButton');
    const dogImage = document.getElementById('dogImage');
    const loading = document.getElementById('loading');
    const credit = document.getElementById('credit');

    // ここにあなたのAPIキーを入れてください
    const UNSPLASH_ACCESS_KEY = 'JaNh_-1Nob00BL_43MUdTG4-05gEGL5B8KYM5mxhFKU';

    // 画像を取得する関数
    async function fetchDogImage() {
        try {
            // ボタンを無効化し、ローディング表示
            fetchButton.disabled = true;
            loading.style.display = 'block';
            dogImage.style.display = 'none';
            credit.innerHTML = '';

            // Unsplashから犬の画像を取得
            const response = await fetch(
                'https://api.unsplash.com/photos/random?query=dog&orientation=landscape', {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            });
            
            if (!response.ok) {
                throw new Error('画像の取得に失敗しました');
            }

            const data = await response.json();
            
            // 画像のURLを設定
            dogImage.src = data.urls.regular;
            
            // 写真家の情報を更新
            credit.innerHTML = `
                Photo by <a href="${data.user.links.html}?utm_source=dog_image_app&utm_medium=referral" 
                target="_blank">${data.user.name}</a> on 
                <a href="https://unsplash.com?utm_source=dog_image_app&utm_medium=referral" 
                target="_blank">Unsplash</a>
            `;

            // 画像の読み込み完了時の処理
            dogImage.onload = function() {
                loading.style.display = 'none';
                dogImage.style.display = 'block';
                fetchButton.disabled = false;
            };

        } catch (error) {
            console.error('エラーが発生しました:', error);
            loading.style.display = 'none';
            fetchButton.disabled = false;
            alert('画像の取得に失敗しました。もう一度お試しください。');
        }
    }

    // ボタンクリック時のイベントリスナー
    fetchButton.addEventListener('click', fetchDogImage);
});