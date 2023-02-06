<template>
  <div class="timymce-container">
    <el-button type="primary" @click="handleDisabled" style="margin-bottom: 20px">
      {{ disabled ? "启动编辑器" : "禁用编辑器" }}
    </el-button>
    <el-button type="primary" @click="handleTheme" style="margin-bottom: 20px">
      {{ theme === "default" ? "暗色主题" : "默认主题" }}
    </el-button>
    <tinymce
      v-if="tinymceActive"
      v-model="content"
      :height="400"
      :disabled="disabled"
      :lang="lang"
      :theme="theme"
      :move="true"
      toolbar-mode="sliding"
      @img-upload="handleImgUpload"
      @file-upload="handleFileUpload"
    />
    <h3>实时预览</h3>
    <div class="editor-content" v-html="content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tinymce from "@/components/Tinymce/index.vue";
import { LayoutModule } from "@/store/modules/layout";
import { tinymceHtml } from "@/test/tinymce";

@Component({ name: "TinymceDemo", components: { Tinymce } })
export default class extends Vue {
  public content = tinymceHtml;
  public tinymceActive = true;
  public disabled = false;
  public theme = "default";

  get lang() {
    return LayoutModule.language;
  }

  activated() {
    this.tinymceActive = true;
  }
  deactivated() {
    this.tinymceActive = false;
  }

  public handleDisabled() {
    this.disabled = !this.disabled;
  }

  public handleTheme() {
    this.tinymceActive = false;
    if (this.theme === "default") {
      this.theme = "dark";
    } else {
      this.theme = "default";
    }
    this.$nextTick(() => {
      this.tinymceActive = true;
    });
  }

  public async handleImgUpload(blobInfo: any, success: Function, failure: Function, progress: Function) {
    let blobFile = blobInfo.blob(); // blob 图片
    // let base64File = blobInfo.base64(); // base64 图片
    // fileName 为 Tinymce 内部处理的文件名（官网说 fileName 一定唯一），而 blobFile.name 是文件上传前自带的文件名
    // let fileName = blobInfo.filename();
    const isLt2M = blobFile.size / 1024 / 1024 < 10;
    let { name } = blobFile;
    // let imgType = name && name.substring(name.lastIndexOf(".") + 1);
    // if (imgType !== "jpg" && imgType !== "png") {
    //   failure("上传文件只能是 jpg、png 格式!");
    //   return false;
    // }
    if (!isLt2M) {
      failure("上传失败，图片不可超过 10M!");
      return false;
    }
    /**
     * 模拟本地批量上传图片，实际应该上传到云端，则下面的 if 需要去掉（单个图片上传时，length 大于 2，只有批量上传，才等于 2）
     * 批量上传只是类似于 for 循环调用该 handleImgUpload 函数，所以实际的云端批量上传，直接把下面的 if 去掉即可
     */
    if (Object.keys(blobInfo).length === 2) {
      let { blobInfo: b, file: f } = await this.uploadLocal(blobFile);
      success(b.blobUri(), { text: f.name, title: f.name });
    }

    // 上传服务器
    // let formData = new FormData();
    // formData.append("file", blobInfo.blob());
    // axios({
    //   url: "",
    //   method: "post",
    //   data: formData,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    //   .then((res: any) => {
    //  使用 axios 进行图片上传，注意 this 是否引入成功
    //     const { url, name } = res.data;
    //     success(url, { title: name });
    //   })
    //   .catch(() => {
    //     failure("上传出错，服务器开小差了呢");
    //   });
  }
  /**
   *
   * @param file 上传的文件
   * @param filetype 在哪个工具上传文件类型："image" | "media" | "file"，并不是上传的文件类型
   * @param callback callback 是个回调，参数 1 是一个有效的 http 链接，如果是图片，执行 callback 后就会执行 @img-upload 回调
   */
  public async handleFileUpload(file: File, filetype: "image" | "media" | "file", callback: Function) {
    if (filetype === "image") {
      if (file.type && !file.type.startsWith("image")) {
        this.$message.error("无法上传视频，您应该上传图片！");
        return;
      }
      /**
       * 这里不应该上传图片到云端，因为执行完 callback，就会执行 @img-upload 回调，所以请在 @img-upload 的回调函数上传到云端
       * 因此这里仅仅是上传到本地浏览器即可
       */
      let { blobInfo, file: f } = await this.uploadLocal(file);
      callback(blobInfo.blobUri(), { text: f.name, title: f.name });
    } else if (filetype === "media") {
      const isValid = await this.validateVideo(file);
      if (isValid) {
        // 本地上传
        let { blobInfo, file: f } = await this.uploadLocal(file);
        callback(blobInfo.blobUri(), { text: f.name, title: f.name });
        // 云端上传
        // const { url, name } = await this.uploadFile(file, "video");
        // callback(url, { title: name });
      }
    } else if (filetype === "file") {
      let { blobInfo, file: f } = await this.uploadLocal(file);
      callback(blobInfo.blobUri(), { text: f.name, title: f.name });
    }
  }
  /**
   * 上传到本地浏览器
   */
  private uploadLocal(file: File): Promise<{ blobInfo: any; file: File }> {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = function (e) {
        let id = "id" + new Date().getTime(); // 本地图片的文件名
        let tinymce = (window as any).tinymce;
        let blobCache = tinymce.activeEditor.editorUpload.blobCache;
        let base64 = (reader as any).result.split(",")[1];
        let blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        resolve({ blobInfo, file });
      };
      reader.readAsDataURL(file);
    });
  }
  /**
   * 视频上传前验证
   */
  private async validateVideo(file: File) {
    const isMP4 = file.type === "video/mp4"; // 如果允许所有视频格式，可以 file.type.startsWith("video")
    const isLt100M = file.size / 1024 / 1024 < 100;

    if (!isMP4) {
      this.$message.error("上传视频必须为 MP4 格式！");
      return false;
    }

    if (!isLt100M) {
      this.$message.error("上传视频大小限制 100M 以内！");
      return false;
    }

    const duration = await this.getVideoDuration(file);
    if (duration > 60) {
      this.$message.error("上传视频时长不能超过 60 秒！");
      return false;
    }
    return true;
  }
  /**
   * @description 获取视频时长
   * @param {File} file - 要上传的文件
   * @returns {Promise<number>}
   */
  private getVideoDuration(file: File): Promise<number> {
    return new Promise(resolve => {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);

      videoElement.addEventListener("loadedmetadata", () => {
        resolve(videoElement.duration);
      });
    });
  }
  /**
   * @description 上传文件
   * @param {File} file - 要上传的文件
   * @param {string} folder - 所存放的文件夹，如果你的服务器没有该配置，则不需要传
   * @returns {Object}
   */
  private async uploadFile(file: any, folder = "video") {
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("accept", folder);

    // 注：此为调用后端上传接口，需根据实际情况进行调整
    // const { data } = await axios({
    //   method: "POST",
    //   url: "/api/v1/upload",
    //   data: formData,
    //   headers: { "Content-Type": "multipart/form-data" },
    // });

    // return {
    //   url: data.url,
    //   name: file.name,
    // };
    return {
      url: "",
      name: "",
    };
  }
}
</script>

<style lang="scss" scoped>
.timymce-container {
  padding: 20px;
}
</style>
