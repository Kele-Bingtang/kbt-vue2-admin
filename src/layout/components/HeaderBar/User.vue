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
          <el-dropdown-item>
            {{ profileLabel }}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span style="display: block">
            {{ logOutLabel }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { UserModule } from "@/store/modules/user";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class User extends Vue {
  get userInfo() {
    return UserModule.userInfo;
  }

  get profileLabel() {
    let profile = this.$t("$navbar.profile");
    return profile === "$navbar.profile" ? "我的主页" : profile;
  }

  get logOutLabel() {
    let logOut = this.$t("$navbar.logOut");
    return logOut === "$navbar.logOut" ? "退出登录" : logOut;
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
