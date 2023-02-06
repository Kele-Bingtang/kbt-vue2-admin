<template>
  <div class="switch-permission-container">
    <div style="margin-bottom: 15px">角色： {{ roles }}</div>
    角色切换：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="admin" />
      <el-radio-button label="visitor" />
    </el-radio-group>

    <div style="margin-top: 30px">
      <div>
        <span v-permission="['admin']" class="permission-alert">
          只有
          <el-tag class="permission-tag" size="small">admin</el-tag>
          有权限看
        </span>
        <el-tag v-permission="['admin']" class="permission-sourceCode" type="info">v-permission="['admin']"</el-tag>
      </div>

      <div>
        <span v-permission="['visitor']" class="permission-alert">
          只有
          <el-tag class="permission-tag" size="small">visitor</el-tag>
          有权限看
        </span>
        <el-tag v-permission="['visitor']" class="permission-sourceCode" type="info">v-permission="['visitor']"</el-tag>
      </div>

      <div>
        <span v-permission="['admin', 'visitor']" class="permission-alert">
          <el-tag class="permission-tag" size="small">admin</el-tag>
          和
          <el-tag class="permission-tag" size="small">visitor</el-tag>
          都有权限看
        </span>
        <el-tag v-permission="['admin', 'visitor']" class="permission-sourceCode" type="info">
          v-permission="['admin','visitor']"
        </el-tag>
      </div>
    </div>

    <div style="margin-top: 60px">
      <el-tabs type="border-card" style="width: 550px">
        <el-tab-pane v-if="checkPermission(['admin'])" label="Admin">
          只有 admin 有权限看
          <el-tag class="permission-sourceCode" type="info">v-if="checkPermission(['admin'])"</el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['visitor'])" label="Visitor">
          只有 visitor 有权限看
          <el-tag class="permission-sourceCode" type="info">v-if="checkPermission(['visitor'])"</el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['admin', 'visitor'])" label="Admin 和 Visitor">
          admin 和 visitor 都有权限看
          <el-tag class="permission-sourceCode" type="info">v-if="checkPermission(['admin','visitor'])"</el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { UserModule } from "@/store/modules/user";
import { checkPermission } from "@/utils/permission";
import { Component, Vue } from "vue-property-decorator";

@Component({ name: "SwitchPermission" })
export default class extends Vue {
  public key = 1;
  public checkPermission = checkPermission;

  get roles() {
    return UserModule.roles;
  }
  get switchRoles() {
    return this.roles[0];
  }
  set switchRoles(value) {
    let roles = [value];
    UserModule.changeRoles(roles).then(() => {
      this.$router.push({ path: "/permission/switch?" + new Date() }).catch(err => {
        console.warn(err);
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.switch-permission-container {
  padding: 20px;
  .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: var(--theme-color);
    color: #ecf5ff;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }

  .permission-sourceCode {
    margin-left: 15px;
  }

  .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>
