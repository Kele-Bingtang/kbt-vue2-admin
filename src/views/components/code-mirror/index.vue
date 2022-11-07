<template>
  <div class="code-mirror-container">
    <div class="select-header">
      主题：
      <el-select v-model="cmTheme" placeholder="请选择主题" filterable style="margin-right: 20px">
        <el-option
          v-for="item in cmThemeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.value === cmTheme"
        ></el-option>
      </el-select>
      语言：
      <el-select v-model="cmMode" placeholder="请选择语言" filterable>
        <el-option
          v-for="item in cmModeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.value === cmMode"
        ></el-option>
      </el-select>
    </div>
    <code-mirror :value="value" :cmTheme="cmTheme" :cmMode="cmMode" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CodeMirror from "@/components/CodeMirror/index.vue";
import { cmThemeOptions, cmModeOptions } from "@/test/code-mirror";

@Component({
  components: { CodeMirror },
})
export default class CodeMirrorDemo extends Vue {
  public cmTheme = "default";
  public cmMode = "application/json";
  public value = "const a = 'hello world';";

  public cmThemeOptions = cmThemeOptions;

  public cmModeOptions = cmModeOptions;
}
</script>

<style lang="scss" scoped>
.code-mirror-container {
  padding: 20px;
  height: 100%;
  .select-header {
    margin-bottom: 30px;
  }
}
</style>

<style lang="scss">
.CodeMirror {
  height: 700px;
  font-family: inherit;
}
</style>
