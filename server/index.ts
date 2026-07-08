import "dotenv/config";
import { createServer } from "node:http";
import { ONBOARDING_PAYLOAD_VERSION, getFailureRate, getOnboardingMetrics, ingestOnboardingSubmission } from "./onboardingContract";
import { getOfficialContentResponse } from "./officialContent";

const PORT = Number(process.env.ONBOARDING_PORT || 3001);

const setCors = (res: import("node:http").ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const setJson = (res: import("node:http").ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  setCors(res);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

const collectBody = (req: import("node:http").IncomingMessage): Promise<unknown> => {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
  });
};

const resolveQueueHint = (payload: unknown): boolean => {
  if (!payload || typeof payload !== "object") return false;
  const meta = (payload as { meta?: { replayedFromQueue?: unknown } }).meta;
  return meta?.replayedFromQueue === true;
};

const requestId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const isOnboardingApiPath = (url: string | undefined, expected: string): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url, "http://localhost");
    return parsedUrl.pathname === expected;
  } catch {
    return url === expected;
  }
};

const server = createServer(async (req, res) => {
  const url = req.url || "";
  if (req.method === "OPTIONS") {
    setCors(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET" && isOnboardingApiPath(url, "/api/onboarding/health")) {
    setJson(res, 200, {
      ok: true,
      service: "tag08-onboarding-api",
      schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      status: "online",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === "GET" && isOnboardingApiPath(url, "/api/onboarding/metrics")) {
    const metrics = getOnboardingMetrics();
    setJson(res, 200, {
      ok: true,
      schemaVersion: ONBOARDING_PAYLOAD_VERSION,
      ...metrics,
      failureRate: Number(getFailureRate().toFixed(4))
    });
    return;
  }

  if (req.method === "GET" && isOnboardingApiPath(url, "/api/official-content")) {
    const response = await getOfficialContentResponse();
    setJson(res, response.ok ? 200 : 500, response);
    return;
  }

  if (req.method !== "POST" || !isOnboardingApiPath(url, "/api/onboarding")) {
    setJson(res, 404, { ok: false, error: "Endpoint nao encontrado." });
    return;
  }

  const payload = await collectBody(req);
  const fromQueue = resolveQueueHint(payload);
  const rid = requestId();
  const result = await ingestOnboardingSubmission(payload, { fromQueue });

  if (!result.ok) {
    console.warn(
      JSON.stringify({
        event: "onboarding_submission_rejected",
        requestId: rid,
        status: result.status,
        error: result.error
      })
    );
    setJson(res, 400, {
      ok: false,
      status: result.status,
      error: result.error,
      requestId: rid
    });
    return;
  }

  console.log(
    JSON.stringify({
      event: "onboarding_submission_accepted",
      requestId: rid,
      submissionId: result.submissionId,
      status: result.status,
      fromQueue,
      receivedAt: result.receivedAt
    })
  );

  setJson(res, 202, {
    ok: true,
    submissionId: result.submissionId,
    status: result.status,
    schemaVersion: result.schemaVersion || ONBOARDING_PAYLOAD_VERSION,
    receivedAt: result.receivedAt,
    requestId: rid
  });
});

server.listen(PORT, () => {
  console.log(`TAG08 onboarding API running at http://localhost:${PORT}`);
});
