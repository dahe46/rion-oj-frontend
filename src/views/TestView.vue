<template>
  <div class="home" style="width: 100%">
    <MdEdit :value="value" :handle-change="onChange" />
    <CodeEditor :value="value1" :handle-change="onChange1" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MdEdit from "@/components/MdEdit.vue";
import CodeEditor from "@/components/CodeEditor.vue";

const value = ref("");
const value1 = ref("");

const onChange = (v: string) => {
  value.value = v;
};

const onChange1 = (v: string) => {
  value1.value = v;
};
</script>
