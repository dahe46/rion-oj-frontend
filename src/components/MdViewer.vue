<template>
  <div class="viewer-container">
    <Viewer :value="value" :plugins="plugins" style="max-height: 500px" />
  </div>
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
}

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
});
</script>

<style scoped>
.viewer-container {
  max-height: 350px; /* 设置最大高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
}
</style>
