<template>
  <div class="user-container">
    <el-dropdown trigger="click" style="height: 100%; line-height: 0">
      <div class="avatar-wrapper">
        <el-image :src="user.avatar" class="user-avatar" alt="头像">
          <div slot="error">
            <el-image :src="require('@/assets/default.png')" class="user-avatar" alt="头像" />
          </div>
        </el-image>
        <span class="username">{{ user.userName }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link to="/profile">
          <el-dropdown-item icon="el-icon-user">
            {{ profileLabel }}
          </el-dropdown-item>
        </router-link>
        <router-link to="/message">
          <el-badge :is-dot="messageCount > 0" class="message-badge">
            <el-dropdown-item icon="el-icon-bell">
              {{ messageCenterLabel }}
            </el-dropdown-item>
          </el-badge>
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
  get user() {
    return UserModule.userInfo;
  }

  get showSettings() {
    return SettingsModule.showSettings;
  }

  get profileLabel() {
    let profile = this.$t("_headerBar.profile");
    return profile === "_headerBar.profile" ? "我的主页" : profile;
  }

  get messageCenterLabel() {
    let messageCenter = this.$t("_headerBar.messageCenter");
    return messageCenter === "_headerBar.messageCenter" ? "我的消息" : messageCenter;
  }

  get settingsLabel() {
    let settings = this.$t("_headerBar.settings");
    return settings === "_headerBar.settings" ? "我的设置" : settings;
  }

  get logOutLabel() {
    let logOut = this.$t("_headerBar.logOut");
    return logOut === "_headerBar.logOut" ? "退出登录" : logOut;
  }

  get messageCount() {
    // TODO：unreadList 是空的，因为没有请求数据，只有打开我的消息才会请求数据，这里应该请求 API 未读消息的数量
    return UserModule.message.unreadList.length;
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
  line-height: 0;
  .avatar-wrapper {
    position: relative;
    height: 100%;
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
<style lang="scss">
.user-dropdown {
  .message-badge {
    .is-dot {
      top: 7px;
      right: 17px !important;
    }
  }
}
</style>
