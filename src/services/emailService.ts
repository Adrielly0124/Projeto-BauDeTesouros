import emailjs from "emailjs-com";

const SERVICE_ID = "service_baudetesouros";
const TEMPLATE_ID = "template_l2igses";   // <--- O CORRETO AGORA
const PUBLIC_KEY = "82rZUOxU4hZDRUb4W";

export async function enviarContato(data: {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}) {
  const params = {
    nome: data.nome,
    email: data.email,
    assunto: data.assunto,
    mensagem: data.mensagem,
    title: data.assunto,   // só deixe se o template usar {{title}}
  };

  console.log(">>> Params enviados ao EmailJS:", params);

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
}
