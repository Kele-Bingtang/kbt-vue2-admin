<template>
  <div
    class="side-menu-logo-container"
    :class="{ 'logo-collapse': isCollapse }"
    :style="{
      backgroundColor:
      sideMenuTheme === 'dark' ? variables.menuLogoDark : variables.menuLogoLight,
    }"
  >
    <transition name="sideMenuLogoFade">
      <router-link
        v-if="isCollapse"
        key="collapse"
        class="side-menu-logo-link"
        to="/"
      >
        <img src="@/assets/logo.png" class="side-menu-logo" />
      </router-link>
      <router-link v-else key="expand" class="side-menu-logo-link" to="/">
        <img src="@/assets/logo.png" class="side-menu-logo" />
        <h1 class="side-menu-title">
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
export default class SideMenuLogo extends Vue {
  @Prop({ required: true })
  public isCollapse!: boolean;

  public title = settings.title;

  get variables() {
    return variables;
  }

  get sideMenuTheme() {
    return SettingsModule.sideMenuTheme;
  }
}
</script>

<style lang="scss" scoped>
.side-menu-logo-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;

  & .side-menu-logo-link {
    height: 100%;
    width: 100%;

    & .side-menu-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .side-menu-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.logo-collapse {
    .side-menu-logo {
      margin-right: 0px;
    }
  }
}
</style>
