<template>
  <div class="global-settings">
    <template v-if="showSvg">
      <!-- 放到 HeaderBar 中 -->
      <div class="layout-svg-btn">
        <el-button size="small" plain @click.prevent="openSettingsDrawer">
          <svg-icon name="setting" width="22" height="22"></svg-icon>
        </el-button>
      </div>
    </template>

    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      size="270px"
      append-to-body
      custom-class="drawer-container"
      :with-header="false"
    >
      <div class="drawer-theme-container drawer-checkbox-container">
        <div class="drawer-item-title">{{ $t("_settings.themeTitle") }}</div>

        <div class="drawer-theme-checkbox drawer-checkbox">
          <div class="drawer-theme-checkbox-item drawer-checkbox-item" @click="handleSideMenuTheme('light')">
            <img src="@/icons/svg/side-menu-light.svg" alt="" style="width: 48px; height: 48px" />
            <div v-if="sideMenuTheme === 'light'" class="drawer-theme-checkbox-select-icon drawer-checkbox-select-icon">
              <svg-icon name="tick" width="16" height="16" :style="{ color: theme }" />
            </div>
          </div>

          <div class="drawer-theme-checkbox-item drawer-checkbox-item" @click="handleSideMenuTheme('dark')">
            <img src="@/icons/svg/side-menu-dark.svg" alt="" style="width: 48px; height: 48px" />
            <div v-if="sideMenuTheme === 'dark'" class="drawer-theme-checkbox-select-icon drawer-checkbox-select-icon">
              <svg-icon name="tick" width="16" height="16" :style="{ color: theme }" />
            </div>
          </div>
        </div>

        <div class="drawer-item">
          <span>{{ $t("_settings.theme") }}</span>
          <theme-picker style="float: right; height: 26px; margin: -3px 8px 0 0" @change="themeChange" />
        </div>
      </div>

      <el-divider />

      <div class="drawer-layout-container drawer-checkbox-container">
        <div class="drawer-item-title">{{ $t("_settings.layoutTitle") }}</div>

        <div class="drawer-layout-checkbox drawer-checkbox">
          <div class="drawer-layout-checkbox-item drawer-checkbox-item" @click="handleLayoutMode(0)">
            <img src="@/icons/svg/layout-one.svg" alt="" style="width: 48px; height: 48px" />
            <div v-if="layoutMode === '0'" class="drawer-layout-checkbox-select-icon drawer-checkbox-select-icon">
              <svg-icon name="tick" width="16" height="16" :style="{ color: theme }" />
            </div>
          </div>

          <div class="drawer-layout-checkbox-item drawer-checkbox-item" @click="handleLayoutMode(1)">
            <img src="@/icons/svg/layout-two.svg" alt="" style="width: 48px; height: 48px" />
            <div v-if="layoutMode === '1'" class="drawer-layout-checkbox-select-icon drawer-checkbox-select-icon">
              <svg-icon name="tick" width="16" height="16" :style="{ color: theme }" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="layout-components-container">
        <div class="drawer-item-title">{{ $t("_settings.layoutComponents") }}</div>

        <div class="drawer-item">
          <span>{{ $t("_settings.showBreadcrumb") }}</span>
          <el-switch v-model="showBreadcrumb" class="drawer-switch" />
        </div>

        <div class="drawer-item">
          <span>{{ $t("_settings.showTagsNav") }}</span>
          <el-switch v-model="showTagsNav" class="drawer-switch" />
        </div>

        <div class="drawer-item">
          <span>{{ $t("_settings.recordTagsNav") }}</span>
          <el-switch v-model="recordTagsNav" class="drawer-switch" />
        </div>

        <div class="drawer-item">
          <span>{{ $t("_settings.showLayoutLogo") }}</span>
          <el-switch v-model="showLayoutLogo" class="drawer-switch" />
        </div>
      </div>

      <el-divider />

      <div class="title-mode-container">
        <div class="drawer-item-title">{{ $t("_settings.titleMode") }}</div>

        <div class="drawer-item">
          <el-select v-model="titleMode" placeholder="请选择标题模式" size="mini">
            <el-option
              v-for="item in titleModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.value === titleMode"
            ></el-option>
          </el-select>
        </div>
      </div>

      <el-divider />

      <el-button size="small" plain icon="el-icon-refresh" @click="resetSettings">
        {{ $t("_settings.resetSettingsTitle") }}
      </el-button>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ThemePicker from "@/components/ThemePicker/index.vue";
import { SettingsModule } from "@/store/modules/settings";
import { setTitle } from "@/utils/layout";

@Component({
  components: {
    ThemePicker,
  },
})
export default class GlobalSettings extends Vue {
  @Prop({ default: false })
  public showSvg!: boolean;
  public drawerVisible = false;

  get titleModeOptions() {
    return [
      {
        value: "0",
        label: this.$t("_settings.titleModeOne"),
      },
      {
        value: "1",
        label: this.$t("_settings.titleModeTwo"),
      },
      {
        value: "2",
        label: this.$t("_settings.titleModeThree"),
      },
      {
        value: "3",
        label: this.$t("_settings.titleModeFour"),
      },
    ];
  }

  get theme() {
    return SettingsModule.theme;
  }

  get showBreadcrumb() {
    return SettingsModule.showBreadcrumb;
  }

  set showBreadcrumb(value) {
    SettingsModule.changeSetting({ key: "showBreadcrumb", value });
  }

  get showTagsNav() {
    return SettingsModule.showTagsNav;
  }

  set showTagsNav(value) {
    SettingsModule.changeSetting({ key: "showTagsNav", value });
  }

  get recordTagsNav() {
    return SettingsModule.recordTagsNav;
  }

  set recordTagsNav(value) {
    SettingsModule.changeSetting({ key: "recordTagsNav", value });
  }

  get showLayoutLogo() {
    return SettingsModule.showLayoutLogo;
  }

  set showLayoutLogo(value) {
    SettingsModule.changeSetting({ key: "showLayoutLogo", value });
  }

  get sideMenuTheme() {
    return SettingsModule.sideMenuTheme;
  }

  get titleMode() {
    return SettingsModule.titleMode;
  }

  set titleMode(value) {
    SettingsModule.changeSetting({ key: "titleMode", value });
    // 根据选择的标题模式，重新渲染浏览器标题
    setTitle(this.$route, this);
  }

  get layoutMode() {
    return SettingsModule.layoutMode;
  }

  public handleSideMenuTheme(value: string) {
    SettingsModule.changeSetting({ key: "sideMenuTheme", value });
  }

  public handleLayoutMode(value: number) {
    SettingsModule.changeSetting({ key: "layoutMode", value });
    this.$nextTick(() => {
      window.location.reload();
    });
  }

  // 打开设置窗口
  public openSettingsDrawer() {
    this.drawerVisible = true;
  }

  // 选择主题色回调
  public themeChange(value: string) {
    SettingsModule.changeSetting({ key: "theme", value });
  }
  // 重置配置回调
  public resetSettings() {
    let message = this.$t("_settings.resetSettings");
    message = message === "_settings.resetSettings" ? "正在清除设置缓存并刷新，请稍候..." : message;
    this.$message({
      message: message as string,
      duration: 1000,
      iconClass: "el-icon-loading",
    });
    SettingsModule.resetSettings();
    setTimeout("window.location.reload()", 1000);
  }
}
</script>

<style lang="scss">
.drawer-container {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-checkbox-container {
    .drawer-checkbox {
      height: 48px;
      line-height: 48px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 20px;

      .drawer-checkbox-item {
        height: 100%;
        position: relative;
        margin-right: 16px;
        border-radius: 2px;
        cursor: pointer;

        .drawer-checkbox-select-icon {
          display: block;
          position: absolute;
          top: 0;
          left: 22px;
          height: 100%;
          color: #168bf7;
          font-weight: 700;
          font-size: 14px;
        }
      }
    }
  }

  .drawer-item-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    font-weight: 600;
  }
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

.el-message {
  .el-icon-loading {
    margin-right: 10px;
  }
}
</style>
