export type PresentationInput = {
  nome: string;
  contato: string;
  mensagem: string;
};

export async function sendPresentation(
  input: PresentationInput,
): Promise<{ id: string; receivedAt: string }> {
  const response = await fetch("/api/apresentacao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  let payload: { id?: string; receivedAt?: string; error?: string } = {};
  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    payload = {};
  }

  if (!response.ok || !payload.id || !payload.receivedAt) {
    throw new Error(payload.error || "Não foi possível registrar agora.");
  }

  return { id: payload.id, receivedAt: payload.receivedAt };
}
