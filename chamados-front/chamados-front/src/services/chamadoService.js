import api from "./api";

// Devolve a mensagem de erro que veio da API (campo detail) ou uma mensagem padrão
export function pegarMensagemErro(erro) {
  if (!erro.response) {
    return "Não foi possível conectar à API. Verifique sua conexão.";
  }

  if (erro.response.status === 401) {
    return "Chave de API inválida. Verifique o arquivo .env.";
  }

  const detalhe = erro.response.data && erro.response.data.detail;

  if (typeof detalhe === "string") {
    return detalhe;
  }

  // Erro 422: o detail pode vir como uma lista de problemas
  if (Array.isArray(detalhe)) {
    const mensagens = [];
    for (let i = 0; i < detalhe.length; i++) {
      const item = detalhe[i];
      if (item.loc) {
        mensagens.push(item.loc[item.loc.length - 1] + ": " + item.msg);
      } else {
        mensagens.push(item.msg);
      }
    }
    return mensagens.join(" | ");
  }

  return "Ocorreu um erro inesperado.";
}

// Dados do dono da chave - Get
export async function buscarUsuario() {
  const resposta = await api.get("/eu");
  return resposta.data;
}

// Listar chamados com filtros - Get
export async function listarChamados(filtros) {
  const resposta = await api.get("/chamados", { params: filtros });
  return resposta.data;
}

// Buscar um chamado pelo id - Get
export async function buscarChamado(id) {
  const resposta = await api.get("/chamados/" + id);
  return resposta.data;
}

// Abrir um chamado - Post
export async function criarChamado(chamado) {
  const resposta = await api.post("/chamados", chamado);
  return resposta.data;
}

// Editar um chamado - Put
export async function editarChamado(id, chamado) {
  const resposta = await api.put("/chamados/" + id, chamado);
  return resposta.data;
}

// aberto -> em andamento - Patch
export async function iniciarChamado(id, responsavel) {
  const resposta = await api.patch("/chamados/" + id + "/iniciar", { responsavel: responsavel });
  return resposta.data;
}

// em andamento -> resolvido - Patch
export async function resolverChamado(id, solucao) {
  const resposta = await api.patch("/chamados/" + id + "/resolver", { solucao: solucao });
  return resposta.data;
}

// Excluir um chamado - Delete
export async function excluirChamado(id) {
  await api.delete("/chamados/" + id);
}

// Listas para os campos de seleção - Get
export async function listarTipos() {
  const resposta = await api.get("/tipos");
  return resposta.data;
}

export async function listarLocais() {
  const resposta = await api.get("/locais");
  return resposta.data;
}

export async function listarPrioridades() {
  const resposta = await api.get("/prioridades");
  return resposta.data;
}
