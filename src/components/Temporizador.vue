<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <Cronometro :tempoEmSegundos="tempoEmSegundos" />
    <Botao @clicado="iniciar" icone="fas fa-play" texto="play" :desabilitado="cronometroRodando" />
    <Botao @clicado="finalizar" icone="fas fa-stop" texto="stop" :desabilitado="!cronometroRodando" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cronometro from "./Cronometro.vue";
import Botao from "./Botao.vue";

export default defineComponent({
  name: "FormularioTemporizador",
  emits: ['aoTemporizadorFinalizado'],
  components: {
    Cronometro,
    Botao
},
  data() {
    return {
      tempoEmSegundos: 0,
      cronometro: 0,
      cronometroRodando: false
    };
  },
  methods: {
    iniciar() {
      // começar a contagem
      this.cronometroRodando = true;
      this.cronometro = setInterval(() => {
        this.tempoEmSegundos++;
      }, 1000);
    },
    finalizar() {
      this.cronometroRodando = false;
      clearInterval(this.cronometro);
      this.$emit('aoTemporizadorFinalizado', this.tempoEmSegundos)
      this.tempoEmSegundos = 0
    },
  },
});
</script>
