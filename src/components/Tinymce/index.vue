<template>
  <div class="tinymce-component" :class="{ fullscreen: fullscreen }">
    <tinymce-editor :id="id" v-model="tinymceContent" :init="initOptions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TinymceEditor from "@tinymce/tinymce-vue";
import { plugins, toolbar } from "./config";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/themes/mobile";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/fullpage";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/help";
import "tinymce/plugins/hr";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/print";
import "tinymce/plugins/save";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/tabfocus";
import "tinymce/plugins/table";
import "tinymce/plugins/template";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/quickbars";
import "../../../public/tinymce/plugins/axupimgs";

@Component({ name: "Tinymce", components: { TinymceEditor } })
// TinyMce 文档：https://www.tiny.cloud/docs/
export default class extends Vue {
  @Prop({ required: true })
  public value!: string; // 内容
  @Prop({ default: false })
  public disabled!: boolean; // 编辑器是否禁用
  @Prop({ default: "default" })
  public theme!: "default" | "dark" | "tinymce-5" | "tinymce-5-dark"; // UI 主题
  @Prop({ default: "" })
  public contentTheme!: "default" | "dark" | "document" | "tinymce-5" | "tinymce-5-dark"; // 内容区主题，如果不传，默认等于 UI 主题
  @Prop({ default: () => "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "") })
  public id!: string; // 编辑器 id
  @Prop({ default: "file edit view insert format tools table help" })
  public menubar!: string; // 菜单区
  @Prop({ default: () => [] })
  public toolbar!: string[]; // 工具区
  @Prop({ default: "sliding" })
  public toolbarMode!: "floating" | "sliding" | "scrolling" | "wrap"; // 工具区超出一行的显示模式，floating：鼠标悬浮显示；sliding：鼠标点击显示；scrolling：鼠标滚动显示；wrap：直接换行显示
  @Prop({ default: "360px" })
  public height!: string | number; // 编辑器高度
  @Prop({ default: "auto" })
  public width!: string | number; // 编辑器宽度
  @Prop({ default: "zh-CN" })
  public lang!: string; // 编辑器语言
  @Prop({ default: true })
  public move!: true | false | "both"; // true：编辑器可以垂直移动；false：编辑器无法移动；both：编辑器垂直和水平都可以移动

  public fullscreen = false;

  // https://www.tiny.cloud/docs/configure/localization/#language
  public languageTypeList: { [key: string]: string } = {
    "en-US": "en",
    "zh-CN": "zh_CN",
  };

  get language() {
    return this.languageTypeList[this.lang];
  }

  get tinymceContent() {
    return this.value;
  }

  set tinymceContent(value) {
    this.$emit("input", value);
  }

  get skinTheme() {
    if (this.theme === "default") {
      return "oxide";
    } else if (this.theme === "dark") {
      return "oxide-dark";
    }
    return this.theme;
  }

  get initOptions() {
    return {
      selector: `#${this.id}`,
      deprecation_warnings: false,
      width: this.width,
      min_width: 60,
      height: this.height,
      min_height: 60,
      body_class: "panel-body",
      resize: this.move,
      plugins: plugins,
      toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
      toolbar_mode: this.toolbarMode,
      menubar: this.menubar,
      language: this.language,
      // language_url: this.language === "en" ? "" : `${process.env.BASE_URL}tinymce/langs/${this.language}.js`,
      base_url: process.env.VUE_APP_PUBLIC_PATH === "/" ? "/tinymce" : `${process.env.VUE_APP_PUBLIC_PATH}/tinymce`,
      skin: this.skinTheme,
      content_css: this.contentTheme ? this.contentTheme : this.theme,
      emoticons_database_url:
        process.env.VUE_APP_PUBLIC_PATH === "/"
          ? "tinymce/emojis.min.js"
          : `${process.env.VUE_APP_PUBLIC_PATH}/tinymce/emojis.min.js`,
      end_container_on_empty_block: true,
      draggable_modal: true,
      powerpaste_word_import: "clean",
      autosave_restore_when_empty: true,
      code_dialog_height: 450,
      code_dialog_width: 1000,
      imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
      default_link_target: "_blank",
      link_title: false,
      nonbreaking_force_tab: true,
      insertdatetime_formats: ["%H:%M:%S", "%Y-%m-%d", "%I:%M:%S %p", "%D"],
      convert_urls: false,
      paste_data_images: true, // https://www.tiny.cloud/docs/tinymce/6/upload-images/
      images_file_types: "jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp", // 支持的上传图片类型
      template_mdate_format: "%Y-%m-%d : %H:%M:%S",
      template_replace_values: {
        username: "Kobe Liu",
        staffid: "100338",
      },
      template_preview_replace_values: {
        preview_username: "Kobe Liu",
        preview_staffid: "100338",
      },
      templates: [
        {
          title: "当前时间",
          description: "当前时间模板",
          content: '<p class="mdate">例如：1999-07-27 07:27:27，当然以您目前的时间为准</p>',
        },
        {
          title: "您的身份",
          description: "您的身份模板，您的身份将会放在 ${} 里",
          content: "<p>Name: {$username}, StaffID: {$staffid}</p>",
        },
        {
          title: "您的身份",
          description: "您的身份模板，这里仅是预览，输出后不是实际的效果",
          content: "<p>Name: {$username}, StaffID: {$staffid}</p>",
        },
      ],
      init_instance_callback: (editor: any) => {
        if (this.value) {
          editor.setContent(this.value);
        }
        editor.on("NodeChange Change KeyUp SetContent", () => {
          this.$emit("input", editor.getContent());
        });
      },
      setup: (editor: any) => {
        editor.on("FullscreenStateChanged", (e: any) => {
          this.fullscreen = e.state;
        });
      },
      // 图片上传回调
      images_upload_handler: (blobInfo: Function, success: Function, failure: Function, progress: Function) => {
        this.$emit("img-upload", blobInfo, success, failure, progress);
      },
      // 附件上传回调
      file_picker_callback: (callback: any, value: any, meta: any) => {
        let filetype =
          ".pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4,.mkv, .avi,.wmv, .rmvb,.mov,.mpg,.mpeg,.webm, .jpg, .jpeg, .png, .gif"; //限制文件的上传类型
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", filetype);
        const _this = this;
        input.onchange = function () {
          const file = (this as any).files[0];
          _this.$emit("file-upload", file, meta.filetype, callback);
        };
        input.click();
      },
    };
  }

  mounted() {
    this.onDisabledChange();
  }

  beforeDestroy() {
    this.destroyTinymce();
  }

  destroyTinymce() {
    const tinymce = (window as any).tinymce.get(this.id);
    if (this.fullscreen) {
      tinymce.execCommand("mceFullScreen");
    }
    if (tinymce) {
      tinymce.destroy();
    }
  }

  @Watch("language")
  public onLanguageChange() {
    const tinymceManager = (window as any).tinymce;
    const tinymceInstance = tinymceManager.get(this.id);
    if (this.fullscreen) {
      tinymceInstance.execCommand("mceFullScreen");
    }
    if (tinymceInstance) {
      tinymceInstance.destroy();
    }
    this.$nextTick(() => tinymceManager.init(this.initOptions));
  }

  @Watch("disabled")
  public onDisabledChange() {
    const tinymceInstance = (window as any).tinymce.get(this.id);
    if (tinymceInstance) {
      let status = this.disabled ? "readonly" : "design";
      tinymceInstance.mode.set(status);
    }
  }
}
</script>

<style lang="scss">
.tinymce-component {
  position: relative;
  line-height: normal;

  .tox-fullscreen {
    z-index: 1010 !important;
  }
}
</style>
