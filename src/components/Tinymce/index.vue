<template>
  <div class="tinymce-components" :class="{ fullscreen: fullscreen }" :style="{ width: containerWidth }">
    <tinymce-editor :id="id" v-model="tinymceContent" :init="initOptions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TinymceEditor from "@tinymce/tinymce-vue";
import { plugins, toolbar } from "./config";
import { LayoutModule } from "@/store/modules/layout";
// Docs: https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/
import "tinymce/tinymce";
// Default icons are required for TinyMCE 5.3 or above
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/themes/mobile";
import "tinymce/skins/content/default/content.css";
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

@Component({
  components: {
    TinymceEditor,
  },
})
export default class Tinymce extends Vue {
  @Prop({ required: true })
  public value!: string;
  @Prop({ default: () => "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "") })
  public id!: string;
  @Prop({ default: () => [] })
  public toolbar!: string[];
  @Prop({ default: "file edit view insert format tools table help" })
  public menubar!: string;
  @Prop({ default: "360px" })
  public height!: string | number;
  @Prop({ default: "auto" })
  public width!: string | number;

  public hasChange = false;
  public hasInit = false;
  public fullscreen = false;

  // https://www.tiny.cloud/docs/configure/localization/#language
  // when adding a new language, please also add the corresponding lang file under public/tinymce/langs folder
  public languageTypeList: { [key: string]: string } = {
    "en-US": "en",
    "zh-CN": "zh_CN",
    es: "es",
    ja: "ja",
    ko: "ko_KR",
    it: "it",
  };

  get language() {
    return this.languageTypeList[LayoutModule.language];
  }

  get tinymceContent() {
    return this.value;
  }

  set tinymceContent(value) {
    this.$emit("input", value);
  }

  get containerWidth() {
    const width = this.width;
    if (/^[\d]+(\.[\d]+)?$/.test(width.toString())) {
      return `${width}px`;
    }
    return width;
  }
  get initOptions() {
    return {
      selector: `#${this.id}`,
      deprecation_warnings: false,
      height: this.height,
      body_class: "panel-body",
      object_resizing: false,
      plugins: plugins,
      toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
      menubar: this.menubar,
      language: this.language,
      language_url: this.language === "en" ? "" : `${process.env.BASE_URL}tinymce/langs/${this.language}.js`,
      skin_url: `${process.env.BASE_URL}tinymce/skins/ui/oxide`,
      emoticons_database_url: `${process.env.BASE_URL}tinymce/emojis.min.js`,
      content_css: `${process.env.BASE_URL}tinymce/skins/content/default/content.css`,
      end_container_on_empty_block: true,
      powerpaste_word_import: "clean",
      code_dialog_height: 450,
      code_dialog_width: 1000,
      advlist_bullet_styles: "square",
      advlist_number_styles: "default",
      imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
      default_link_target: "_blank",
      link_title: false,
      // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
      nonbreaking_force_tab: true,
      // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
      // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
      convert_urls: false,
      init_instance_callback: (editor: any) => {
        if (this.value) {
          editor.setContent(this.value);
        }
        this.hasInit = true;
        editor.on("NodeChange Change KeyUp SetContent", () => {
          this.hasChange = true;
          this.$emit("input", editor.getContent());
        });
      },
      setup: (editor: any) => {
        editor.on("FullscreenStateChanged", (e: any) => {
          this.fullscreen = e.state;
        });
      },
    };
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

  // public imageSuccessCBK(arr: IUploadObject[]) {
  //   const tinymce = (window as any).tinymce.get(this.id)
  //   arr.forEach(v => {
  //     tinymce.insertContent(`<img class="wscnph" src="${v.url}" >`)
  //   })
  // }
}
</script>

<style lang="scss">
.tinymce-components {
  position: relative;
  line-height: normal;

  .tox-fullscreen {
    z-index: 10000 !important;
  }
}

textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
