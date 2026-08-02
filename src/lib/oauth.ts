import axios from 'axios';

export interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  open_id: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export function getTikTokAuthUrl(state?: string, customRedirectUri?: string): string {
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || process.env.TIKTOK_CLIENT_KEY || 'your_tiktok_client_key';
  const redirectUri = customRedirectUri || process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/auth/tiktok/callback';
  const scope = 'user.info.basic,video.upload,video.publish';

  const url = new URL('https://www.tiktok.com/v2/auth/authorize/');
  url.searchParams.append('client_key', clientKey);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scope);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('state', state || 'default');

  return url.toString();
}

export async function exchangeTikTokCode(
  code: string,
  customRedirectUri?: string
): Promise<TikTokTokenResponse> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '';
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';
  const redirectUri = customRedirectUri || process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/auth/tiktok/callback';

  if (!clientKey || clientKey === 'your_tiktok_client_key' || !clientSecret || clientSecret === 'your_tiktok_client_secret') {
    // Return mock response when keys are not configured
    return {
      access_token: `tiktok_mock_access_token_${Date.now()}`,
      refresh_token: `tiktok_mock_refresh_token_${Date.now()}`,
      expires_in: 86400,
      open_id: `mock_open_id_${Date.now()}`,
      scope: 'user.info.basic,video.upload,video.publish',
    };
  }

  const params = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const response = await axios.post<TikTokTokenResponse>(
    'https://open.tiktokapis.com/v2/oauth/token/',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}

export async function refreshTikTokToken(refreshToken: string): Promise<TikTokTokenResponse> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '';

  if (!clientKey || clientKey === 'your_tiktok_client_key') {
    return {
      access_token: `tiktok_refreshed_access_token_${Date.now()}`,
      refresh_token: refreshToken,
      expires_in: 86400,
      open_id: `mock_open_id_${Date.now()}`,
    };
  }

  const params = new URLSearchParams({
    client_key: clientKey,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await axios.post<TikTokTokenResponse>(
    'https://open.tiktokapis.com/v2/oauth/token/',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}
