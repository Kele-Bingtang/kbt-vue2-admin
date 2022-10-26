<template>
  <div class="cropper-container">
    <el-card class="cropper-card">
      <cropper
        imgLink="https://cdn.staticaly.com/gh/Kele-Bingtang/static@master/user/avatar1.png"
        :crop-width="200"
        :crop-height="200"
        :crop-container-height="350"
        image-type="base64"
        @upload-image="uploadImage"
      ></cropper>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Cropper from "@/components/Cropper/index.vue";

@Component({
  components: {
    Cropper,
  },
})
export default class CropperDemo extends Vue {
  // 提交图片到云端
  public uploadImage(imgData: FormData) {
    console.log(imgData);
  }
}
</script>

<style lang="scss" scoped>
.cropper-container {
  padding: 20px;
  .cropper-card {
    width: 1000px;
    text-align: center;
  }
}
</style>
