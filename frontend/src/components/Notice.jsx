export default function Notice({ mensagem }) {
  if (!mensagem) return null;
  return (
    <p className={`notice notice-${mensagem.tipo}`} role={mensagem.tipo === 'erro' ? 'alert' : 'status'}>
      {mensagem.texto}
    </p>
  );
}
