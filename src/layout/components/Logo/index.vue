<template>
  <div
    class="layout-logo-container"
    :class="{
      'logo-collapse': isCollapse,
      'header-logo': position === 'header',
      'side-menu-logo': position === 'sideMenu',
    }"
    :style="{
      backgroundColor: backgroundColor,
    }"
  >
    <transition name="layoutLogoFade">
      <router-link v-if="isCollapse" key="collapse" class="layout-logo-link" to="/">
        <img src="@/assets/logo.png" class="layout-logo-img" />
      </router-link>
      <router-link v-else key="expand" class="layout-logo-link" to="/">
        <img src="@/assets/logo.png" class="layout-logo-img" />
        <h1 class="layout-logo-title">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import settings from "@/config/settings";
import variables from "@/styles/variables.module.scss";
import { SettingsModule } from "@/store/modules/settings";

@Component({})
export default class LayoutLogo extends Vue {
  @Prop({ required: true })
  public isCollapse!: boolean;
  @Prop({ default: "sideMenu" })
  public position!: string;

  public title = settings.title;
  
  get variables() {
    return variables;
  }

  get sideMenuTheme() {
    return SettingsModule.sideMenuTheme;
  }

  get backgroundColor() {
    if (this.position === "sideMenu") {
      return this.sideMenuTheme === "dark" ? variables.menuLogoDark : variables.menuLogoLight;
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;

  &.side-menu-logo {
    display: flex;
    .layout-logo-title {
      color: #fff;
    }
  }

  &.header-logo {
    display: inline-flex;
    float: left;
    width: auto;
    margin-right: 12px;
    .layout-logo-title {
      color: #97a8be;
    }
  }

  .layout-logo-link {
    height: 100%;
    width: 100%;

    .layout-logo-img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    .layout-logo-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.logo-collapse {
    &.header-logo {
      margin-right: 20px;
    }
    .layout-logo-img {
      margin-right: 0px;
    }
  }
}
</style>
