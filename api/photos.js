const fetch = require('node-fetch');

// APIエンドポイント
module.exports = async (req, res) => {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // API KEYの確認
  console.log('[API] Checking API key...');
  console.log('[API] API key exists:', !!process.env.UNSPLASH_ACCESS_KEY);
  
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error('[API] Missing Unsplash API key');
    res.status(500).json({ 
      error: 'Server Configuration Error', 
      details: 'API key is not configured' 
    });
    return;
  }

  try {
    console.log('[API] Fetching photo from Unsplash');

    const response = await fetch(
      'https://api.unsplash.com/photos/random?query=dog&orientation=landscape',
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      console.error(`[API] Unsplash API error: ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      
      // エラーステータスコードをそのまま転送
      res.status(response.status).json({ 
        error: 'Unsplash API Error', 
        status: response.status,
        details: errorData.errors || response.statusText
      });
      return;
    }
    
    const data = await response.json();
    console.log(`[API] Successfully fetched photo: ${data.id}`);
    res.status(200).json(data);
  } catch (error) {
    console.error('[API] Error:', error.message);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}; 