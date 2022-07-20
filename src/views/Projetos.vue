<template>
  <div class="projetos">
    <hi class="title">Projetos</hi>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent ({
  name: 'ProjetosView',
}) 
</script>

<style>
.projetos {
  padding: 1.25rem;
}
</style>
