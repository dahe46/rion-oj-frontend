<template>
  <div class="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header"></a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">Rion</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.header {
}

.content {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts"></script>
