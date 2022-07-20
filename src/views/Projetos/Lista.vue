<template>
  <section class="projetos">

    <router-link to="/projetos/novo" class="button">
      <span class="icon is-small">
        <i class="fas fa-plus"></i>
      </span>
      <span>Novo projeto</span>
    </router-link>

    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="projeto in projetos" :key="projeto.id">
          <td>{{ projeto.id }}</td>
          <td>{{ projeto.nome }}</td>
          <td>
            <router-link :to="`/projetos/${projeto.id}`" class="button">
              <span class="icon is-small">
                <i class="fas fa-pencil-alt"></i>
              </span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    
  </section>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ListaProjetos",
  setup() {
    const store = useStore();
    return {
      projetos: computed(() => store.state.projetos),
    };
  },
});
</script>