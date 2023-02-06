<template>
  <div class="wang-editor-container">
    <el-button type="primary" @click="disabled = !disabled" style="margin-bottom: 20px">
      {{ disabled ? "启动编辑器" : "禁用编辑器" }}
    </el-button>
    <wang-editor
      v-model="content"
      :height="400"
      :disabled="disabled"
      @image-upload="imageUpload"
      @video-upload="videoUpload"
      @file-upload="fileUpload"
    ></wang-editor>
    <h3>实时预览</h3>
    <div class="editor-content" v-html="content"></div>
    {{ content }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WangEditor, { FileInsertFnType, ImageInsertFnType, VideoInsertFnType } from "@/components/WangEditor/index.vue";

@Component({ name: "WangEditorDemo", components: { WangEditor } })
export default class extends Vue {
  public content = "";
  public disabled = false;

  public async imageUpload(file: File, insertFn: ImageInsertFnType) {
    // 上传到本地
    let { blobInfo, file: f } = await this.uploadLocal(file);
    let url = URL.createObjectURL(file);
    insertFn(url, f.name);
    // 上传服务器
    // uploadFiles(file, appId, this.$sso.userId)
    //   .then(res => {
    //     if (res.result === true) {
    //       let { fileKey, fileName } = res.data[0];
    //       let url = `${process.env.VUE_APP_BASE_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
    //       insertFn(url, fileName);
    //     } else {
    //       this.$message.error("上传出错，服务器开小差了呢");
    //     }
    //   })
    //   .catch(() => {
    //     this.$message.error("上传出错，服务器开小差了呢");
    //   });
  }

  public videoUpload(file: File, insertFn: VideoInsertFnType) {
    // 上传服务器
    // uploadFiles(file, appId, this.$sso.userId)
    //   .then(res => {
    //     if (res.result === true) {
    //       let { fileKey, fileName } = res.data[0];
    //       let url = `${process.env.VUE_APP_BASE_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
    //       insertFn(url, fileName);
    //     } else {
    //       this.$message.error("上传出错，服务器开小差了呢");
    //     }
    //   })
    //   .catch(() => {
    //     this.$message.error("上传出错，服务器开小差了呢");
    //   });
  }
  public fileUpload(file: File, insertFn: FileInsertFnType) {
    // 上传服务器
    // uploadFiles(file, appId, this.$sso.userId)
    //   .then(res => {
    //     if (res.result === true) {
    //       let { fileKey, fileName } = res.data[0];
    //       let url = `${process.env.VUE_APP_BASE_URL}/documentStore/api/public/v1/download/downloadFileByGet?appId=a41d9bf7-5ffa-4ad0-bfd7-a57692cfdbc7&fileKey=${fileKey}`;
    // 名称放在前面
    //       insertFn(fileName, url);
    //     } else {
    //       this.$message.error("上传出错，服务器开小差了呢");
    //     }
    //   })
    //   .catch(() => {
    //     this.$message.error("上传出错，服务器开小差了呢");
    //   });
  }

  /**
   * 上传到本地浏览器
   */
  private uploadLocal(file: File): Promise<{ blobInfo: any; file: File }> {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = function (e) {
        let id = "id" + new Date().getTime(); // 本地图片的文件名
        let base64 = (reader as any).result.split(",")[1];
        let blobInfo = { id, file, base64 };
        resolve({ blobInfo, file });
      };
      reader.readAsDataURL(file);
    });
  }
}
</script>

<style lang="scss" scoped>
.wang-editor-container {
  padding: 20px;
}
</style>
