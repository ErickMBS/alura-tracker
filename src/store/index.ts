import INotificacao from "@/interfaces/INotificacao";
import IProjeto from "@/interfaces/IProjeto";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { OBTER_PROJETOS } from "./tipo-acoes";
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUI_PROJETO, NOTIFICAR } from "./tipo-mutacoes";
import http from "@/http";

interface Estado {
  projetos: IProjeto[],
  notificacoes: INotificacao[]
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    projetos: [],
    notificacoes: []
  },
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto: IProjeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto
      }
      state.projetos.push(projeto);
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex(proj => proj.id == projeto.id);
      state.projetos[index] = projeto;
    },
    [EXCLUI_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter(proj => proj.id != id)
    },
    [NOTIFICAR](state, notificacao: INotificacao) {
      notificacao.id = new Date().getTime();
      state.notificacoes.push(notificacao)

      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(n => n.id != notificacao.id)
      }, 5000);
    }
  },
  actions: {
    [OBTER_PROJETOS] ({ commit }) {
      http.get('projetos')
        .then((resposta: any) => console.log(resposta.dados))
        .catch((error) => console.log(error))
    }
  }
});

export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}