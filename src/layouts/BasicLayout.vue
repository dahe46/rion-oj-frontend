<template>
  <div class="basicLayout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <a-row justify="center">
          <router-view />
        </a-row>
      </a-layout-content>
      <a-layout-footer class="footer"></a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.header {
  z-index: 1;
  background: linear-gradient(200deg, #e3c5eb, #a9c1ed);
}

.content {
  padding: 10px;
  z-index: 1;
}

.footer {
  z-index: 1;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
