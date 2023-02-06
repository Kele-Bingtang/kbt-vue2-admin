<template>
  <div class="cropper-component">
    <div class="cropper-content" :style="{ height: cropContainerHeight + 'px' }">
      <div class="cropper-img">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :outputSize="options.outputSize"
          :outputType="options.outputType"
          :info="options.info"
          :full="options.full"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          :canMove="options.canMove"
          :canMoveBox="options.canMoveBox"
          :original="options.original"
          :enlarge="options.enlarge"
          @realTime="realTime"
        />
      </div>
      <div class="cropper-img show-previews" v-if="previews.url">
        <div class="previews-img" :style="previews.div">
          <img :src="previews.url" :style="previews.img" class="img" alt="头像" />
        </div>
      </div>
    </div>

    <div class="btn-container">
      <div class="scope-btn">
        <el-upload
          action="#"
          :http-request="handleHttpRequest"
          :show-file-list="false"
          :before-upload="beforeUpload"
          class="upload-img"
        >
          <el-button type="primary" plain icon="el-icon-upload">选择</el-button>
        </el-upload>
        <el-button type="primary" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
        <el-button type="primary" plain icon="el-icon-zoom-out" @click="changeScale(-1)">缩小</el-button>
        <el-button type="primary" plain @click="rotateLeft">↺ 左旋转</el-button>
        <el-button type="primary" plain @click="rotateRight">↻ 右旋转</el-button>
        <el-button type="primary" plain icon="el-icon-download" @click="downloadImg('blob')">下载</el-button>
        <el-button type="primary" icon="el-icon-upload2" @click="uploadImage" class="upload-btn">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { VueCropper } from "vue-cropper";

interface CropperItem {
  div: {
    height: string;
    width: string;
  };
  html: string;
  img: {
    height: string;
    transform: string;
    width: string;
  };
  url: string;
  w: number;
  h: number;
}

@Component({ name: "Cropper", components: { VueCropper } })
export default class extends Vue {
  // 缩略图对象
  public previews: CropperItem = {
    div: {
      height: "",
      width: "",
    },
    html: "",
    img: {
      height: "",
      transform: "",
      width: "",
    },
    url: "",
    w: 0,
    h: 0,
  };
  public options = {
    img: "", // 图片地址
    outputSize: 1, // 裁剪生成图片的质量
    outputType: "png", // 裁剪生成图片的格式（下载）
    info: true, // 裁剪框的大小信息
    canScale: false, // 图片是否允许滚轮缩放
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 200, // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixedNumber: [1, 1], // 截图框的宽高比例
    fixedBox: false, // 固定截图框大小 不允许改变
    fixed: false, // 是否开启截图框宽高固定比例
    canMove: true, // 上传图片是否可以移动
    canMoveBox: true, // 截图框能否拖动
    original: false, // 上传图片按照原始比例渲染
    centerBox: true, // 截图框是否被限制在图片里面
    infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    full: true, // 是否输出原图比例的截图
    enlarge: "1", // 图片根据截图框输出比例倍数
    mode: "contain", // 图片默认渲染方式
  };

  @Prop({ default: "" })
  public imgLink!: string;
  @Prop({ default: "blob" })
  public imageType!: "blob" | "base64"; // 图片类型
  @Prop({ default: 200 })
  public cropWidth!: number; // 截图框宽度
  @Prop({ default: 200 })
  public cropHeight!: number; // 截图框高度
  @Prop({ default: 350 })
  public cropContainerHeight!: number; // 截图容器高度

  mounted() {
    this.options.autoCropWidth = this.cropWidth || 200;
    this.options.autoCropHeight = this.cropHeight || 200;
    this.options.img = this.imgLink || "";
  }

  // 实时缩略图的回调
  public realTime(image: any) {
    this.previews = image;
  }
  // 上传图片前的校验
  public beforeUpload(file: any) {
    if (file.type.indexOf("image/") == -1) {
      this.$message({
        message: "文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。",
        type: "error",
      });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.options.img = reader.result as string; // Base64
      };
    }
  }
  public uploadImage() {
    let formData = new FormData();
    if (this.imageType === "blob") {
      (this.$refs.cropper as any).getCropBlob((data: Blob) => {
        let timer = new Date().getTime();
        formData.append("file", data, timer + ".png");
        this.$emit("upload-image", formData);
      });
    } else if (this.imageType === "base64") {
      (this.$refs.cropper as any).getCropData((data: string) => {
        formData.append("images", data);
        this.$emit("upload-image", formData);
      });
    } else {
      this.$message({
        message: "图片类型错误！请传入 blob 或者 base64",
        type: "error",
      });
    }
  }
  // 下载图片
  public downloadImg(type?: string) {
    let aLink = document.createElement("a");
    let timer = new Date().getTime();
    aLink.download = timer + ""; // 文件名
    if (type === "blob") {
      // 获取截图的 blob 数据
      (this.$refs.cropper as any).getCropBlob((data: Blob) => {
        aLink.href = window.URL.createObjectURL(data); // 生成 blob 格式图片路径
        aLink.click();
      });
    } else {
      // 获取截图的 base64 数据
      (this.$refs.cropper as any).getCropData((data: string) => {
        aLink.href = data;
      });
    }
  }

  // 向左旋转
  public rotateLeft() {
    (this.$refs.cropper as any).rotateLeft();
  }
  // 向右旋转
  public rotateRight() {
    (this.$refs.cropper as any).rotateRight();
  }
  // 图片缩放
  public changeScale(num: number) {
    num = num || 1;
    (this.$refs.cropper as any).changeScale(num);
  }

  // 手动上传的回调，目前为了取消自动上传
  public handleHttpRequest() {}
}
</script>

<style lang="scss" scoped>
.cropper-component {
  .cropper-content {
    display: flex;
    .cropper-img {
      width: 50%;
      height: 100%;
      position: relative;
    }
    .show-previews {
      display: flex;
      display: --webkit-flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      padding-left: 10px;
      .previews-img {
        border-radius: 50%;
        overflow: hidden;
        -webkit-box-shadow: 0 0 4px #ccc;
        box-shadow: 0 0 4px #ccc;
      }
    }
  }

  .btn-container {
    .scope-btn {
      margin-top: 50px;
      .upload-img {
        display: inline-block;
        margin-right: 30px;
      }
    }
    .upload-btn {
      margin-left: 30px;
    }
  }
}
</style>
