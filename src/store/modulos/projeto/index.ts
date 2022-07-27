import IProjeto from "@/interfaces/IProjeto";
import { Estado } from "@/store";
import {
  ALTERAR_PROJETO,
  CADASTRAR_PROJETO,
  OBTER_PROJETOS,
  REMOVER_PROJETO,
} from "@/store/tipo-acoes";
import {
  ADICIONA_PROJETO,
  ALTERA_PROJETO,
  DEFINIR_PROJETOS,
  EXCLUI_PROJETO,
} from "@/store/tipo-mutacoes";
import { Module } from "vuex";
import http from "@/http";

export interface EstadoProjeto {
  projetos: IProjeto[];
}

export const projeto: Module<EstadoProjeto, Estado> = {
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto: IProjeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto,
      };
      state.projetos.push(projeto);
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex((proj) => proj.id == projeto.id);
      state.projetos[index] = projeto;
    },
    [EXCLUI_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter((proj) => proj.id != id);
    },
    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
      state.projetos = projetos;
    },
  },
  actions: {
    [OBTER_PROJETOS]({ commit }) {
      http
        .get("projetos")
        .then((resposta: any) => commit(DEFINIR_PROJETOS, resposta.data))
        .catch((error) => console.log(error));
    },
    [CADASTRAR_PROJETO](contexto, nomeDoProjeto: string) {
      return http.post("/projetos", {
        nome: nomeDoProjeto,
      });
    },
    [ALTERAR_PROJETO](contexto, projeto: IProjeto) {
      return http.put(`/projetos/${projeto.id}`, projeto);
    },
    async [REMOVER_PROJETO]({ commit }, idProjeto: string) {
      await http
        .delete(`/projetos/${idProjeto}`)
        .then(() => commit(EXCLUI_PROJETO, idProjeto))
        .catch((error) => console.log(error));
    },
  },
};
