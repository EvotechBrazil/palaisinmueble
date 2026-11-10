const hits = new Map();
const windowMs = 10 * 60 * 1000;
const maxHits = 5;
const maxBytes = 8000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d(][\d\s().-]*$/;

export function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
}

export function clientIp(req) {
  return req.socket?.remoteAddress || "local";
}

export function rateLimit(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < windowMs);
  if (recent.length >= maxHits) {
    const oldest = recent[0];
    hits.set(ip, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }
  recent.push(now);
  hits.set(ip, recent);
  return { ok: true };
}

function fail(status, error) {
  return { ok: false, status, error };
}

export async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) return fail(413, "Mensagem grande demais.");
    chunks.push(chunk);
  }

  let data;
  try {
    data = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return fail(400, "Envie os dados em JSON.");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return fail(400, "Envie os dados em JSON.");
  }

  const nome = typeof data.nome === "string" ? data.nome.trim() : "";
  const contato = typeof data.contato === "string" ? data.contato.trim() : "";
  const mensagem = typeof data.mensagem === "string" ? data.mensagem.trim() : "";

  if (nome.length < 2 || nome.length > 80) return fail(400, "Informe o nome.");
  if (contato.length < 5 || contato.length > 120 || !validContact(contato)) {
    return fail(400, "Informe e-mail ou telefone.");
  }
  if (mensagem.length < 10 || mensagem.length > 1000) {
    return fail(400, "Escreva uma mensagem curta.");
  }

  return { ok: true, value: { nome, contato, mensagem } };
}

function validContact(value) {
  if (emailPattern.test(value)) return true;
  if (!phonePattern.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 8 && digits <= 15;
}
