import INotificacao from "@/interfaces/INotificacao";
import IProjeto from "@/interfaces/IProjeto";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import {
  ALTERAR_PROJETO,
  CADASTRAR_PROJETO,
  CADASTRAR_TAREFA,
  OBTER_PROJETOS,
  OBTER_TAREFAS,
  REMOVER_PROJETO,
} from "./tipo-acoes";
import {
  ADICIONA_PROJETO,
  ADICIONA_TAREFA,
  ALTERA_PROJETO,
  DEFINIR_PROJETOS,
  DEFINIR_TAREFAS,
  EXCLUI_PROJETO,
  NOTIFICAR,
} from "./tipo-mutacoes";
import http from "@/http";
import ITarefa from "@/interfaces/ITarefa";

interface Estado {
  projetos: IProjeto[];
  tarefas: ITarefa[];
  notificacoes: INotificacao[];
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    projetos: [],
    tarefas: [],
    notificacoes: [],
  },
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
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas;
    },
    [ADICIONA_TAREFA](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa);
    },
    [NOTIFICAR](state, notificacao: INotificacao) {
      notificacao.id = new Date().getTime();
      state.notificacoes.push(notificacao);

      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(
          (n) => n.id != notificacao.id
        );
      }, 5000);
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
    async [REMOVER_PROJETO](contexto, idProjeto: string) {
      await http
        .delete(`/projetos/${idProjeto}`)
        .then(() => this.commit(EXCLUI_PROJETO, idProjeto))
        .catch((error) => console.log(error));
    },
    async [OBTER_TAREFAS]({ commit }) {
      await http
        .get(`tarefas`)
        .then((response) => this.commit(DEFINIR_TAREFAS, response.data));
    },
    async [CADASTRAR_TAREFA]({ commit }, nomeDoProjeto: string) {
      const resposta = await http
        .post("/projetos", {
          nome: nomeDoProjeto,
        });
      return commit(ADICIONA_TAREFA, resposta.data);
    },
  },
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
