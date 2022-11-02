<template>
  <div class="tinymce-components" :class="{ fullscreen: fullscreen }" :style="{ width: containerWidth }">
    <tinymce-editor :id="id" v-model="tinymceContent" :init="initOptions" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import tinymce from "tinymce/tinymce";
import TinymceEditor from "@tinymce/tinymce-vue";
import { plugins, toolbar } from "./config";
import { LayoutModule } from "@/store/modules/layout";
// Docs: https://www.tiny.cloud/docs/advanced/usage-with-module-loaders/
// Import TinyMCE
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/help";
import "tinymce/plugins/image";
import "tinymce/plugins/importcss";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/preview";
import "tinymce/plugins/save";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/table";
import "tinymce/plugins/template";
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
  @Prop({ default: "file edit insert view format table" })
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
      height: this.height,
      body_class: "panel-body",
      object_resizing: false,
      plugins: plugins,
      toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
      menubar: this.menubar,
      language: this.language,
      language_url: this.language === "en-US" ? "" : `/public/tinymce/langs/${this.language}.js`,
      skin_url: "/public/tinymce/skins/",
      emoticons_database_url: "/public/tinymce/emojis.min.js",
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

  // @Watch("language")
  // public onLanguageChange() {
  //   const tinymceInstance = tinymce.get(this.id);
  //   if (this.fullscreen) {
  //     tinymce.execCommand("mceFullScreen");
  //   }
  //   if (tinymceInstance) {
  //     tinymce.remove(this.id);
  //   }
  //   this.$nextTick(() => tinymce.init(this.initOptions));
  // }

  beforeDestroy() {
    tinymce.remove(this.id);
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

  .mce-fullscreen {
    z-index: 10000;
  }
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 1002;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}

textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
