import {
  DEFAULT_OFFICIAL_CONTENT,
  FALLBACK_GMB_REVIEWS,
  FALLBACK_YOUTUBE_VIDEOS,
  OfficialContentApiResponse,
  OfficialContentSourceStatus,
  OfficialGoogleReview,
  OfficialYouTubeVideo,
  createAvatarDataUri,
  formatCompactDate,
  formatIsoDuration,
  formatRelativeTime,
  formatViewCount
} from "../src/lib/officialContent";
import { TAG08_OFFICIAL_YOUTUBE_HANDLE } from "../src/config/siteNetwork";

type YoutubeChannelListResponse = {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
};

type YoutubePlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: {
      videoId?: string;
    };
  }>;
};

type YoutubeVideosResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: {
        default?: { url?: string };
        medium?: { url?: string };
        high?: { url?: string };
        standard?: { url?: string };
        maxres?: { url?: string };
      };
    };
    contentDetails?: {
      duration?: string;
    };
    statistics?: {
      viewCount?: string;
    };
  }>;
};

type YoutubeVideoItem = NonNullable<NonNullable<YoutubeVideosResponse["items"]>[number]>;
type YoutubeVideoThumbnails = NonNullable<NonNullable<YoutubeVideoItem["snippet"]>["thumbnails"]>;

type GoogleBusinessReviewResponse = {
  reviews?: Array<{
    reviewer?: {
      displayName?: string;
    };
    starRating?: string;
    comment?: string;
    createTime?: string;
  }>;
};

type ContentSourceResult<T> = {
  items: T;
  status: OfficialContentSourceStatus;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const officialContentCache = new Map<string, { expiresAt: number; response: OfficialContentApiResponse }>();

const YOUTUBE_API_KEY = (process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || "").trim();
const YOUTUBE_CHANNEL_HANDLE = (process.env.YOUTUBE_CHANNEL_HANDLE || TAG08_OFFICIAL_YOUTUBE_HANDLE).trim();
const YOUTUBE_CHANNEL_ID = (process.env.YOUTUBE_CHANNEL_ID || "").trim();
const GOOGLE_BUSINESS_LOCATION_NAME = (process.env.GOOGLE_BUSINESS_LOCATION_NAME || "").trim();
const GOOGLE_BUSINESS_ACCESS_TOKEN = (process.env.GOOGLE_BUSINESS_ACCESS_TOKEN || "").trim();
const GOOGLE_BUSINESS_REFRESH_TOKEN = (process.env.GOOGLE_BUSINESS_REFRESH_TOKEN || "").trim();
const GOOGLE_BUSINESS_CLIENT_ID = (process.env.GOOGLE_BUSINESS_CLIENT_ID || "").trim();
const GOOGLE_BUSINESS_CLIENT_SECRET = (process.env.GOOGLE_BUSINESS_CLIENT_SECRET || "").trim();

const getCachedResponse = (cacheKey: string) => {
  const cached = officialContentCache.get(cacheKey);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt < Date.now()) {
    officialContentCache.delete(cacheKey);
    return null;
  }

  return cached.response;
};

const setCachedResponse = (cacheKey: string, response: OfficialContentApiResponse) => {
  officialContentCache.set(cacheKey, {
    response,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
};

const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
};

const resolveYouTubeThumbnail = (thumbnails?: YoutubeVideoThumbnails) =>
  thumbnails?.maxres?.url ||
  thumbnails?.standard?.url ||
  thumbnails?.high?.url ||
  thumbnails?.medium?.url ||
  thumbnails?.default?.url ||
  "";

const fetchYouTubeUploadsPlaylistId = async (): Promise<ContentSourceResult<string | null>> => {
  if (!YOUTUBE_API_KEY) {
    return { items: null, status: "fallback" };
  }

  const query = new URLSearchParams({
    part: "contentDetails",
    key: YOUTUBE_API_KEY
  });

  if (YOUTUBE_CHANNEL_ID) {
    query.set("id", YOUTUBE_CHANNEL_ID);
  } else {
    query.set("forHandle", YOUTUBE_CHANNEL_HANDLE);
  }

  const response = await fetchJson<YoutubeChannelListResponse>(
    `https://www.googleapis.com/youtube/v3/channels?${query.toString()}`
  );

  return {
    items: response.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null,
    status: response.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ? "live" : "fallback"
  };
};

const fetchYouTubeLiveVideos = async (): Promise<ContentSourceResult<OfficialYouTubeVideo[]>> => {
  if (!YOUTUBE_API_KEY) {
    return { items: FALLBACK_YOUTUBE_VIDEOS, status: "fallback" };
  }

  const uploadsPlaylist = await fetchYouTubeUploadsPlaylistId();
  if (!uploadsPlaylist.items) {
    return { items: FALLBACK_YOUTUBE_VIDEOS, status: uploadsPlaylist.status };
  }

  const playlistQuery = new URLSearchParams({
    part: "contentDetails",
    playlistId: uploadsPlaylist.items,
    maxResults: "4",
    key: YOUTUBE_API_KEY
  });

  const playlistResponse = await fetchJson<YoutubePlaylistItemsResponse>(
    `https://www.googleapis.com/youtube/v3/playlistItems?${playlistQuery.toString()}`
  );

  const videoIds = (playlistResponse.items || [])
    .map((item) => item.contentDetails?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId));

  if (!videoIds.length) {
    return { items: FALLBACK_YOUTUBE_VIDEOS, status: "fallback" };
  }

  const videosQuery = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    id: videoIds.join(","),
    key: YOUTUBE_API_KEY
  });

  const videosResponse = await fetchJson<YoutubeVideosResponse>(
    `https://www.googleapis.com/youtube/v3/videos?${videosQuery.toString()}`
  );

  const videoById = new Map(
    (videosResponse.items || [])
      .filter(
        (item): item is Required<Pick<YoutubeVideoItem, "id" | "snippet" | "contentDetails" | "statistics">> =>
          Boolean(item.id && item.snippet && item.contentDetails)
      )
      .map((item) => [item.id, item])
  );

  const items = videoIds
    .map((videoId) => {
      const item = videoById.get(videoId);
      if (!item?.snippet || !item.contentDetails) {
        return null;
      }

      const publishedAt = item.snippet.publishedAt ? new Date(item.snippet.publishedAt) : new Date();
      return {
        id: videoId,
        title: item.snippet.title || "Canal oficial TAG08",
        description: item.snippet.description || "Conteúdo publicado no canal oficial da TAG08.",
        duration: formatIsoDuration(item.contentDetails.duration || "PT0S"),
        date: formatCompactDate(publishedAt),
        category: "YOUTUBE OFICIAL",
        thumbnail: resolveYouTubeThumbnail(item.snippet.thumbnails),
        embedCode: videoId,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        views: formatViewCount(item.statistics?.viewCount || 0),
        tagline: item.snippet.title ? item.snippet.title.toUpperCase() : "CONTEÚDO OFICIAL",
        source: "live" as const
      };
    })
    .filter((item): item is OfficialYouTubeVideo => Boolean(item))
    .slice(0, 4);

  return {
    items: items.length ? items : FALLBACK_YOUTUBE_VIDEOS,
    status: items.length ? "live" : "fallback"
  };
};

const getGoogleAccessToken = async (): Promise<string | null> => {
  if (GOOGLE_BUSINESS_ACCESS_TOKEN) {
    return GOOGLE_BUSINESS_ACCESS_TOKEN;
  }

  if (!GOOGLE_BUSINESS_REFRESH_TOKEN || !GOOGLE_BUSINESS_CLIENT_ID || !GOOGLE_BUSINESS_CLIENT_SECRET) {
    return null;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: GOOGLE_BUSINESS_CLIENT_ID,
      client_secret: GOOGLE_BUSINESS_CLIENT_SECRET,
      refresh_token: GOOGLE_BUSINESS_REFRESH_TOKEN,
      grant_type: "refresh_token"
    }).toString()
  });

  if (!response.ok) {
    throw new Error(`Google OAuth refresh failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as { access_token?: string };
  return json.access_token || null;
};

const fetchGoogleBusinessReviews = async (): Promise<ContentSourceResult<OfficialGoogleReview[]>> => {
  if (!GOOGLE_BUSINESS_LOCATION_NAME) {
    return { items: FALLBACK_GMB_REVIEWS, status: "fallback" };
  }

  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    return { items: FALLBACK_GMB_REVIEWS, status: "fallback" };
  }

  const query = new URLSearchParams({
    pageSize: "6",
    orderBy: "updateTime desc"
  });

  const response = await fetchJson<GoogleBusinessReviewResponse>(
    `https://mybusiness.googleapis.com/v4/${GOOGLE_BUSINESS_LOCATION_NAME}/reviews?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const items = (response.reviews || [])
    .map((review, index) => {
      const comment = (review.comment || "").trim();
      if (!comment) {
        return null;
      }

      const reviewerName = review.reviewer?.displayName || `Cliente ${index + 1}`;
      const createdAt = review.createTime ? new Date(review.createTime) : new Date();

      return {
        name: reviewerName,
        role: "Avaliação Google",
        avatar: createAvatarDataUri(reviewerName),
        time: formatRelativeTime(createdAt),
        tagline: comment.split(/[.!?]/)[0]?.trim() || "Avaliação pública no Google Business",
        text: comment,
        category: `${review.starRating || "FIVE"} ESTRELAS`,
        source: "live" as const
      };
    })
    .filter((review): review is OfficialGoogleReview => Boolean(review))
    .slice(0, 6);

  return {
    items: items.length ? items : FALLBACK_GMB_REVIEWS,
    status: items.length ? "live" : "fallback"
  };
};

export const buildOfficialContentSnapshot = async (): Promise<OfficialContentApiResponse> => {
  const cacheKey = "official-content";
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  const [youtubeResult, googleResult] = await Promise.allSettled([fetchYouTubeLiveVideos(), fetchGoogleBusinessReviews()]);

  const youtubeSource =
    youtubeResult.status === "fulfilled"
      ? youtubeResult.value
      : {
          items: FALLBACK_YOUTUBE_VIDEOS,
          status: "error" as const
        };

  const googleSource =
    googleResult.status === "fulfilled"
      ? googleResult.value
      : {
          items: FALLBACK_GMB_REVIEWS,
          status: "error" as const
        };

  const response: OfficialContentApiResponse = {
    ok: true,
    status:
      youtubeSource.status === "live" && googleSource.status === "live"
        ? "live"
        : youtubeSource.status === "fallback" && googleSource.status === "fallback"
          ? "fallback"
          : "partial",
    sources: {
      youtube: youtubeSource.status,
      googleBusiness: googleSource.status
    },
    youtubeVideos: youtubeSource.items,
    gmbReviews: googleSource.items,
    fetchedAt: new Date().toISOString()
  };

  setCachedResponse(cacheKey, response);
  return response;
};

export const buildOfficialContentFallbackResponse = (): OfficialContentApiResponse => ({
  ok: true,
  status: "fallback",
  sources: DEFAULT_OFFICIAL_CONTENT.sources,
  youtubeVideos: DEFAULT_OFFICIAL_CONTENT.youtubeVideos,
  gmbReviews: DEFAULT_OFFICIAL_CONTENT.gmbReviews
});

export const buildOfficialContentErrorResponse = (error: unknown): OfficialContentApiResponse => ({
  ok: false,
  status: "error",
  sources: DEFAULT_OFFICIAL_CONTENT.sources,
  youtubeVideos: DEFAULT_OFFICIAL_CONTENT.youtubeVideos,
  gmbReviews: DEFAULT_OFFICIAL_CONTENT.gmbReviews,
  error: error instanceof Error ? error.message : String(error)
});

export const getOfficialContentResponse = async (): Promise<OfficialContentApiResponse> => {
  try {
    return await buildOfficialContentSnapshot();
  } catch (error) {
    return buildOfficialContentErrorResponse(error);
  }
};

export const getOfficialContentStatusSummary = () => ({
  youtubeConfigured: Boolean(YOUTUBE_API_KEY),
  googleConfigured:
    Boolean(GOOGLE_BUSINESS_LOCATION_NAME) &&
    Boolean(GOOGLE_BUSINESS_ACCESS_TOKEN || (GOOGLE_BUSINESS_REFRESH_TOKEN && GOOGLE_BUSINESS_CLIENT_ID && GOOGLE_BUSINESS_CLIENT_SECRET))
});
