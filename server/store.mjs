import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "data");
const filePath = join(dataDir, "apresentacoes.jsonl");

export async function appendPresentation({ nome, contato, mensagem }) {
  const id = randomUUID();
  const receivedAt = new Date().toISOString();
  const line = `${JSON.stringify({ id, nome, contato, mensagem, receivedAt })}\n`;
  await mkdir(dataDir, { recursive: true });
  await appendFile(filePath, line, "utf8");
  return { id, receivedAt };
}
