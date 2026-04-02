/**
 * Netlify Serverless Function — Instagram Feed Proxy
 * Fetches latest posts from Instagram Graph API.
 * Token is stored as INSTAGRAM_TOKEN env variable in Netlify dashboard.
 */

exports.handler = async () => {
  const token = process.env.INSTAGRAM_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Instagram token not configured' }),
    };
  }

  const fields = 'id,media_url,permalink,thumbnail_url,media_type,caption';
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=6&access_token=${token}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Instagram API error', details: errorData }),
      };
    }

    const data = await response.json();

    // Filter to only images and carousel albums, get the image URL
    const posts = (data.data || []).map((post) => ({
      id: post.id,
      url: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      type: post.media_type,
      caption: post.caption ? post.caption.substring(0, 100) : '',
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache 1 hour
      },
      body: JSON.stringify({ posts }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch Instagram feed', message: err.message }),
    };
  }
};
