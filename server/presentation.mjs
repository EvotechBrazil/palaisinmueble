import { appendPresentation } from "./store.mjs";
import { clientIp, rateLimit, readJson, securityHeaders } from "./guards.mjs";

function send(res, status, body, extraHeaders) {
  securityHeaders(res);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

function retryAfterHeader(source) {
  const value = Number(source?.retryAfter);
  if (!Number.isFinite(value) || value < 0) return "60";
  return String(Math.ceil(value));
}

function publicError(source, fallback) {
  return typeof source?.error === "string" ? source.error : fallback;
}

export async function handlePresentation(req, res) {
  try {
    if (req.method !== "POST") {
      send(res, 405, { error: "Use POST." });
      return;
    }

    const limit = rateLimit(clientIp(req));
    if (limit === false || limit?.ok === false) {
      send(res, 429, { error: publicError(limit, "Muitas tentativas.") }, {
        "Retry-After": retryAfterHeader(limit),
      });
      return;
    }

    const parsed = await readJson(req);
    if (!parsed?.ok) {
      const status = Number.isInteger(parsed?.status) ? parsed.status : 400;
      send(res, status, { error: publicError(parsed, "Pedido inválido.") });
      return;
    }

    const saved = await appendPresentation(parsed.value);
    send(res, 201, { id: saved.id, receivedAt: saved.receivedAt });
  } catch (err) {
    if (res.headersSent) return;
    if (err?.status === 429 || err?.statusCode === 429) {
      send(res, 429, { error: publicError(err, "Muitas tentativas.") }, {
        "Retry-After": retryAfterHeader(err),
      });
      return;
    }
    const status = err?.status === 413 || err?.statusCode === 413 ? 413 : err?.status === 400 || err?.statusCode === 400 ? 400 : 500;
    const error = status === 413 ? "Pedido grande demais." : status === 400 ? "Pedido inválido." : "Não foi possível registrar agora.";
    send(res, status, { error });
  }
}
