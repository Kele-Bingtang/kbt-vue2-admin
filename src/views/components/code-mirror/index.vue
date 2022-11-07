<template>
  <div class="code-mirror-container">
    <code-mirror />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CodeMirror from "@/components/CodeMirror/index.vue";

@Component({
  components: { CodeMirror },
})
export default class CodeMirrorDemo extends Vue {}
</script>

<style lang="scss" scoped>
.code-mirror-container {
  padding: 20px;
}
</style>
