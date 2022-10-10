<template>
  <div class="global-settings">
    <div class="svg-container">
      <el-button size="small" plain @click="openSettingsDialog">
        <svg-icon name="setting" width="22" height="22"></svg-icon>
      </el-button>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import settings from "@/config/settings";

@Component({})
export default class GloabalSettings extends Vue {
  public dialogVisible = false;

  public openSettingsDialog() {
    this.dialogVisible = true;
  }
}
</script>

<style lang="scss" scoped></style>
