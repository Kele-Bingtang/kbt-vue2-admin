<template>
  <div class="my-prifle">
    <div v-if="user.userId">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user">
            <user-avatar
              :user="user"
            />
          </user-card>
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="时间线" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="资料编辑" name="editorUserInfo">
                <editor-info ref="editorUser" :user="canEditUser" @reset-user="resetUser" />
              </el-tab-pane>
              <el-tab-pane label="密码修改" name="updatePassword">
                <account />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserInfo, UserModule } from "@/store/modules/user";
import EditorInfo from "./components/editor-info.vue";
import Account from "./components/account.vue";
import UserCard from "./components/user-card.vue";
import UserAvatar from "./components/user-avatar.vue";
import Timeline from "./components/timeline.vue";

@Component({
  components: {
    EditorInfo,
    Account,
    UserCard,
    Timeline,
    UserAvatar,
  },
})
export default class Profile extends Vue {
  public activeTab = "timeline";
  public canEditUser: UserInfo = {
    userId: "",
    userName: "",
    sex: "",
    roles: [],
  };

  get user() {
    let { userInfo } = UserModule;
    this.canEditUser = { ...userInfo };
    return userInfo;
  }

  get roles() {
    return UserModule.roles;
  }

  public resetUser() {
    this.canEditUser = { ...this.user };
  }
}
</script>
<style lang="scss" scoped>
.my-prifle {
  padding: 20px;
}
</style>
