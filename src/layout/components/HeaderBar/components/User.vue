<template>
  <div class="user-container">
    <el-dropdown trigger="click" style="height: 100%">
      <div class="avatar-wrapper">
        <img src="@/assets/小乐.png" class="user-avatar" />
        <span class="username">{{ userInfo.userName }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/profile">
          <el-dropdown-item icon="el-icon-user">
            {{ profileLabel }}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item @click.prevent.native="openSettingsDrawer" icon="el-icon-setting" v-if="showSettings">
          <span>
            {{ settingsLabel }}
          </span>
        </el-dropdown-item>
        <el-dropdown-item divided @click.prevent.native="logout" icon="el-icon-back">
          <span>
            {{ logOutLabel }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <global-settings ref="globalSettings" v-if="showSettings" />
  </div>
</template>

<script lang="ts">
import { SettingsModule } from "@/store/modules/settings";
import { UserModule } from "@/store/modules/user";
import { Component, Vue } from "vue-property-decorator";
import GlobalSettings from "./GlobalSettings.vue";

@Component({
  components: {
    GlobalSettings,
  },
})
export default class User extends Vue {
  get userInfo() {
    return UserModule.userInfo;
  }

  get showSettings() {
    return SettingsModule.showSettings;
  }

  get profileLabel() {
    let profile = this.$t("_headerBar.profile");
    return profile === "_headerBar.profile" ? "我的主页" : profile;
  }

  get settingsLabel() {
    let logOut = this.$t("_headerBar.settings");
    return logOut === "_headerBar.settings" ? "我的设置" : logOut;
  }
  get logOutLabel() {
    let logOut = this.$t("_headerBar.logOut");
    return logOut === "_headerBar.logOut" ? "退出登录" : logOut;
  }

  public openSettingsDrawer() {
    (this.$refs.globalSettings as any).openSettingsDrawer();
  }

  public async logout() {
    await UserModule.LogOut();
    // this.$router.push(`/login?redirect=${this.$route.fullPath}`).catch(err => {
    //   console.warn(err)
    // })
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  .avatar-wrapper {
    position: relative;
    height: 100%;
    line-height: 75px;
    display: flex;
    align-items: center;
    .user-avatar {
      cursor: pointer;
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }

    .username {
      line-height: 0px;
      display: inline-block;
      margin: 0 7px 0 9px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      font-size: 12px;
    }
  }
}
</style>
