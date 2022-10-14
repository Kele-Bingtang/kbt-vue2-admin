<template>
  <div class="global-settings">
    <div class="svg-container">
      <el-button size="small" plain @click.prevent="openSettingsDrawer">
        <svg-icon name="setting" width="22" height="22"></svg-icon>
      </el-button>
    </div>

    <el-drawer
      :title="$t('_settings.title')"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="18%"
      append-to-body
      custom-class="drawer-container"
    >
      <div class="drawer-item">
        <span>{{ $t("_settings.theme") }}</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t("_settings.showTagsNav") }}</span>
        <el-switch v-model="showTagsNav" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("_settings.showSideMenuLogo") }}</span>
        <el-switch v-model="showSideMenuLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("_settings.sideMenuTheme") }}</span>
        <el-switch v-model="sideMenuTheme" class="drawer-switch" />
      </div>

      <el-divider />

      <el-button
        size="small"
        plain
        icon="el-icon-refresh"
        @click="resetSettings"
        >重置配置</el-button
      >
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ThemePicker from "@/components/ThemePicker/ThemePicker.vue";
import { SettingsModule } from "@/store/modules/settings";

@Component({
  components: {
    ThemePicker,
  },
})
export default class GloabalSettings extends Vue {
  public drawerVisible = false;

  public openSettingsDrawer() {
    this.drawerVisible = true;
  }

  get showTagsNav() {
    return SettingsModule.showTagsNav;
  }

  set showTagsNav(value) {
    SettingsModule.changeSetting({ key: "showTagsNav", value });
  }

  get showSideMenuLogo() {
    return SettingsModule.showSideMenuLogo;
  }

  set showSideMenuLogo(value) {
    SettingsModule.changeSetting({ key: "showSideMenuLogo", value });
  }

  get sideMenuTheme() {
    return SettingsModule.sideMenuTheme == "dark";
  }

  set sideMenuTheme(value: boolean) {
    let sideMenuTheme = value ? "dark" : "light";
    SettingsModule.changeSetting({
      key: "sideMenuTheme",
      value: sideMenuTheme,
    });
  }

  public themeChange(value: string) {
    SettingsModule.changeSetting({ key: "theme", value });
  }

  resetSettings() {
    this.$message({
      message: "正在清除设置缓存并刷新，请稍候...",
      type: "success",
      duration: 1000,
      iconClass: "el-icon-loading",
    });
    SettingsModule.resetSettings();
    setTimeout("window.location.reload()", 1000);
  }
}
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.drawer-container {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }
  .drawer-switch {
    float: right;
  }
  .el-drawer__body {
    padding: 20px;
  }
}
</style>
