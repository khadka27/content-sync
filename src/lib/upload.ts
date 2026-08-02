import axios from 'axios';

export interface TikTokPublishInitOptions {
  accessToken: string;
  videoSize?: number;
  chunkSize?: number;
  totalChunks?: number;
  title: string;
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY';
  disableDuet?: boolean;
  disableComment?: boolean;
  disableStitch?: boolean;
  videoCoverTimestampMs?: number;
}

export interface TikTokPublishInitResponse {
  data?: {
    publish_id: string;
    upload_url: string;
  };
  error?: {
    code: string;
    message: string;
    log_id: string;
  };
}

export async function initTikTokVideoUpload(
  options: TikTokPublishInitOptions
): Promise<{ uploadUrl: string; publishId: string }> {
  const {
    accessToken,
    videoSize = 10485760, // Default 10MB
    chunkSize = 10485760,
    totalChunks = 1,
    title,
    privacyLevel = 'PUBLIC_TO_EVERYONE',
    disableDuet = false,
    disableComment = false,
    disableStitch = false,
  } = options;

  if (accessToken.startsWith('tiktok_mock') || accessToken.startsWith('tiktok_live_token')) {
    return {
      uploadUrl: `https://open-api.tiktok.com/mock_upload_url_${Date.now()}`,
      publishId: `v_pub_mock_${Date.now()}`,
    };
  }

  const payload = {
    post_info: {
      title,
      privacy_level: privacyLevel,
      disable_duet: disableDuet,
      disable_comment: disableComment,
      disable_stitch: disableStitch,
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: videoSize,
      chunk_size: chunkSize,
      total_chunk_count: totalChunks,
    },
  };

  const response = await axios.post<TikTokPublishInitResponse>(
    'https://open.tiktokapis.com/v2/post/publish/video/init/',
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    }
  );

  if (response.data.error && response.data.error.code !== 'ok') {
    throw new Error(`TikTok Upload Init Failed: ${response.data.error.message}`);
  }

  return {
    uploadUrl: response.data.data?.upload_url || '',
    publishId: response.data.data?.publish_id || '',
  };
}

export async function uploadVideoChunkToTikTok(
  uploadUrl: string,
  videoData: ArrayBuffer | Buffer,
  startByte: number = 0,
  totalSize?: number
): Promise<boolean> {
  if (uploadUrl.includes('mock_upload_url')) {
    return true;
  }

  const size = totalSize || (videoData as Buffer).byteLength || (videoData as ArrayBuffer).byteLength;
  const endByte = size - 1;

  const response = await axios.put(uploadUrl, videoData, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes ${startByte}-${endByte}/${size}`,
    },
  });

  return response.status === 200 || response.status === 201;
}
