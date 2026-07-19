import { DeliveryStatus } from "../../../../../generated/prisma/enums";
import { getPrisma } from "../../../../../lib/server/prisma";
import { createRequestId, jsonResponse } from "../../../../../lib/api/response";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = createRequestId();
  if (!process.env.INTERNAL_API_TOKEN || request.headers.get("authorization") !== `Bearer ${process.env.INTERNAL_API_TOKEN}`) {
    return jsonResponse({ ok: false, error: "unauthorized", requestId }, 401, request);
  }

  const body: unknown = await request.json().catch(() => ({}));
  const deliveryId = body && typeof body === "object" && "deliveryId" in body && typeof body.deliveryId === "string"
    ? body.deliveryId
    : undefined;
  const prisma = getPrisma();
  const result = await prisma.integrationDelivery.updateMany({
    where: deliveryId ? { id: deliveryId, status: DeliveryStatus.FAILED } : { status: DeliveryStatus.FAILED },
    data: {
      status: DeliveryStatus.PENDING,
      nextAttemptAt: new Date(),
      processingStartedAt: null,
      lastErrorCode: null,
      lastErrorAt: null
    }
  });

  return jsonResponse({ ok: true, requeued: result.count, requestId }, 200, request);
}
