<template>
  <div class="international">
    <el-dropdown trigger="click" @command="handleSetLanguage" style="height: 95%">
      <div class="layout-svg-btn">
        <svg-icon name="language" class="international-icon" width="20px" height="20px" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="local in localList"
          :key="local.value"
          :command="local.value"
          :disabled="language === local.value"
        >
          {{ local.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class LangSelecr extends Vue {
  @Prop({ default: "zh-CN" })
  public language!: string;

  public localList = [
    { label: "中文简体", value: "zh-CN" },
    { label: "中文繁体", value: "zh-TW" },
    { label: "English", value: "en-US" },
  ];

  @Emit("on-change")
  public handleSetLanguage(lang: string) {
    return lang;
  }
}
</script>

<style lang="scss" scoped>
.international {
  margin-left: 6px;
}
</style>
