import { getTikTokAuthUrl, exchangeTikTokCode, refreshTikTokToken, TikTokTokenResponse } from './oauth';
import { initTikTokVideoUpload, uploadVideoChunkToTikTok, TikTokPublishInitOptions } from './upload';

export interface TikTokPostParams {
  accessToken: string;
  title: string;
  videoUrl?: string;
  videoBuffer?: Buffer | ArrayBuffer;
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY';
  disableDuet?: boolean;
  disableComment?: boolean;
  disableStitch?: boolean;
}

export class TikTokService {
  /**
   * Generates the URL for TikTok OAuth redirect
   */
  static getAuthUrl(state?: string, customRedirectUri?: string): string {
    return getTikTokAuthUrl(state, customRedirectUri);
  }

  /**
   * Exchanges authorization code for access & refresh tokens
   */
  static async exchangeCode(code: string, customRedirectUri?: string): Promise<TikTokTokenResponse> {
    return exchangeTikTokCode(code, customRedirectUri);
  }

  /**
   * Refreshes expired TikTok access token
   */
  static async refreshToken(refreshTokenStr: string): Promise<TikTokTokenResponse> {
    return refreshTikTokToken(refreshTokenStr);
  }

  /**
   * Complete TikTok Video Publication Workflow:
   * 1. Initialize Upload
   * 2. Upload Video Bytes
   * 3. Finalize & Publish
   */
  static async publishVideo(params: TikTokPostParams): Promise<{ success: boolean; publishId: string; uploadUrl?: string }> {
    const { accessToken, title, videoBuffer, privacyLevel, disableDuet, disableComment, disableStitch } = params;

    // 1. Initialize TikTok Upload session
    const initResult = await initTikTokVideoUpload({
      accessToken,
      title,
      privacyLevel: privacyLevel || 'PUBLIC_TO_EVERYONE',
      disableDuet,
      disableComment,
      disableStitch,
      videoSize: videoBuffer ? (videoBuffer as Buffer).byteLength || (videoBuffer as ArrayBuffer).byteLength : 10485760,
    });

    // 2. Upload video bytes if videoBuffer provided
    if (videoBuffer && initResult.uploadUrl) {
      await uploadVideoChunkToTikTok(initResult.uploadUrl, videoBuffer);
    }

    return {
      success: true,
      publishId: initResult.publishId,
      uploadUrl: initResult.uploadUrl,
    };
  }
}
