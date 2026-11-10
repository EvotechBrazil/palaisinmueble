import { useRef, useState, type FormEvent } from "react";
import { requestCopy } from "../content/tower";
import { sendPresentation } from "../lib/api";

type FieldErrors = {
  nome?: string;
  contato?: string;
  mensagem?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d(][\d\s().-]*$/;

function looksLikeEmail(value: string): boolean {
  return emailPattern.test(value);
}

function looksLikePhone(value: string): boolean {
  if (!phonePattern.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 8 && digits <= 15;
}

function fieldErrors(nome: string, contato: string, mensagem: string): FieldErrors {
  const errors: FieldErrors = {};
  const name = nome.trim();
  const contact = contato.trim();
  const message = mensagem.trim();

  if (name.length < 2 || name.length > 80) {
    errors.nome = "O nome precisa ter entre 2 e 80 caracteres.";
  }

  if (contact.length < 5 || contact.length > 120) {
    errors.contato = "O contato precisa ter entre 5 e 120 caracteres.";
  } else if (!looksLikeEmail(contact) && !looksLikePhone(contact)) {
    errors.contato = "O contato precisa parecer um e-mail ou um telefone.";
  }

  if (message.length < 10 || message.length > 1000) {
    errors.mensagem = "A mensagem precisa ter entre 10 e 1000 caracteres.";
  }

  return errors;
}

export function RequestForm() {
  const sending = useRef(false);
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const nextErrors = fieldErrors(nome, contato, mensagem);
    setErrors(nextErrors);
    if (nextErrors.nome || nextErrors.contato || nextErrors.mensagem) {
      setRequestId(null);
      setFailure(null);
      return;
    }

    sending.current = true;
    setPending(true);
    setFailure(null);
    setRequestId(null);

    try {
      const receipt = await sendPresentation({
        nome: nome.trim(),
        contato: contato.trim(),
        mensagem: mensagem.trim(),
      });
      setRequestId(receipt.id);
    } catch (error) {
      const text = error instanceof Error && error.message ? error.message : requestCopy.error;
      setFailure(text);
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  return (
    <form className="request" noValidate onSubmit={handleSubmit}>
      <h2>{requestCopy.title}</h2>
      <p>{requestCopy.text}</p>

      <label htmlFor="pedido-nome">{requestCopy.nome}</label>
      <input
        id="pedido-nome"
        name="nome"
        type="text"
        required
        minLength={2}
        maxLength={80}
        autoComplete="name"
        value={nome}
        disabled={pending}
        aria-invalid={errors.nome ? true : undefined}
        aria-describedby={errors.nome ? "pedido-nome-erro" : undefined}
        onChange={(event) => setNome(event.target.value)}
      />
      {errors.nome ? (
        <span className="error" id="pedido-nome-erro">
          {errors.nome}
        </span>
      ) : null}

      <label htmlFor="pedido-contato">{requestCopy.contato}</label>
      <input
        id="pedido-contato"
        name="contato"
        type="text"
        required
        minLength={5}
        maxLength={120}
        value={contato}
        disabled={pending}
        aria-invalid={errors.contato ? true : undefined}
        aria-describedby={errors.contato ? "pedido-contato-erro" : undefined}
        onChange={(event) => setContato(event.target.value)}
      />
      {errors.contato ? (
        <span className="error" id="pedido-contato-erro">
          {errors.contato}
        </span>
      ) : null}

      <label htmlFor="pedido-mensagem">{requestCopy.mensagem}</label>
      <textarea
        id="pedido-mensagem"
        name="mensagem"
        required
        minLength={10}
        maxLength={1000}
        rows={5}
        value={mensagem}
        disabled={pending}
        aria-invalid={errors.mensagem ? true : undefined}
        aria-describedby={errors.mensagem ? "pedido-mensagem-erro" : undefined}
        onChange={(event) => setMensagem(event.target.value)}
      />
      {errors.mensagem ? (
        <span className="error" id="pedido-mensagem-erro">
          {errors.mensagem}
        </span>
      ) : null}

      <button className="metal" type="submit" disabled={pending}>
        {pending ? requestCopy.pending : requestCopy.submit}
      </button>

      {requestId ? (
        <p className="note">
          {requestCopy.success} {requestId}
        </p>
      ) : null}
      {failure ? <p className="note">{failure}</p> : null}
    </form>
  );
}
