<template>
  <div class="my-prifle">
    <div v-if="user.userId">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="资料编辑" name="editorUserInfo">
                <editor-info :user="user" />
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
import { UserModule } from "@/store/modules/user";
import EditorInfo from "./components/EditorInfo.vue";
import Account from "./components/Account.vue";
import UserCard from "./components/UserCard.vue";

@Component({
  components: {
    EditorInfo,
    Account,
    UserCard,
  },
})
export default class Profile extends Vue {
  public activeTab = "editorUserInfo";

  get user() {
    return UserModule.userInfo;
  }

  get roles() {
    return UserModule.roles;
  }
}
</script>
<style lang="scss" scoped>
.my-prifle {
  padding: 20px;
}
</style>
