"use client";

import { useEffect, useState } from "react";
import {
  selectLiveYouTubeVideos,
  type OfficialContentApiResponse,
  type OfficialContentSourceStatus,
  type OfficialYouTubeVideo
} from "./officialContent";

type YouTubeSnapshot = {
  source: OfficialContentSourceStatus;
  videos: OfficialYouTubeVideo[];
};

type CachedYouTubeSnapshot = YouTubeSnapshot & { expiresAt: number };

const CLIENT_CACHE_TTL_MS = 10 * 60 * 1000;
let cachedSnapshot: CachedYouTubeSnapshot | null = null;
let pendingRequest: Promise<YouTubeSnapshot> | null = null;

const fallbackSnapshot: YouTubeSnapshot = {
  source: "fallback",
  videos: []
};

const getCachedSnapshot = () => {
  if (!cachedSnapshot) return null;
  if (cachedSnapshot.expiresAt > Date.now()) return cachedSnapshot;
  cachedSnapshot = null;
  return null;
};

const getOfficialYouTubeVideos = async (): Promise<YouTubeSnapshot> => {
  const cached = getCachedSnapshot();
  if (cached) return cached;

  if (!pendingRequest) {
    const request = fetch("/api/official-content", { cache: "no-store", headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) {
          return fallbackSnapshot;
        }

        const payload = (await response.json()) as OfficialContentApiResponse;
        return {
          source: payload.sources?.youtube ?? "error",
          videos: selectLiveYouTubeVideos(payload)
        };
      })
      .catch(() => fallbackSnapshot)
      .then((snapshot) => {
        if (snapshot.source === "live" && snapshot.videos.length > 0) {
          cachedSnapshot = { ...snapshot, expiresAt: Date.now() + CLIENT_CACHE_TTL_MS };
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
  const [snapshot, setSnapshot] = useState<YouTubeSnapshot>(() => getCachedSnapshot() ?? fallbackSnapshot);
  const [isLoading, setIsLoading] = useState(() => !getCachedSnapshot());

  useEffect(() => {
    let active = true;

    void getOfficialYouTubeVideos().then((nextSnapshot) => {
      if (active) {
        setSnapshot(nextSnapshot);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return {
    source: snapshot.source,
    videos: snapshot.videos.slice(0, limit),
    isLoading
  };
};
