import INotificacao from "@/interfaces/INotificacao";
import IProjeto from "@/interfaces/IProjeto";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import {
  ALTERAR_TAREFA,
  CADASTRAR_TAREFA,
  OBTER_TAREFAS,
} from "./tipo-acoes";
import {
  ADICIONA_TAREFA,
  ALTERA_TAREFA,
  DEFINIR_TAREFAS,
  NOTIFICAR,
} from "./tipo-mutacoes";
import http from "@/http";
import ITarefa from "@/interfaces/ITarefa";
import { EstadoProjeto, projeto } from "./modulos/projeto";

export interface Estado {
  tarefas: ITarefa[];
  notificacoes: INotificacao[];
  projeto: EstadoProjeto
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    tarefas: [],
    notificacoes: [],
    projeto: {
      projetos: []
    }
  },
  mutations: {
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
    [ALTERA_TAREFA](state, tarefa: ITarefa) {
      const index = state.tarefas.findIndex((t) => t.id == tarefa.id);
      state.tarefas[index] = tarefa;
    },
  },
  actions: {
    [OBTER_TAREFAS]({ commit }) {
      http
        .get(`tarefas`)
        .then((response) => commit(DEFINIR_TAREFAS, response.data));
    },
    async [CADASTRAR_TAREFA]({ commit }, tarefa: ITarefa) {
      const resposta = await http.post("/tarefas", tarefa);
      return commit(ADICIONA_TAREFA, resposta.data);
    },
    [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa) {
      return http
        .put(`/tarefas/${tarefa.id}`, tarefa)
        .then(() => commit(ALTERA_TAREFA, tarefa));
    },
  },
  modules: {
    projeto
  }
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
