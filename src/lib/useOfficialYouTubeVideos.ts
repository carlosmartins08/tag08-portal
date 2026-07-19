"use client";

import { useEffect, useState } from "react";
import {
  FALLBACK_YOUTUBE_VIDEOS,
  type OfficialContentApiResponse,
  type OfficialContentSourceStatus,
  type OfficialYouTubeVideo
} from "./officialContent";

type YouTubeSnapshot = {
  source: OfficialContentSourceStatus;
  videos: OfficialYouTubeVideo[];
};

let cachedSnapshot: YouTubeSnapshot | null = null;
let pendingRequest: Promise<YouTubeSnapshot> | null = null;

const fallbackSnapshot: YouTubeSnapshot = {
  source: "fallback",
  videos: FALLBACK_YOUTUBE_VIDEOS
};

const getOfficialYouTubeVideos = async (): Promise<YouTubeSnapshot> => {
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  if (!pendingRequest) {
    const request = fetch("/api/official-content", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) {
          return fallbackSnapshot;
        }

        const payload = (await response.json()) as OfficialContentApiResponse;
        return {
          source: payload.sources.youtube,
          videos: payload.youtubeVideos.length ? payload.youtubeVideos : FALLBACK_YOUTUBE_VIDEOS
        };
      })
      .catch(() => fallbackSnapshot)
      .then((snapshot) => {
        if (snapshot.source === "live") {
          cachedSnapshot = snapshot;
        }
        return snapshot;
      });

    pendingRequest = request;
    void request.finally(() => {
      if (pendingRequest === request) {
        pendingRequest = null;
      }
    });
  }

  return pendingRequest;
};

export const useOfficialYouTubeVideos = (limit: number) => {
  const [snapshot, setSnapshot] = useState<YouTubeSnapshot>(cachedSnapshot ?? fallbackSnapshot);

  useEffect(() => {
    let active = true;

    void getOfficialYouTubeVideos().then((nextSnapshot) => {
      if (active) {
        setSnapshot(nextSnapshot);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return {
    source: snapshot.source,
    videos: snapshot.videos.slice(0, limit)
  };
};
