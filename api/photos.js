const fetch = require('node-fetch');

// APIエンドポイント
module.exports = async (req, res) => {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
}; 