require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// 静的ファイルの提供
app.use(express.static(__dirname));

// APIエンドポイント
app.get('/api/photos', async (req, res) => {
  try {
    const breed = req.query.breed || 'dog';
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(breed)}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// その他のルートをindex.htmlにリダイレクト
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel環境での動作のために追加
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Vercel環境用のエクスポート
module.exports = app;
