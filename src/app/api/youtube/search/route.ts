import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error('[YouTube API Error] Missing YOUTUBE_API_KEY in environment variables');
    return NextResponse.json({ error: 'YouTube API configuration missing' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        query + ' course intro'
      )}&type=video&key=${apiKey}`
    );

    if (!response.ok) {
        const errorData = await response.json();
        console.error(`[YouTube API Error] Status: ${response.status} | Details:`, errorData);
        return NextResponse.json({ error: 'Failed to fetch from YouTube' }, { status: response.status });
    }

    const data = await response.json();
    const video = data.items?.[0];

    if (!video) {
      return NextResponse.json({ videoId: null });
    }

    return NextResponse.json({
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
    });
  } catch (error: any) {
    console.error('YouTube Search Exception:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
