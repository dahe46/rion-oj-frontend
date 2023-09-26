<template>
  <div>
    <Editor
      :value="value"
      :mode="mode"
      :plugins="plugins"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor, Viewer } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";

interface Props {
  value: string;
  mode?: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const plugins = [gfm(), highlight()];
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
