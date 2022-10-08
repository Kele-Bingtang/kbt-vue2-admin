<template>
  <div class="user-container">
    <el-dropdown trigger="click" style="height: 100%">
      <div class="avatar-wrapper">
        <img src="@/assets/小乐.png" class="user-avatar" />
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
    line-height: 75px;
    position: relative;
    height: 100%;
    .user-avatar {
      cursor: pointer;
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      line-height: 45px;
      font-size: 12px;
    }
  }
}
</style>
