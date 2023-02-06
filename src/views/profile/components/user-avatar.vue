<template>
  <div class="user-avatar-container">
    <div class="user-avatar-header" @click="openDialog">
      <el-image :src="user.avatar" title="点击上传头像" class="user-avatar" alt="头像">
        <div slot="error" class="image-slot">
          <el-image :src="require('@/assets/default.png')" class="user-avatar" alt="头像" />
        </div>
      </el-image>
    </div>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="800px"
      append-to-body
      @close="handleClose"
      class="user-avatar-dialog"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <cropper
        :imgLink="user.avatar"
        :crop-width="200"
        :crop-height="200"
        :crop-container-height="350"
        image-type="base64"
        @upload-image="uploadImage"
      ></cropper>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserInfo } from "@/store/modules/user";
import Cropper from "@/components/Cropper/index.vue";

@Component({ name: "UserAvatar", components: { Cropper } })
export default class extends Vue {
  public dialogVisible = false;

  @Prop({ required: true })
  public user!: UserInfo;

  public openDialog() {
    this.dialogVisible = true;
  }

  public handleClose() {
    this.dialogVisible = false;
  }

  // 提交图片到云端
  public uploadImage(imgData: FormData) {
    console.log(imgData);
  }
}
</script>

<style lang="scss" scoped>
.user-avatar-container {
  position: relative;
  display: inline-block;
  height: 100%;
  .user-avatar-header:hover:after {
    content: "+";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 110px;
    border-radius: 50%;
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
</style>
