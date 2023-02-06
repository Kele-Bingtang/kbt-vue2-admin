<template>
  <div class="editor-info">
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="user.userName" maxlength="30" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="user.phone" maxlength="11" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="user.email" maxlength="50" />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-radio-group v-model="user.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { UserInfo, UserModule } from "@/store/modules/user";
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component({ name: "EditorInfo" })
export default class extends Vue {
  @Prop({ required: true })
  public user!: UserInfo;

  public backupsUser = { ...UserModule.userInfo };

  public rules = {
    userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
    phone: [
      { required: true, message: "联系方式不能为空", trigger: "blur" },
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的联系方式",
        trigger: "blur",
      },
    ],
    email: [
      { required: true, message: "邮箱地址不能为空", trigger: "blur" },
      {
        type: "email",
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"],
      },
    ],
  };

  public submit() {
    (this.$refs.form as any).validate((valid: boolean) => {
      if (valid) {
        UserModule.setUserInfo({
          ...this.user,
        });
        this.$message({
          message: "修改成功",
          type: "success",
        });
        (this.$refs.form as any).clearValidate();
      }
    });
  }
  @Emit("reset-user")
  public reset() {
    (this.$refs.form as any).clearValidate();
    return "";
  }
}
</script>

<style lang="scss" scoped></style>
