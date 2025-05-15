require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// リクエストロギングミドルウェア
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 静的ファイルの提供
app.use(express.static(__dirname));

// APIエンドポイント
app.get('/api/photos', async (req, res) => {
  try {
    console.log('[API] Fetching photo from Unsplash');
    const breed = req.query.breed || 'dog';
    console.log(`[API] Search query: ${breed}`);

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(breed)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      console.error(`[API] Unsplash API error: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[API] Successfully fetched photo: ${data.id}`);
    res.json(data);
  } catch (error) {
    console.error('[API] Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// その他のルートをindex.htmlにリダイレクト
app.get('*', (req, res) => {
  console.log(`[Server] Serving index.html for path: ${req.url}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Vercel環境での動作のために追加
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`[Server] Running on port ${port}`);
  });
}

// 起動時のログ
console.log(`[Server] Node environment: ${process.env.NODE_ENV}`);
console.log('[Server] Application initialized');

// Vercel環境用のエクスポート
module.exports = app;
