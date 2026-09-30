"use client";

import { useEffect, useState } from "react";
import {
  type OfficialContentApiResponse,
  type OfficialContentSourceStatus,
  type OfficialGoogleReview
} from "./officialContent";

type GoogleBusinessSnapshot = {
  source: OfficialContentSourceStatus;
  reviews: OfficialGoogleReview[];
};

const unavailableSnapshot: GoogleBusinessSnapshot = {
  source: "fallback",
  reviews: []
};

let cachedSnapshot: GoogleBusinessSnapshot | null = null;
let pendingRequest: Promise<GoogleBusinessSnapshot> | null = null;

const getOfficialGoogleBusinessReviews = async (): Promise<GoogleBusinessSnapshot> => {
  if (cachedSnapshot) return cachedSnapshot;

  if (!pendingRequest) {
    const request = fetch("/api/official-content", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) return unavailableSnapshot;

        const payload = (await response.json()) as OfficialContentApiResponse;
        const hasLiveReviews = payload.sources.googleBusiness === "live" && payload.gmbReviews.length > 0;
        return hasLiveReviews
          ? { source: payload.sources.googleBusiness, reviews: payload.gmbReviews }
          : unavailableSnapshot;
      })
      .catch(() => unavailableSnapshot)
      .then((snapshot) => {
        if (snapshot.source === "live") cachedSnapshot = snapshot;
        return snapshot;
      });

    pendingRequest = request;
    void request.finally(() => {
      if (pendingRequest === request) pendingRequest = null;
    });
  }

  return pendingRequest;
};

export const useOfficialGoogleBusinessReviews = () => {
  const [snapshot, setSnapshot] = useState<GoogleBusinessSnapshot>(cachedSnapshot ?? unavailableSnapshot);
  const [isLoading, setIsLoading] = useState(() => !cachedSnapshot);

  useEffect(() => {
    let active = true;
    void getOfficialGoogleBusinessReviews().then((nextSnapshot) => {
      if (!active) return;
      setSnapshot(nextSnapshot);
      setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { ...snapshot, isLoading };
};
