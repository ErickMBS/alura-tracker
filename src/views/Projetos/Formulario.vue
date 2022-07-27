<template>
  <section class="projetos">
    <form @submit.prevent="salvar">
      <div class="field">
        <label for="nomeDoProjeto" class="label"> Nome do Projeto</label>
        <input type="text" class="input" v-model="nomeDoProjeto" id="nomeDoProjeto" />
      </div>
      <div class="field">
        <button class="button" type="submit">Salvar</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { TipoNotificacao } from "@/interfaces/INotificacao";
import { useStore } from "@/store";
import { defineComponent } from "vue";
import useNotificador from "@/hooks/notificador";
import { ALTERAR_PROJETO, CADASTRAR_PROJETO } from "@/store/tipo-acoes";

export default defineComponent({
  name: "FormularioProjetos",
  props: {
    id: {
      type: String,
    },
  },
  mounted() {
    if (this.id) {
      const projeto = this.store.state.projeto.projetos.find((proj) => proj.id == this.id);
      this.nomeDoProjeto = projeto?.nome || "";
    }
  },
  data() {
    return {
      nomeDoProjeto: "",
    };
  },
  methods: {
    salvar() {
      if (this.id) {
        this.store
          .dispatch(ALTERAR_PROJETO, {
            id: this.id,
            nome: this.nomeDoProjeto,
          })
          .then(() => this.lidarComSucesso())
          .catch(() => {
            this.notificar(
              TipoNotificacao.FALHA,
              "Falha ao alterar projeto",
              "Tente novamente e caso persista entre em contato."
            );
          });
      } else {
        this.store
          .dispatch(CADASTRAR_PROJETO, this.nomeDoProjeto)
          .then(() => this.lidarComSucesso())
          .catch((error) => {
            this.notificar(
              TipoNotificacao.FALHA,
              "Falha ao cadastrar projeto",
              "Tente novamente e caso persista entre em contato."
            );
          });
      }
    },
    lidarComSucesso() {
      this.nomeDoProjeto = "";
      this.notificar(
        TipoNotificacao.SUCESSO,
        "Projeto cadastrado",
        "Seu projeto foi cadastrado e já pode ser usado."
      );
      this.$router.push("/projetos");
    },
  },
  setup() {
    const store = useStore();
    const { notificar } = useNotificador();
    return {
      store,
      notificar,
    };
  },
});
</script>
